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
    <Footer :counter='this.counterL' :totalQuestions='this.totalQuestions' />
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
        examId: Number,
        selectedCheck: Array,
        selectedRandomAnswer: Array,
        candidateName: String,
        selectedTab: Number,

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
            wrongQuestion: [],
            correctQuestion: [],
            unansweredQuestion: [],

            count: 0,
        };
    },

    created() {
        if (this.selectedRandomAnswer[0] === 'Answer order') {

            this.allowShuffleAnswer = true
        } else {
            this.allowShuffleAnswer = false
        }
        this.getTestlet()
        this.getQuestions();

    },

    methods: {
        getQuestions() {

            axios
                .get("/questions/" + this.page + "/" + this.examId + "/" + this.selectedCheck)
                .then((resp) => {
                    console.log(resp);

                    this.questions = this.questions.concat(resp.data)
                    this.questions.pop()
                    this.is_data_fetched = true;
                    this.is_button_disabled = false;
                    this.totalQuestions = resp.data[resp.data.length - 1].count

                })
                .catch((err) => {
                    console.log(err);
                });
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

            this.$router.push({
                name: "Evaluation",
                params: {
                    wrongQuestions: wrong,
                    correctQuestions: correct,
                    totalQuestions: this.totalQuestions,
                    candidateName: this.candidateName,
                    unansweredQuestion: unanswered

                }
            });

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
