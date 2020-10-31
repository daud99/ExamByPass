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
import { quickRequest } from "../../../common/misc.js"
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
    beforeDestroy: function(){
        console.log(this.indexVar)
        for(let index1=0; index1<this.wrongQuestion.length; index1++){
            this.wrongQuestion[index1].condition='false'
            this.wrongQuestion[index1].page=this.page
            this.wrongQuestion[index1].examId=this.examId
            this.wrongQuestion[index1].selectedCheck=JSON.stringify(this.selectedCheck)
            this.wrongQuestion[index1].indexVar=this.indexVar

            this.wrongQuestion[index1].candidateName=this.candidateName
            this.wrongQuestion[index1].selectedRandomAnswer=JSON.stringify(this.selectedRandomAnswer)
            this.wrongQuestion[index1].selectedTab=this.selectedTab
        }
        for(let index2=0; index2<this.correctQuestion.length; index2++){
            this.correctQuestion[index2].condition='true'
            this.correctQuestion[index2].page=this.page
            this.correctQuestion[index2].examId=this.examId
            this.correctQuestion[index2].selectedCheck=JSON.stringify(this.selectedCheck)
            this.correctQuestion[index2].indexVar=this.indexVar

            this.correctQuestion[index2].candidateName=this.candidateName
            this.correctQuestion[index2].selectedRandomAnswer=JSON.stringify(this.selectedRandomAnswer)
            this.correctQuestion[index2].selectedTab=this.selectedTab
        }
        for(let index3=0; index3<this.unansweredQuestion.length; index3++){
            this.unansweredQuestion[index3].condition='unanswered'
            this.unansweredQuestion[index3].page=this.page
            this.unansweredQuestion[index3].examId=this.examId
            this.unansweredQuestion[index3].selectedCheck=JSON.stringify(this.selectedCheck)
            this.unansweredQuestion[index3].indexVar=this.indexVar

            this.unansweredQuestion[index3].candidateName=this.candidateName
            this.unansweredQuestion[index3].selectedRandomAnswer=JSON.stringify(this.selectedRandomAnswer)
            this.unansweredQuestion[index3].selectedTab=this.selectedTab
        }


        let cQuestions=[...this.wrongQuestion, ...this.correctQuestion, ...this.unansweredQuestion]
        console.log(cQuestions)
        let id=100
        this.examSession(id,cQuestions)

    },
    created() {
        this.getExamSession()
        this.deleteExamsession()
        if (this.selectedRandomAnswer[0] === 'Answer order') {

            this.allowShuffleAnswer = true
        } else {
            this.allowShuffleAnswer = false
        }
        this.getTestlet()
        this.getQuestions()
        
    },

    methods: {
        async deleteExamsession(){
            let user_id=100
            try {
                let response = await quickRequest("/deleteExamsession", "POST", {id:100});
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
        async getExamSession(){
            let user_id=100
            try {
                let response = await quickRequest("/getExamsession", "GET", {}, user_id);
                if ("error" in response) {
                Swal.fire({
                    type: "error",
                    icon: "error",
                    title: "Error",
                    text: response.error,
                });
                }
                if(response.examSessions.length>0){
                    this.examSessionLength=response.examSessions.length
                    console.log(response.examSessions[0].indexVar)
                    if(response.examSessions.length>0){
                        this.page=response.examSessions[0].page
                        this.indexVar=response.examSessions[0].indexVar
                        for(let indexs=0; indexs<response.examSessions.length; indexs++){
                            if(response.examSessions[indexs].conditionOf=='unanswered'){
                                this.unansweredQuestion.push(response.examSessions[indexs])
                            }else if(response.examSessions[indexs].conditionOf=='true'){
                                this.correctQuestion.push(response.examSessions[indexs])
                            }else if(response.examSessions[indexs].conditionOf=='false'){
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
        async examSession(IdOfUser,combinedQuestions){
            try {
                const data = {
                userId: IdOfUser,
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
                if(response){
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
