<template>
<div>
    <v-card class="mx-auto " v-if="this.showList">

        <v-list subheader two-line v-if="this['auth/isAuthenticated']">
            <v-subheader inset>Exams</v-subheader>
            <loading :active.sync="isLoading" :can-cancel="false" :height='80' :width='80' loader='bars' color='green' :is-full-page="fullPage"></loading>
            <template v-for="exam in this.exams">
                <div :key="exam.id" v-on:click="myMethod(exam.id,exam.exam_number,exam.exam_name,exam.time_limit)">
                    <a class="list-group-item list-group-item-action" v-if="!exam.deleted">
                        <v-list-item class="table-hover">

                            <v-list-item-avatar>
                                <v-icon color="rgba(0,0,0,0.54) " size='25px' dense>
                                    mdi-file-outline
                                </v-icon>
                            </v-list-item-avatar>
                            <v-hover>
                                <v-list-item-content>
                                    <v-list-item-title v-text="exam.exam_number"></v-list-item-title>

                                    <v-list-item-subtitle>{{exam.real_question_count}} questions</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-hover>
                            <v-list-item-action>
                                <v-list-item-action-text>Time Limit:{{exam.time_limit}}</v-list-item-action-text>
                                <v-menu bottom offset-y>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn medium class="ma-2" v-bind="attrs" v-on="on" fab outlined color="rgba(0,0,0,0.54)">
                                            <v-icon>mdi-format-list-bulleted-square</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item v-for="(item, i) in items" :key="i" @click="listItem(item,exam.id)">
                                            <v-list-item-title>{{ item.title }}</v-list-item-title>

                                        </v-list-item>

                                    </v-list>
                                </v-menu>
                            </v-list-item-action>

                        </v-list-item>
                    </a>
                </div>
            </template>

        </v-list>
        <div class="toolbar">
            <v-row justify="center">
                <v-dialog class="toolbar" v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">

                    <v-card>

                        <v-toolbar class="toolbar" dark color="green lighten-1">
                            <v-btn icon dark @click="close()">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>{{this.examName}}</v-toolbar-title>
                        </v-toolbar>
                        <v-tabs grow background-color="green lighten-5" color="green accent-4" v-model="tab" light>
                            <v-tab c v-for="item in tabItems" :key="item">
                                {{item}}
                            </v-tab>

                        </v-tabs>
                        <v-tabs-items v-model="tab">
                            <v-tab-item v-for="item in tabItems" :key="item">
                                <v-card flat>
                                    <v-card-text>
                                        <div v-if="examSessionLength>0 && !isDelete" class="row">
                                            <a class="col col-lg-12 col-md-12 col-xs-12" v-on:click="startExam(true)">
                                                <div class="col col-lg-12 col-md-12 col-xs-12">
                                                    <button type="button" class="btn btn-sm btn-success btn-block">
                                                        <h4 style="color:white; text-weigth:bolder; line-height: 1.6;">
                                                            <v-icon color="white">mdi-play</v-icon>
                                                            CONTINUE LAST SESSION
                                                        </h4>
                                                        <h6 style="color:white; text-weigth:bolder; line-height: 1.6;">AT QUESTION {{counterL+1}}/{{totalQuestions}}</h6>
                                                    </button>
                                                </div>
                                            </a>
                                        </div>
                                        <div>

                                            <div class="row">
                                                <div class="col col-lg-6 col-md-6 col-xs-6">
                                                    <b-button variant="outline-success" block @click="toggleButton(0)" :pressed.sync="myToggle">
                                                        <v-icon>mdi-clock</v-icon>
                                                        ALL QUESTIONS

                                                    </b-button>
                                                </div>
                                                <div class="col col-lg-6 col-md-6 col-xs-6">
                                                    <b-button variant="outline-success" block @click="toggleButton(1)" :pressed.sync="myToggle2">
                                                        <v-icon>mdi-clock</v-icon>
                                                        SPECIFIC EXAMS
                                                    </b-button>
                                                </div>
                                            </div>

                                        </div>

                                        <div class="row" v-if="item==='EXAM MODE'">
                                            <div class="col col-lg-12 col-md-12 col-xs-12">
                                                <h6>Candidate Name</h6>

                                                <v-text-field v-model="candidateName" hide-details="auto"></v-text-field>
                                            </div>
                                        </div>
                                        <div class="row" v-if="toggle_exclusive===1">
                                            <div class="col col-lg-12 col-md-12 col-xs-12">

                                                <h6>Select Exam</h6>
                                            </div>
                                            <div class="col col-lg-8 col-md-8 col-xs-8">
                                                <v-select :items="examTab" v-model="slectedExamTab" label="Select Exam" @input="structureEntryQuestion()"></v-select>
                                            </div>

                                        </div>
                                        <div class="row" v-if="item==='TRAINING MODE'">
                                            <div class="col col-lg-12 col-md-12 col-xs-12">
                                                <h6>WE SHOW YOU THE CORRECT ANSWER AFTER EACH QUESTION. THERE IS NO TIME LIMIT DURING TRAINING</h6>

                                            </div>
                                        </div>
                                        <div class="row" v-if="item==='EXAM MODE'">
                                            <div class="col col-lg-12 col-md-12 col-xs-12">
                                                <h6>The timer is on and correct answers will not be shown after each question.</h6>

                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col col-lg-6 col-md-6 col-xs-6 pa-0">
                                                <p>RANDOMIZE</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col col-lg-6 col-md-6 col-xs-6" v-if="subscriptionStatus === 'active'">
                                                <v-checkbox v-model="selectedRandomQuestion" label="Question order (Unavailable in trail mode)" color="success" value="Question order" hide-details></v-checkbox>
                                            </div>
                                            <div v-else class="col col-lg-6 col-md-6 col-xs-6">
                                                <v-checkbox v-model="selectedRandomQuestion" disabled label="Question order (Unavailable in trail mode)" color="success" value="Question order" hide-details></v-checkbox>
                                            </div>
                                            <div class="col col-lg-6 col-md-6 col-xs-6">
                                                <v-checkbox v-model="selectedRandomAnswer" label="Answer order" color="success" value="Answer order" hide-details></v-checkbox>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col col-lg-12 col-md-12 col-xs-12 pa-0">
                                                <p>Question Types</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col col-lg-4 col-md-4 col-xs-4" v-for="checkbox in checkBox" :key="checkbox.id">

                                                <v-switch v-model="selected_check" aria-checked="false" color="green lighten-1" :label="checkbox.type" :value='checkbox.type'></v-switch>
                                            </div>

                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>

                    </v-card>
                    <v-footer :fixed='true' color="green lighten-1
                    " padless>

                        <v-row justify="end" no-gutters>
                            <v-btn outlined color="white" class="my-2" @click="dialog = false">
                                CANCEL
                            </v-btn>
                            <v-btn color="green" class="ma-2" v-on:click="startExam(false)">
                                START EXAM
                            </v-btn>

                        </v-row>

                    </v-footer>
                </v-dialog>
            </v-row>
        </div>

    </v-card>
    <div v-if="this.deletedDialog">
        <deletedExam :exams='this.exams' :deletedDialog='this.deletedDialog' />
    </div>
    <div>
        <v-dialog v-model="loginDialog" persistent max-width="1000px">

            <v-card>
                <v-card-title>Please Sign in</v-card-title>
                <v-card-text>
                    <login />
                </v-card-text>

            </v-card>
        </v-dialog>
    </div>

</div>
</template>

<script>
import axios from "axios";
import Main from "../questionTypes/Main";
import deletedExam from "./deletedExamDialog";

import {
    mapActions,
    mapGetters
} from 'vuex';
import vue from 'vue'
import {
    quickRequest
} from "../../../common/misc.js"
import Swal from "sweetalert2";
import EventBus from "../../Event/eventBus"
import login from '../../views/login/Login'
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    components: {
        Main,
        deletedExam,
        login,
        Loading

    },
    props: {
        showLogin: Boolean
    },
    name: "Exams",
    data: () => {
        return {
            examSessionLength: 0,
            dialog: false,
            candidateName: '',
            myToggle: true,
            myToggle2: false,
            deletedDialog: false,
            isLoading: false,
            fullPage: true,
            loginDialog: false,
            exams: [],
            examName: "",
            slectedExamTab: "",
            structureEntryQuestionn: [],
            tab: null,
            checkBox: [],
            selected_check: [],
            selectedRandomAnswer: [],
            selectedRandomQuestion: [],
            totalQuestions: Number,
            counterL: Number,
            countQuestion: 0,
            totalScore: 800,
            obtainScore: 0,
            isDelete: Boolean,
            checkBox1: [{
                type: 'Drag and Drop',
                id: 1
            }, {
                type: 'Single choice',
                id: 2
            }, {
                type: 'Multiple choice',
                id: 3
            }],
            toggle_exclusive: 0,
            tabItems: [
                'TRAINING MODE', 'EXAM MODE'
            ],
            examType: [],
            filterExamType: [],
            examTab: [],
            examId: Number,
            examTime: Number,
            showList: true,
            subscriptionStatus: String,
            localKeys: ["examId", "selectedCheck", "selectedRandomAnswer", "candidateName", "selectedTab", "structureEntryQuestionn", "condition"],
            items: [{
                    title: 'Delete',

                },

            ],

        }

    },
    created() {

        console.log("created exam")
        // this.localKeys.forEach(k =>
        //     localStorage.removeItem(k)
        // );
        localStorage.setItem("condition", JSON.stringify(true));
        console.log("created", this["auth/getUser"], this["auth/isAuthenticated"], !this.showLogin)
        if (!this["auth/isAuthenticated"]) {
            console.log("please sign in")
            if (!this.showLogin) {
                this.loginDialog = true
            }
            localStorage.setItem("subscriptionStatus", JSON.stringify('undefined'));
        } else {
            this.subscriptionStatus = this["auth/getUser"].subscription_status
            localStorage.setItem("subscriptionStatus", JSON.stringify(this["auth/getUser"].subscription_status));
        }
        if (this["auth/isAuthenticated"]) {
            this.getExams()
        }
        //this.getSubscription()

    },
    updated() {
        console.log("updated", this.toggle_exclusive)
    },
    mounted() {
        EventBus.$on('delete', () => {
            console.log("i am bus")
            this.deletedDialog = true

        });
    },
    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
    },
    methods: {
        test(a, b, c) {
            console.log("i am test", a, b, c)
        },
        toggleButton(number) {
            if (number === 0) {
                this.toggle_exclusive = 0
                this.myToggle = true
                this.myToggle2 = false
            } else if (number === 1) {
                this.myToggle = false
                this.myToggle2 = true
                this.toggle_exclusive = 1
            }
        },
        async getExamSession(id) {
            let user_id = this["auth/getUser"].id
            this.selected_check = []
            try {
                let response = await quickRequest("/getExamsession", "GET", {}, user_id, id);
                if ("error" in response) {
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Error",
                        text: response.error,
                    });
                }
                if (response) {
                    this.examSessionLength = response.examSessions.length

                    if (response.examSessions.length > 0) {
                        this.examId = response.examSessions[0].examId
                        this.selected_check = JSON.parse(response.examSessions[0].selectedCheck)
                        this.candidateName = response.examSessions[0].candidateName
                        this.tab = response.examSessions[0].selectedTab
                        this.selectedRandomAnswer = JSON.parse(response.examSessions[0].selectedRandomAnswer)
                        this.selectedRandomQuestion = JSON.parse(response.examSessions[0].selectedRandomQuestion)
                        this.counterL = response.examSessions[0].counterL
                        this.totalQuestions = response.examSessions[0].totalQuestions
                        this.isDelete = response.examSessions[0].isDelete

                    }

                }
            } catch (e) {
                console.log(e)
                Swal.fire({
                    type: "error",
                    title: "Error Occured",
                    text: "Error occured while retriving session",
                });
            }
        },

        async getSubscription() {
            let user_id = this["auth/getUser"].id

            try {
                if (user_id !== undefined) {

                    let response = await quickRequest("/getSubscription", "GET", {}, user_id);

                    this.subscriptionStatus = response.userSubscription[0].status
                    localStorage.setItem("subscriptionStatus", JSON.stringify(response.userSubscription[0].status));
                    if ("error" in response) {
                        Swal.fire({
                            type: "error",
                            icon: "error",
                            title: "Error",
                            text: response.error,
                        });
                    }

                }

            } catch (e) {
                console.log(e)
                Swal.fire({
                    type: "error",
                    title: "Error Occured",
                    text: "Error occured while retriving session",
                });
            }
        },

        getExams() {
            this.isLoading = true;
            axios
                .get("/exams/" + this["auth/getUser"].id)
                .then((resp) => {

                    // this.exams = resp.data;
                    var results = resp.data.filter(function (entry) {
                        return entry.users.length !== 0;
                    });
                    this.exams = results;
                    console.log(resp, results)
                    this.isLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getExamType(id) {

            axios
                .get("/structureEntry/" + id)
                .then((resp) => {

                    this.examType = resp.data;
                    let tab = resp.data.map(t => t.name);
                    this.examTab = tab

                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        gettypes(id) {
            // console.log("i am types")
            this.checkBox = []
            this.selected_check = []
            axios
                .get("/types/" + id)
                .then((resp) => {
                    //   console.log("get type", resp);
                    this.checkBox = resp.data;
                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        listItem(item, id) {

            if (item.title === "Delete") {
                this.deleteExam(id)
            }
        },
        deleteExam(id) {

            axios
                .put("/delete/" + id)
                .then(() => {
                    Swal.fire({
                        type: "Success",
                        title: "Deleted",
                        text: "Exam is deleted successfully",
                    });
                    this.getExams()
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //beleo is get called from deletedexamdialog
        clickFalse() {
            this.deletedDialog = false
        },
        myMethod(id, name, examName, time, loginDialogg) {
            console.log(id, name, examName, time, loginDialogg)
            //this.showList = false
            if (loginDialogg) {
                this.loginDialog = false
            }
            this.examId = id;
            this.examName = name
            this.examTime = time
            vue.prototype.$examName = examName
            localStorage.setItem("examName", JSON.stringify(examName));
            this.checkBox = []
            console.log("i am mymethod")
            this.gettypes(id)
            this.getExamType(id)
            // this.getExamSession(id)

            //   console.log("i am tet", this.examId, name)
            this.dialog = true

        },
        structureEntryQuestion() {
            let sendTab = this.examType.filter(st => st.name === this.slectedExamTab)
            let sendTabId = sendTab[0].id
            axios
                .get("/structureEntryQuestion/" + sendTabId)
                .then((resp) => {

                    let sortedArray = resp.data.map(sa => sa.questionId)
                    this.structureEntryQuestionn = sortedArray

                })
                .catch((err) => {
                    console.log(err);
                });

        },
        startExam(condition) {

            let sendTab = this.examType.filter(st => st.name === this.slectedExamTab)
            this.filterExamType = sendTab
            this.showList = false
            let random = Math.random()
            localStorage.removeItem("timer_now")

            localStorage.setItem("examId", JSON.stringify(this.examId));
            localStorage.setItem("examTime", JSON.stringify(this.examTime));
            localStorage.setItem("selectedCheck", JSON.stringify(this.selected_check));
            localStorage.setItem("selectedRandomAnswer", JSON.stringify(this.selectedRandomAnswer));
            localStorage.setItem("selectedRandomQuestion", JSON.stringify(this.selectedRandomQuestion));
            localStorage.setItem("candidateName", JSON.stringify(this.candidateName));
            localStorage.setItem("selectedTab", JSON.stringify(this.tab));
            localStorage.setItem("structureEntryQuestionn", JSON.stringify(this.structureEntryQuestionn));
            localStorage.setItem("condition", JSON.stringify(condition));
            if (!condition) {
                localStorage.setItem("random", JSON.stringify(random));
            }
            this.$router.push({
                name: "main",
                params: {
                    examId: this.examId,
                    examTime: this.examTime,
                    selectedCheck: this.selected_check,
                    selectedRandomAnswer: this.selectedRandomAnswer,
                    candidateName: this.candidateName,
                    selectedTab: this.tab,
                    structureEntryQuestionn: this.structureEntryQuestionn,
                    condition: condition

                }
            });
            this.dialog = false
        },
        close() {
            this.dialog = false

        }
    },

}
</script>

<style scoped>
.stickyCustom {
    position: sticky;
    top: 0;
    z-index: 999;
}

.scrolll {

    overflow-y: scroll;
    height: 650px;
}

.toolbar {
    z-index: 9999 !important;
}
</style>
