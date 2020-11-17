<template>
<div>
    <loading :active.sync="isLoading" :can-cancel="false" :height='80' :width='80' loader='bars' color='green' :is-full-page="fullPage"></loading>
    <div v-if="is_data_fetched">

        <div v-if="questions[indexVar].type === 'SINGLE_CHOICE'">
            <Single :questionn="questions[indexVar]" :is_called="true" :allowShuffleAnswer='allowShuffleAnswer' :selectedTab='this.selectedTab' ref="single" />
        </div>
        <div v-else-if="questions[indexVar].type === 'MULTIPLE_CHOICE'">
            <Multiple :questionn="questions[indexVar]" :allowShuffleAnswer='allowShuffleAnswer' :selectedTab='this.selectedTab' ref="single" />
        </div>
        <div v-else-if="questions[indexVar].type === 'SELECT_AND_PLACE'">
            <DragAndDrop :questionn="questions[indexVar]" :selectedTab='this.selectedTab' ref="single" />
        </div>
        <div v-else-if="questions[indexVar].type === 'FILL_IN_THE_BLANK'">
            <FillInTheBlank :questionn="questions[indexVar]" :selectedTab='this.selectedTab' ref="single" />
        </div>
        <div v-else-if="questions[indexVar].type === 'HOT_AREA'">
            <HotArea :questionn="questions[indexVar]" :selectedTab='this.selectedTab' ref="single" />
        </div>
        <div style="margin-bottom:100px">
            <v-btn v-if="this.testlet.length !==0" color="primary" @click="this.openDialog" large>
                CASE STUDY
            </v-btn>
        </div>
        <div>
            <Footer :counter='this.counterL' :totalQuestions='this.totalQuestions' :obtainScore="this.obtainScore" />
        </div>
        <v-row justify="center">
            <v-dialog v-model="caseStudyDialog" width="600px">

                <v-card v-if="this.questionTestlet[0] !== undefined">
                    <v-toolbar id="vt" dark color="primary">

                        <v-toolbar-title>{{this.questionTestlet[0].title}}</v-toolbar-title>
                    </v-toolbar>

                    <v-card-text v-html="questionTestlet[0].overview">

                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="green darken-1" text @click="caseStudyDialog = false">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <div v-if="showPricing">
            <pricing :pricingDialog='true' />
        </div>
    </div>
</div>
</template>

<script>
import Single from "./Single.vue";
import Multiple from "./Multiple.vue";
import DragAndDrop from "./DragAndDrop";
import FillInTheBlank from './FillInTheBlank'
import HotArea from './HotArea'
import axios from "axios";
import Footer from "./Footer"
import pricing from '../../views/landing/components/Pricing'
import {
    mapActions,
    mapGetters
} from 'vuex';
import EventBus from "../../Event/eventBus"

import {
    quickRequest
} from "../../../common/misc.js"
import Swal from "sweetalert2";
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
//import Vue from "vue";

export default {
    components: {
        Single,
        Multiple,
        DragAndDrop,
        FillInTheBlank,
        HotArea,
        Footer,
        pricing,
        Loading
    },
    props: {

    },
    data() {
        return {

            questions: [],
            showPricing: false,
            testlet: null,
            questionTestlet: [],
            caseStudyDialog: false,
            au: [],
            error: " ",
            page: 1,
            is_data_fetched: false,
            is_button_disabled: false,
            indexVar: 0,
            counterL: 0,
            totalQuestions: 0,
            allowShuffleAnswer: Boolean,
            allowShuffleQuestion: Boolean,
            isLoading: false,
            fullPage: true,
            wrongQuestion: [],
            correctQuestion: [],
            unansweredQuestion: [],
            firstQuestion: [],
            count: 0,
            examId: Number,
            examTime: Number,
            selectedCheck: Array,
            selectedRandomAnswer: Array,
            selectedRandomQuestion: Array,
            candidateName: String,
            selectedTab: Number,
            structureEntryQuestionn: Array,
            toDestroy: false,
            condition: Boolean,
            toForward: true,
            obtainScore: 0,
            correctCount: 0,
            random: Number,
            isUpdate: false,
            subscriptionStatus: String,
            localKeys: ["examId", "selectedCheck", "selectedRandomAnswer", "candidateName", "selectedTab", "structureEntryQuestionn", "condition"]
        };
    },

    mounted() {

        EventBus.$once('stop', () => {

            console.log("i am bus", this.$route.params.examId, this.examId)
            this.stop()
            //  this.deleteExamsession(this.examId, true)

            this.toDestroy = true

        });

        EventBus.$on('save', () => {

            this.deleteExamsession(this.examId, true)
            this.saveSession(true)

        });
    },
    beforeDestroy: function () {

        window.removeEventListener('beforeunload', this.warning)
        this.offEventbus()
        if (!this.toDestroy && this.toForward) {
            this.deleteExamsession(this.examId, true)
            this.saveSession()
        }

    },
    beforeRouteLeave(to, from, next) {

        if (to.name === "Evaluation" && from.name === 'main' && this.toForward) {

            this.stop()
            return next()
        }
        next()
    },
    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
    },
    created() {

        //localStorage.setItem("obtainScore", JSON.stringify(this.obtainScore));
        this.toForward = true
        if (this.$route.name === 'main') {
            console.log("i am created")
            window.addEventListener('beforeunload', this.warning)
        }
        // window.addEventListener('beforeunload', this.warning)
        //  window.onbeforeunload = this.warning();
        this.toDestroy = false
        this.selectedRandomAnswer = JSON.parse(localStorage.getItem("selectedRandomAnswer"));
        console.log("created 2", this.selectedRandomAnswer[0])
        if (this.selectedRandomAnswer[0] === 'Answer order' && this.selectedRandomAnswer[0] === undefined) {
            console.log("created 3")
            this.allowShuffleAnswer = true
        } else {
            console.log("created 4")
            this.allowShuffleAnswer = false
        }
        console.log("created 5")
        this.examId = JSON.parse(localStorage.getItem("examId"));
        this.examTime = JSON.parse(localStorage.getItem("examTime"));

        if (JSON.parse(localStorage.getItem("selectedCheck")).length === 0) {
            console.log("created 6")
            localStorage.setItem("selectedCheck", JSON.stringify(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "SELECT_AND_PLACE"]));
            this.selectedCheck = ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "SELECT_AND_PLACE"]
        } else {
            console.log("created 7")
            this.selectedCheck = JSON.parse(localStorage.getItem("selectedCheck"));
        }
        //console.log("selectedcheck", JSON.parse(localStorage.getItem("selectedCheck")))

        this.selectedRandomQuestion = JSON.parse(localStorage.getItem("selectedRandomQuestion"));
        this.candidateName = JSON.parse(localStorage.getItem("candidateName"));
        console.log("data is 1")
        this.selectedTab = JSON.parse(localStorage.getItem("selectedTab"));
        this.structureEntryQuestionn = JSON.parse(localStorage.getItem("structureEntryQuestionn"));
        console.log("data is 11")
        this.condition = JSON.parse(localStorage.getItem("condition"));
        this.random = JSON.parse(localStorage.getItem("random"));
        console.log("data is 111", this.random)
        this.subscriptionStatus = JSON.parse(localStorage.getItem("subscriptionStatus"));
        console.log("data is 1111")
        console.log("data is2", this.selectedRandomAnswer, this.selectedTab, this.selectedCheck)

        if (this.selectedRandomQuestion[0] === 'Question order') {

            this.allowShuffleQuestion = true
        } else {
            console.log("data is shufflequest else")
            this.allowShuffleQuestion = false
        }
        if (this.selectedTab === 1) {
            Swal.fire({
                type: "info",
                icon: "info",
                title: "Time Limit",
                text: "You have " + this.examTime + " Minutes",
            });
        }

        if (this.condition) {
            this.getExamSession()
        } else {

            this.deleteExamsession()
            this.getTestlet()
            this.getQuestions()
        }

    },

    methods: {

        warning() {
            console.log("in warning")
            this.deleteExamsession()
            this.saveSession()
            localStorage.setItem("condition", JSON.stringify(true));

        },
        scoreCalculation() {

            let score = 1000 / this.totalQuestions
            let int_part = Math.trunc(score); // returns 3
            let float_part = Number((score - int_part).toFixed(2));
            let ceilScore = Math.ceil(score)
            let floorScore = Math.floor(score)
            if (float_part > .5) {

                this.obtainScore = ceilScore * this.correctQuestion.length
                //localStorage.setItem("obtainScore", JSON.stringify(this.obtainScore));

            } else if (float_part <= .5) {

                this.obtainScore = floorScore * this.correctQuestion.length
                // localStorage.setItem("obtainScore", JSON.stringify(this.obtainScore));
            }

        },
        offEventbus() {
            EventBus.$off('save')
            EventBus.$off('stop')
        },
        async updateSessionStatus() {
            let id = JSON.parse(localStorage.getItem("examId"));

            let response = await quickRequest("/updateSessionStatus", "PUT", {}, this["auth/getUser"].id, id);

        },
        saveSession(cond) {
            this.deleteExamsession()
            this.firstQuestion = []
            this.isUpdate = false
            for (let index1 = 0; index1 < this.wrongQuestion.length; index1++) {
                console.log("index1")
                this.wrongQuestion[index1].condition = 'false'
                this.wrongQuestion[index1].page = this.page
                this.wrongQuestion[index1].examId = this.examId
                this.wrongQuestion[index1].selectedCheck = JSON.stringify(this.selectedCheck)
                this.wrongQuestion[index1].indexVar = this.indexVar
                this.wrongQuestion[index1].totalQuestions = this.totalQuestions
                this.wrongQuestion[index1].counterL = this.counterL
                this.wrongQuestion[index1].candidateName = this.candidateName
                this.wrongQuestion[index1].selectedRandomAnswer = JSON.stringify(this.selectedRandomAnswer)
                this.wrongQuestion[index1].selectedRandomQuestion = JSON.stringify(this.selectedRandomQuestion)
                this.wrongQuestion[index1].selectedTab = this.selectedTab
                this.wrongQuestion[index1].obtainScore = this.obtainScore
            }
            for (let index2 = 0; index2 < this.correctQuestion.length; index2++) {
                console.log("index2")
                this.correctQuestion[index2].condition = 'true'
                this.correctQuestion[index2].page = this.page
                this.correctQuestion[index2].examId = this.examId
                this.correctQuestion[index2].selectedCheck = JSON.stringify(this.selectedCheck)
                this.correctQuestion[index2].indexVar = this.indexVar
                this.correctQuestion[index2].totalQuestions = this.totalQuestions
                this.correctQuestion[index2].counterL = this.counterL
                this.correctQuestion[index2].candidateName = this.candidateName
                this.correctQuestion[index2].selectedRandomAnswer = JSON.stringify(this.selectedRandomAnswer)
                this.correctQuestion[index2].selectedRandomQuestion = JSON.stringify(this.selectedRandomQuestion)
                this.correctQuestion[index2].selectedTab = this.selectedTab
                this.correctQuestion[index2].obtainScore = this.obtainScore
            }
            for (let index3 = 0; index3 < this.unansweredQuestion.length; index3++) {
                console.log("index3", this.unansweredQuestion)
                this.unansweredQuestion[index3].condition = 'unanswered'
                this.unansweredQuestion[index3].page = this.page
                this.unansweredQuestion[index3].examId = this.examId
                this.unansweredQuestion[index3].selectedCheck = JSON.stringify(this.selectedCheck)
                this.unansweredQuestion[index3].indexVar = this.indexVar
                this.unansweredQuestion[index3].totalQuestions = this.totalQuestions
                this.unansweredQuestion[index3].counterL = this.counterL
                this.unansweredQuestion[index3].candidateName = this.candidateName
                this.unansweredQuestion[index3].selectedRandomAnswer = JSON.stringify(this.selectedRandomAnswer)
                this.unansweredQuestion[index3].selectedRandomQuestion = JSON.stringify(this.selectedRandomQuestion)
                this.unansweredQuestion[index3].selectedTab = this.selectedTab
                this.unansweredQuestion[index3].obtainScore = this.obtainScore
            }
            //console.log(this.unansweredQuestion.length, this.correctQuestion.length, this.wrongQuestion.length)
            if (this.unansweredQuestion.length === 0 && this.correctQuestion.length === 0 && this.wrongQuestion.length === 0) {
                console.log("for first", this.unansweredQuestion, this.correctQuestion)
                this.firstQuestion.push(this.questions[0])
                // let fq = {
                //     'condition': 'unanswered',
                //     'page': this.page,
                //     'examId': this.examId,
                //     'selectedCheck': JSON.stringify(this.selectedCheck),
                //     'indexVar': this.indexVar,
                //     'totalQuestions': this.totalQuestions,
                //     'counterL': this.counterL,
                //     'candidateName ': this.candidateName,
                //     'selectedRandomAnswer': JSON.stringify(this.selectedRandomAnswer),
                //     'selectedRandomQuestion': JSON.stringify(this.selectedRandomQuestion),
                //     'selectedTab': this.selectedTab,
                //     'obtainScore': this.obtainScore

                // }
                console.log(this.firstQuestion)
                for (let index4 = 0; index4 < this.firstQuestion.length; index4++) {
                    this.firstQuestion[index4].condition = 'unanswered'
                    this.firstQuestion[index4].page = this.page
                    this.firstQuestion[index4].examId = this.examId
                    this.firstQuestion[index4].selectedCheck = JSON.stringify(this.selectedCheck)
                    this.firstQuestion[index4].indexVar = this.indexVar
                    this.firstQuestion[index4].totalQuestions = this.totalQuestions
                    this.firstQuestion[index4].counterL = this.counterL
                    this.firstQuestion[index4].candidateName = this.candidateName
                    this.firstQuestion[index4].selectedRandomAnswer = JSON.stringify(this.selectedRandomAnswer)
                    this.firstQuestion[index4].selectedRandomQuestion = JSON.stringify(this.selectedRandomQuestion)
                    this.firstQuestion[index4].selectedTab = this.selectedTab
                    this.firstQuestion[index4].obtainScore = this.obtainScore
                    // this.firstQuestion.push(fq)
                }
                console.log(this.firstQuestion, this.questions[0])
            }

            let cQuestions = [...this.wrongQuestion, ...this.correctQuestion, ...this.unansweredQuestion, ...this.firstQuestion]

            let id = this["auth/getUser"].id

            this.examSession(id, cQuestions, cond)
        },
        deleteExamsession(id, condition) {
            let guestId = JSON.parse(localStorage.getItem("guestId"));
            let user_id = this["auth/getUser"].id
            let examIdd
            if (condition) {
                examIdd = id
            } else {
                examIdd = JSON.parse(localStorage.getItem("examId"));
            }

            try {
                let response
                if (this["auth/isAuthenticated"]) {
                    response = quickRequest("/deleteExamsession", "POST", {
                        id: user_id
                    }, {}, examIdd);
                } else {
                    response = quickRequest("/deleteGuestExamsession", "POST", {
                        id: guestId
                    }, {}, examIdd);
                }
                if ("error" in response) {
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Error",
                        text: response.error,
                    });
                }

            } catch (e) {
                console.log(e)
                Swal.fire({
                    type: "error",
                    title: "Error Occured",
                    text: "Error occured while deleting session",
                });
            }
        },
        async getExamSession() {
            this.isLoading = true;
            let user_id = this["auth/getUser"].id
            let guestId = JSON.parse(localStorage.getItem("guestId"));

            let examIdd = JSON.parse(localStorage.getItem("examId"));

            try {
                let response
                if (this["auth/isAuthenticated"]) {
                    response = await quickRequest("/getExamsession", "GET", {}, user_id, examIdd);
                } else {
                    response = await quickRequest("/getGuestExamsession", "GET", {}, guestId, examIdd);
                }
                if ("error" in response) {
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Error",
                        text: response.error,
                    });
                }
                if (response.examSessions.length > 0) {
                    this.deleteExamsession()
                    this.getTestlet()
                    this.getQuestions()
                    this.examSessionLength = response.examSessions.length

                    if (response.examSessions.length > 0) {
                        this.page = response.examSessions[0].page
                        this.indexVar = response.examSessions[0].indexVar
                        this.counterL = response.examSessions[0].counterL
                        this.obtainScore = response.examSessions[0].obtainScore

                        for (let indexs = 0; indexs < response.examSessions.length; indexs++) {
                            if (response.examSessions[indexs].conditionOf == 'unanswered') {
                                this.unansweredQuestion.push(response.examSessions[indexs])
                            } else if (response.examSessions[indexs].conditionOf == 'true') {
                                this.correctQuestion.push(response.examSessions[indexs])
                            } else if (response.examSessions[indexs].conditionOf == 'false') {
                                this.wrongQuestion.push(response.examSessions[indexs])
                            }
                        }
                    }
                    this.isLoading = false;
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
        async examSession(IdOfUser, combinedQuestions, cond) {

            try {
                let guestId = JSON.parse(localStorage.getItem("guestId"));
                const data = {
                    userId: IdOfUser,
                    guestId: guestId,
                    record: combinedQuestions
                };

                let response = await quickRequest("/saveExamsession", "POST", data);
                if ("error" in response) {
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Error",
                        text: response.error,
                    });
                }
                if (response) {

                    if (cond === 'stop') {

                        this.updateSessionStatus()
                    }
                    this.isUpdate = true
                    if (cond === true) {
                        Swal.fire({
                            type: "success",
                            title: "Session Saved",
                            text: "Your Session Saved Successfully",
                        });
                    }
                }
            } catch (e) {
                console.log(e)
                Swal.fire({
                    type: "error",
                    title: "Error Saving Session",
                    text: "Could not save session through the server.",
                });
            }
        },
        getQuestions() {
            this.isLoading = true;
            axios
                .get("/questions/" + this.page + "/" + this.examId + "/" + this.selectedCheck)
                .then((resp) => {

                    if (this.structureEntryQuestionn.length !== 0) {
                        axios
                            .get("/questions/" + this.page + "/" + this.examId + "/" + this.selectedCheck + "/" + this.structureEntryQuestionn)
                            .then((resp) => {
                                console.log(resp.data)
                                this.questions = this.questions.concat(resp.data)

                                if (this.allowShuffleQuestion) {

                                    let answerShuffle = this.questions.sort(() => {
                                        return 0.5 - this.random;
                                    });

                                }
                                this.questions.pop()
                                this.is_data_fetched = true;
                                this.is_button_disabled = false;
                                this.totalQuestions = resp.data[resp.data.length - 1].count
                                this.isLoading = false;
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        this.isLoading = true;
                        axios
                            .get("/questions/" + this.page + "/" + this.examId + "/" + this.selectedCheck + "/" + 0)
                            .then((resp) => {
                                console.log(resp.data)
                                this.questions = this.questions.concat(resp.data)
                                if (this.allowShuffleQuestion) {

                                    let array1 = [1, 2, 3, 4, 5, 6]
                                    let count = 0

                                    for (let i = this.questions.length - 1; i > 0; i--) {
                                        let j = Math.floor(this.random * (i + 1));

                                        [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
                                    }

                                }
                                this.questions.pop()
                                this.is_data_fetched = true;
                                this.is_button_disabled = false;
                                this.totalQuestions = resp.data[resp.data.length - 1].count
                                this.isLoading = false

                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }

                })
        },
        getTestlet() {

            axios
                .get("/testlet/" + this.examId)
                .then((resp) => {

                    this.testlet = resp.data

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        submitQuestion() {
            this.$refs.single.submit()
        },
        submit(num) {

            this.showPricing = false
            this.count++
            console.log("in main", num, this.count)
            this.$refs.single.submit()
            if (this.count > 1 && num < 10) {

                this.nextQuestionCounter()
            } else if (this.selectedTab === 1 && num < 10) {

                this.nextQuestionCounter()
            } else if (num === 10) {

                this.showPricing = true
                console.log("please subs", this.showPricing)
            }

        },
        nextQuestionCounter() {
            this.scoreCalculation()
            this.count = 0

            let totalLength = this.questions.length;

            if (this.counterL >= totalLength - 1) {

                this.is_data_fetched = false;
                this.page += 1;
                this.counterL++;

                this.is_button_disabled = true;
                this.getQuestions();
            } else {
                this.counterL++;
            }

            this.indexVar = this.counterL;
        },
        decrement() {
            this.counterL--
            this.count = 0
            this.indexVar = this.counterL;
        },
        findDuplicateQuestions(type, id) {

            let Correct = this.correctQuestion
            let Wrong = this.wrongQuestion
            let Unanaswer = this.unansweredQuestion
            // this.examId
            if (type === 'wrong') {

                this.correctQuestion = Correct.filter(question => question.id !== id);
                this.unansweredQuestion = Unanaswer.filter(question => question.id !== id);
                console.log("remove correct", this.correctQuestion, Correct)
                //  const newData = remove(this.correctQuestion, "id", );
            } else if (type === 'correct') {
                // const removeWrong = this.removeDuplicate(this.wrongQuestion, "id", id);
                this.wrongQuestion = Wrong.filter(question => question.id !== id);
                this.unansweredQuestion = Unanaswer.filter(question => question.id !== id);
                console.log("remove wrong", this.wrongQuestion, Wrong, id)
            } else if (type === 'unanswer') {
                this.correctQuestion = Correct.filter(question => question.id !== id);
                this.wrongQuestion = Wrong.filter(question => question.id !== id);
            }
            console.log(this.correctQuestion, this.wrongQuestion)

        },

        getWrongQuestion() {
            this.findDuplicateQuestions("wrong", this.questions[this.indexVar].id)
            this.wrongQuestion = this.wrongQuestion.concat(this.questions[this.indexVar])
            let uniqueAddresses = Array.from(new Set(this.wrongQuestion.map(a => a.id)))
                .map(id => {
                    return this.wrongQuestion.find(a => a.id === id)
                })
            this.wrongQuestion = uniqueAddresses

        },

        getCorrectQuestion() {
            this.findDuplicateQuestions("correct", this.questions[this.indexVar].id)
            this.correctQuestion = this.correctQuestion.concat(this.questions[this.indexVar])
            let uniqueAddresses = Array.from(new Set(this.correctQuestion.map(a => a.id)))
                .map(id => {
                    return this.correctQuestion.find(a => a.id === id)
                })
            this.correctQuestion = uniqueAddresses

        },
        getunansweredQuestion() {
            this.findDuplicateQuestions("unanswer", this.questions[this.indexVar].id)
            this.unansweredQuestion = this.unansweredQuestion.concat(this.questions[this.indexVar])
            let uniqueAddresses = Array.from(new Set(this.unansweredQuestion.map(a => a.id)))
                .map(id => {
                    return this.unansweredQuestion.find(a => a.id === id)
                })
            this.unansweredQuestion = uniqueAddresses
        },

        stop() {
            this.toForward = false
            console.log("wrong and coreect", this.wrongQuestion, this.correctQuestion)
            let wrong = this.wrongQuestion.map((elem) => {
                let json = {}
                json.id = elem.id
                json.content = elem.content
                json.explanation = elem.explanation
                json.description = elem.description
                json.type = elem.type
                json.task_image = elem.task_image
                json.exam_library_id = elem.exam_library_id
                json.testlet_id = elem.testlet_id
                json.condition = 'false'
                json.userId = this["auth/getUser"].id
                return json

            })
            let correct = this.correctQuestion.map((elem) => {
                let json = {}
                json.id = elem.id
                json.content = elem.content
                json.explanation = elem.explanation
                json.description = elem.description
                json.type = elem.type
                json.task_image = elem.task_image
                json.exam_library_id = elem.exam_library_id
                json.testlet_id = elem.testlet_id
                json.condition = 'true'
                json.userId = this["auth/getUser"].id
                return json

            })
            let unanswered = this.unansweredQuestion.map((elem) => {
                let json = {}
                json.id = elem.id
                json.content = elem.content
                json.explanation = elem.explanation
                json.description = elem.description
                json.type = elem.type
                json.task_image = elem.task_image
                json.exam_library_id = elem.exam_library_id
                json.testlet_id = elem.testlet_id
                json.condition = 'unanswered'
                json.userId = this["auth/getUser"].id
                return json

            })
            let firstQuestion = this.firstQuestion.map((elem) => {
                let json = {}
                json.id = elem.id
                json.content = elem.content
                json.explanation = elem.explanation
                json.description = elem.description
                json.type = elem.type
                json.task_image = elem.task_image
                json.exam_library_id = elem.exam_library_id
                json.testlet_id = elem.testlet_id
                json.condition = 'unanswered'
                json.userId = this["auth/getUser"].id
                return json

            })

            localStorage.setItem("condition", JSON.stringify(true));
            this.deleteExamsession()
            this.saveSession("stop")

            this.$router.push({
                name: "Evaluation",
                params: {
                    wrongQuestions: wrong,
                    correctQuestions: correct,
                    firstQuestion: firstQuestion,
                    totalQuestions: this.totalQuestions,
                    candidateName: this.candidateName,
                    unansweredQuestion: unanswered,
                    stop: true

                }
            }).catch(() => {});

        },
        openDialog() {

            this.caseStudyDialog = true
        },
        openDialogOnEntry() {
            if (this.testlet.length !== 0) {
                const result = this.testlet.filter(testlet => testlet.id === this.questions[this.indexVar].TestletId);

                if (result.length !== 0) {
                    this.questionTestlet = result
                    this.caseStudyDialog = true
                }
            }
        }

    },
};
</script>

<style scoped>
body {
    overflow: hidden !important;
}

#vt {
    position: sticky;
    top: 0;
    z-index: 999;
}
</style>
