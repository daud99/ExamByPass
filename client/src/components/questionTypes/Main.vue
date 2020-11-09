<template>
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
    <v-btn v-if="this.testlet.length !==0" color="primary" @click="this.openDialog" large>
        CASE STUDY
    </v-btn>
    <Footer :counter='this.counterL' :totalQuestions='this.totalQuestions' :obtainScore="this.obtainScore" />
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

import EventBus from "../../Event/eventBus"

import {
    quickRequest
} from "../../../common/misc.js"
import Swal from "sweetalert2";

//import Vue from "vue";

export default {
    components: {
        Single,
        Multiple,
        DragAndDrop,
        FillInTheBlank,
        HotArea,
        Footer
    },
    props: {

    },
    data() {
        return {

            questions: [],
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
            wrongQuestion: [],
            correctQuestion: [],
            unansweredQuestion: [],
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
            localKeys: ["examId", "selectedCheck", "selectedRandomAnswer", "candidateName", "selectedTab", "structureEntryQuestionn", "condition"]
        };
    },

    mounted() {

        EventBus.$once('stop', () => {
            // this.toForward = false
            console.log("i am bus", this.$route.params.examId, this.examId)
            this.stop()
            //  this.deleteExamsession(this.examId, true)
            //  console.log("id in bus", this.examId)
            this.toDestroy = true

        });

        EventBus.$on('save', () => {
            console.log("i am bus")
            this.deleteExamsession(this.examId, true)
            this.saveSession()

        });
    },
    beforeDestroy: function () {
        console.log("i am before destroy")
        window.removeEventListener('beforeunload', this.warning)
        this.offEventbus()
        if (!this.toDestroy && this.toForward) {
            this.deleteExamsession(this.examId, true)
            this.saveSession()
        }

    },
    beforeRouteLeave(to, from, next) {
        console.log("before route leaves", to, from, this.toForward)
        if (to.name === "Evaluation" && from.name === 'main' && this.toForward) {
            console.log("calling stop in forward button")
            this.stop()
            return next()
        }
        next()
    },
    created() {
        //localStorage.setItem("obtainScore", JSON.stringify(this.obtainScore));
        this.toForward = true
        if (this.$route.name === 'main') {
            console.log('route name', this.$route.name)
            window.addEventListener('beforeunload', this.warning)
        }
        // window.addEventListener('beforeunload', this.warning)
        //  window.onbeforeunload = this.warning();
        this.toDestroy = false

        if (this.selectedRandomAnswer[0] === 'Answer order') {

            this.allowShuffleAnswer = true
        } else {
            this.allowShuffleAnswer = false
        }

        this.examId = JSON.parse(localStorage.getItem("examId"));
        this.examTime = JSON.parse(localStorage.getItem("examTime"));
        this.selectedCheck = JSON.parse(localStorage.getItem("selectedCheck"));
        this.selectedRandomAnswer = JSON.parse(localStorage.getItem("selectedRandomAnswer"));
        this.selectedRandomQuestion = JSON.parse(localStorage.getItem("selectedRandomQuestion"));
        this.candidateName = JSON.parse(localStorage.getItem("candidateName"));
        this.selectedTab = JSON.parse(localStorage.getItem("selectedTab"));
        this.structureEntryQuestionn = JSON.parse(localStorage.getItem("structureEntryQuestionn"));
        this.condition = JSON.parse(localStorage.getItem("condition"));
        console.log("shuffle q", this.selectedRandomQuestion[0])
        if (this.selectedRandomQuestion[0] === 'Question order') {
            console.log("shuffle q", this.selectedRandomQuestion[0])
            this.allowShuffleQuestion = true
        } else {
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
        console.log("vreated", this.examId, this.selectedCheck, this.$route.params.selectedCheck, this.$route.params.examId)
        if (this.condition) {
            this.getExamSession()
        } else {
            //  console.log("i am else in created", this.$route.params.condition)
            this.deleteExamsession()
            this.getTestlet()
            this.getQuestions()
        }

    },

    methods: {
        warning() {
            console.log('reload')
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
            console.log("count is", this.correctQuestion.length, this.obtainScore)
        },
        offEventbus() {
            EventBus.$off('save')
            EventBus.$off('stop')
        },
        async updateSessionStatus() {
            let id = JSON.parse(localStorage.getItem("examId"));
            console.log("updatesess", id)
            let response = await quickRequest("/updateSessionStatus", "PUT", {}, {}, id);

        },
        saveSession() {
            this.deleteExamsession()
            for (let index1 = 0; index1 < this.wrongQuestion.length; index1++) {
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
            console.log("wrong is", this.wrongQuestion)
            let cQuestions = [...this.wrongQuestion, ...this.correctQuestion, ...this.unansweredQuestion]
            console.log(cQuestions)
            let id = 100
            this.examSession(id, cQuestions)
        },
        deleteExamsession(id, condition) {

            let user_id = 100
            let examIdd
            if (condition) {
                examIdd = id
            } else {
                examIdd = JSON.parse(localStorage.getItem("examId"));
            }

            console.log("i am delete", examIdd)
            try {
                let response = quickRequest("/deleteExamsession", "POST", {
                    id: 100
                }, {}, examIdd);
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
            let user_id = 100

            let examIdd = JSON.parse(localStorage.getItem("examId"));

            // console.log("id is", this.examId, this.$route.params.examId)
            try {
                let response = await quickRequest("/getExamsession", "GET", {}, user_id, examIdd);
                console.log("response", response)
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
                    console.log(response.examSessions[0].indexVar)
                    if (response.examSessions.length > 0) {
                        this.page = response.examSessions[0].page
                        this.indexVar = response.examSessions[0].indexVar
                        this.counterL = response.examSessions[0].counterL
                        this.obtainScore = response.examSessions[0].obtainScore
                        console.log("i if", response.examSessions[0].counterL)
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
        async examSession(IdOfUser, combinedQuestions) {
            console.log("save", combinedQuestions)
            try {
                const data = {
                    userId: IdOfUser,
                    record: combinedQuestions
                };
                console.log("exam session", data)
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
                    console.log(response)
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

            axios
                .get("/questions/" + this.page + "/" + this.examId + "/" + this.selectedCheck)
                .then((resp) => {
                    // console.log(resp);
                    console.log("in getquestion", this.indexVar)

                    if (this.structureEntryQuestionn.length !== 0) {
                        axios
                            .get("/questions/" + this.page + "/" + this.examId + "/" + this.selectedCheck + "/" + this.structureEntryQuestionn)
                            .then((resp) => {
                                console.log(resp);

                                this.questions = this.questions.concat(resp.data)

                                if (this.allowShuffleQuestion) {
                                    console.log("i am random", this.allowShuffleQuestion)
                                    let answerShuffle = this.questions.sort(() => {
                                        return 0.5 - Math.random();
                                    });

                                }
                                this.questions.pop()
                                this.is_data_fetched = true;
                                this.is_button_disabled = false;
                                this.totalQuestions = resp.data[resp.data.length - 1].count

                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        axios
                            .get("/questions/" + this.page + "/" + this.examId + "/" + this.selectedCheck + "/" + 0)
                            .then((resp) => {
                                console.log(resp);

                                this.questions = this.questions.concat(resp.data)
                                if (this.allowShuffleQuestion) {
                                    console.log("i am random", this.allowShuffleQuestion)
                                    let answerShuffle = this.questions.sort(() => {
                                        return 0.5 - Math.random();
                                    });

                                }
                                this.questions.pop()
                                this.is_data_fetched = true;
                                this.is_button_disabled = false;
                                this.totalQuestions = resp.data[resp.data.length - 1].count

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
                    console.log(resp);
                    this.testlet = resp.data

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        submit() {
            this.count++

            this.$refs.single.submit()
            if (this.count > 1) {

                this.nextQuestionCounter()
            } else if (this.selectedTab === 1) {

                this.nextQuestionCounter()
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
            this.indexVar = this.counterL;
        },
        getWrongQuestion() {

            this.wrongQuestion = this.wrongQuestion.concat(this.questions[this.indexVar])
            let uniqueAddresses = Array.from(new Set(this.wrongQuestion.map(a => a.id)))
                .map(id => {
                    return this.wrongQuestion.find(a => a.id === id)
                })
            this.wrongQuestion = uniqueAddresses

        },
        getCorrectQuestion() {

            this.correctQuestion = this.correctQuestion.concat(this.questions[this.indexVar])
            let uniqueAddresses = Array.from(new Set(this.correctQuestion.map(a => a.id)))
                .map(id => {
                    return this.correctQuestion.find(a => a.id === id)
                })
            this.correctQuestion = uniqueAddresses

        },
        getunansweredQuestion() {

            this.unansweredQuestion = this.unansweredQuestion.concat(this.questions[this.indexVar])
            let uniqueAddresses = Array.from(new Set(this.unansweredQuestion.map(a => a.id)))
                .map(id => {
                    return this.unansweredQuestion.find(a => a.id === id)
                })
            this.unansweredQuestion = uniqueAddresses
        },

        stop() {
            this.toForward = false
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
                return json

            })
            console.log('stop', wrong, correct)
            localStorage.setItem("condition", JSON.stringify(true));
            this.deleteExamsession()
            this.saveSession()

            this.$router.push({
                name: "Evaluation",
                params: {
                    wrongQuestions: wrong,
                    correctQuestions: correct,
                    totalQuestions: this.totalQuestions,
                    candidateName: this.candidateName,
                    unansweredQuestion: unanswered,
                    stop: true

                }
            }).catch(() => {});
            this.updateSessionStatus()

        },
        openDialog() {

            this.caseStudyDialog = true
        },
        openDialogOnEntry() {
            if (this.testlet.length !== 0) {
                const result = this.testlet.filter(testlet => testlet.id === this.questions[this.indexVar].TestletId);
                this.questionTestlet = result
                this.caseStudyDialog = true
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
