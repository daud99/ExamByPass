<template>
<div>
    <v-card class="mx-auto" v-if="this.showList">

        <v-list subheader two-line>
            <v-subheader inset>Exams</v-subheader>

            <template v-for="exam in this.exams">
                <div :key="exam.id" v-on:click="myMethod(exam.id,exam.exam_number)">
                    <a class="list-group-item list-group-item-action">
                        <v-list-item class="table-hover">

                            <v-list-item-avatar>
                                <v-icon class="grey lighten-2" dark>
                                    mdi-file
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
                                        <v-btn class="ma-2" v-bind="attrs" v-on="on" fab outlined color="indigo">
                                            <v-icon>mdi-format-list-bulleted-square</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item v-for="(item, i) in items" :key="i" @click="() => {}">
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
        <div>
            <v-row justify="center">
                <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">

                    <v-card>

                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="dialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>{{this.examName}}</v-toolbar-title>
                        </v-toolbar>
                        <v-tabs grow background-color="indigo" v-model="tab" dark>
                            <v-tab v-for="item in tabItems" :key="item">
                                {{item}}
                            </v-tab>

                        </v-tabs>
                        <v-tabs-items v-model="tab">
                            <v-tab-item v-for="item in tabItems" :key="item">
                                <v-card flat>
                                    <v-card-text>
                                        <div class="row">
                                            <div class="col col-lg-12 col-md-12 col-xs-12">
                                                <button type="button" class="btn btn-sm btn-primary btn-block">
                                                    <h4 style="color:white; text-weigth:bolder; line-height: 1.6;">
                                                        <v-icon color="white">mdi-play</v-icon>
                                                        CONTINUE LAST SESSION
                                                    </h4>
                                                    <h6 style="color:white; text-weigth:bolder; line-height: 1.6;">AT QUESTION 1/3</h6>
                                                </button>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <v-col cols="12" sm="4" class="py-2">
                                                <v-btn-toggle v-model="toggle_exclusive" mandatory tile color="blue accent-3">

                                                    <v-btn x-large block>
                                                        <v-icon>mdi-clock</v-icon>
                                                        <h6>ALL QUESTIONS </h6>
                                                    </v-btn>

                                                    <v-btn x-large block>
                                                        <v-icon>mdi-clock</v-icon>
                                                        SPECIFIC EXAMS
                                                    </v-btn>
                                                    <v-btn x-large block>
                                                        <v-icon>mdi-clock</v-icon>
                                                        INCORRECT QUESTIONS
                                                    </v-btn>

                                                </v-btn-toggle>
                                            </v-col>

                                        </div>
                                        <div class="row" v-if="item==='EXAM MODE'">
                                            <div class="col col-lg-12 col-md-12 col-xs-12">
                                                <h6>Candidate Name</h6>

                                                <v-text-field hide-details="auto"></v-text-field>
                                            </div>
                                        </div>
                                        <div class="row" v-if="toggle_exclusive===2">
                                            <div class="col col-lg-12 col-md-12 col-xs-12">

                                                <h6>Incorrectly answered at least</h6>
                                            </div>
                                            <div class="col col-lg-8 col-md-8 col-xs-8">
                                                <v-select :items="incorrectTimes" label="Incorrectly answered at least  "></v-select>
                                            </div>
                                            <div class="col col-lg-4 col-md-4 col-xs-4">
                                                <v-btn large class="ma-2" outlined color="indigo">
                                                    RESET
                                                </v-btn>

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
                                            <div class="col col-lg-6 col-md-6 col-xs-6">
                                                <v-checkbox label="Question order (Unavailable in trail mode)" color="success" value="primary" hide-details></v-checkbox>
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

                                                <v-switch v-model="selected_check" color="primary" :label="checkbox.type" :value='checkbox.type'></v-switch>
                                            </div>

                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>

                    </v-card>
                    <v-footer :fixed='true' color="primary
                    " padless>

                        <v-row justify="end" no-gutters>
                            <v-btn outlined color="white" class="my-2" @click="dialog = false">
                                CANCEL
                            </v-btn>
                            <v-btn color="primary" class="ma-2" v-on:click="startExam()">
                                START EXAM
                            </v-btn>

                        </v-row>

                    </v-footer>
                </v-dialog>
            </v-row>
        </div>

    </v-card>
    <div class="scrolll" v-else-if="!this.showList">
        <Main :examId="examId" :selectedCheck="selected_check" :selectedRandomAnswer="selectedRandomAnswer" />
    </div>

</div>
</template>

<script>
import axios from "axios";
import Main from "../questionTypes/Main"
export default {
    components: {
        Main
    },
    name: "Exams",
    data: () => {
        return {
            dialog: false,
            exams: [],
            examName: "",
            tab: null,
            checkBox: [],
            selected_check: [],
            selectedRandomAnswer: [],
            totalQuestions: 50,
            countQuestion: 0,
            totalScore: 800,
            obtainScore: 0,
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
            incorrectTimes: ["5 questions answered incorrectly one time", "5 questions answered incorrectly two time"],
            examId: Number,
            showList: true,
            items: [{
                    title: 'Delete',

                },
                {
                    title: 'Statistics',
                },
                {
                    title: 'Open in Editor',
                },

            ],

        }

    },
    created() {
        console.log("created")
        this.getExams()
    },
    methods: {

        getExams() {
            console.log("i am exam")
            axios
                .get("/exams")
                .then((resp) => {
                    console.log(resp);
                    this.exams = resp.data;
                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        gettypes(id) {
            console.log("i am types")
            axios
                .get("/types/" + id)
                .then((resp) => {
                    console.log("get type", resp);
                    this.checkBox = resp.data;
                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        myMethod(id, name) {

            //this.showList = false
            this.examId = id;
            this.examName = name
            this.gettypes(id)
            console.log("i am tet", this.examId, name)
            this.dialog = true

        },
        startExam() {
            this.showList = false
            this.dialog = false
        }
    },
    updated() {
        console.log("i am updated", this.selected_check, this.selectedRandomAnswer)
    }
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
</style>
