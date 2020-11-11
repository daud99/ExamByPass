<template>
<div class="container-fluid mt-5 ">
    <v-card elevation="2">
        <h3 class="text-center">Exam Evaluation</h3>

        <div class="row text-center">
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-6 ">
                <p class="text-lg-h6">Result <span>
                        <v-chip v-if="this.result" class="ma-2" color="green" label>
                            Pass
                        </v-chip>
                        <v-chip v-else-if="!this.result" class="ma-2" color="red" label>
                            Fail
                        </v-chip>
                    </span></p>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-6" v-if="candidateName!==''">
                <p class="text-lg-h6">Candidate <span>
                        <v-chip class="ma-2" color="green" label>
                            {{this.candidateName}}
                        </v-chip>

                    </span></p>
            </div>
        </div>
        <div class="row text-center">
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-6">
                <p class="text-lg-h6">Your Score <span>
                        <v-chip class="ma-2" color="blue" label outlined>
                            {{this.obtainScore}}/1000
                        </v-chip>
                    </span></p>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-6">
                <p class="text-lg-h6">Pass Score <span>
                        <v-chip class="ma-2" color="blue" label outlined>
                            800/1000
                        </v-chip>
                    </span></p>
            </div>
        </div>
        <div class="row text-center">
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-6">
                <p class="text-lg-h6">Correct Answers <span>
                        <v-chip class="ma-2" color="blue" label outlined>
                            {{this.correctQuestions.length}}/{{this.totalQuestionsCount}}
                        </v-chip>
                    </span></p>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-6">
                <p class="text-lg-h6">Incorrect Answers <span>
                        <v-chip class="ma-2" color="blue" label outlined>
                            {{this.wrongQuestions.length}}/{{this.totalQuestionsCount}}
                        </v-chip>
                    </span></p>
            </div>
        </div>
    </v-card>
    <h3 class="text-center">Questions</h3>
    <div class="row">
        <div class="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-4" v-for="question in this.questions" :key="question">
            <v-switch v-model="filter" :label="question" color="success" :value="question" @change="handleChange($event)" hide-details></v-switch>
        </div>
    </div>
    <div class="table">
        <v-simple-table fixed-header height="320px">
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left text-lg-h6 font-weight-bold">
                            ID#
                        </th>
                        <th class="text-left text-lg-h6 font-weight-bold">
                            Type
                        </th>
                        <th class="text-left text-lg-h6 font-weight-bold">
                            Description
                        </th>
                        <th class="text-left text-lg-h6 font-weight-bold">
                            Result
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="question in totalQuestions" :key="question.id" class="text-md-body-1">
                        <td>{{ question.id }}</td>
                        <td>{{ question.type }}</td>
                        <td v-html="question.content"></td>
                        <td v-if="question.conditionOf === 'true' || question.condition ==='true' ">
                            <v-chip class="ma-2" color="green" label text-color="white" v-on:click="getDetails(question)">
                                Correct
                            </v-chip>
                        </td>
                        <td v-else-if="question.conditionOf === 'false' || question.condition ==='false'  ">
                            <v-chip class="ma-2" color="red" label text-color="white" v-on:click="getDetails(question)">
                                Incorrect
                            </v-chip>
                        </td>
                        <td v-else-if="question.conditionOf === 'unanswered' || question.condition ==='unanswered' ">
                            <v-chip class="ma-2" color="yellow" label text-color="white" v-on:click="getDetails(question)">
                                Unanswered
                            </v-chip>
                        </td>
                    </tr>
                </tbody>

            </template>
        </v-simple-table>
    </div>
    <div v-if="this.clickme">
        <DetailsDialog :checkCondition='this.clickme' :sendQuestion='this.sendQuestion' />
    </div>
</div>
</template>

<script>
import DetailsDialog from './DetailsDialog'
import axios from 'axios'
import {
    quickRequest
} from "../../../common/misc.js"
import Swal from "sweetalert2";
import {
    mapActions,
    mapGetters
} from 'vuex';
export default {
    components: {
        DetailsDialog,
    },
    data() {
        return {
            desserts: [{
                    id: 1,
                    type: 'SingleChoice',
                    description: "  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, autem. Quas  nulla vitae, tenetur voluptatibus nesciunt cupiditate ipsam commodi sunt delectus nisi reiciendis maiores fuga similique?   ",
                    result: "Incorrect",
                },
                {
                    id: 2,
                    type: 'SingleChoice',
                    description: "  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, autem. Quas  nulla vitae, tenetur voluptatibus nesciunt cupiditate ipsam commodi sunt delectus nisi reiciendis maiores fuga similique?   ",
                    result: "Incorrect",
                },
                {
                    id: 3,
                    type: 'SingleChoice',
                    description: "  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, autem. Quas  nulla vitae, tenetur voluptatibus nesciunt cupiditate ipsam commodi sunt delectus nisi reiciendis maiores fuga similique?   ",
                    result: "Incorrect",
                },
                {
                    id: 4,
                    type: 'SingleChoice',
                    description: "  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, autem. Quas  nulla vitae, tenetur voluptatibus nesciunt cupiditate ipsam commodi sunt delectus nisi reiciendis maiores fuga similique?   ",
                    result: "Incorrect",
                },
                {
                    id: 5,
                    type: 'SingleChoice',
                    description: "  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, autem. Quas  nulla vitae, tenetur voluptatibus nesciunt cupiditate ipsam commodi sunt delectus nisi reiciendis maiores fuga similique?   ",
                    result: "Incorrect",
                },
                {
                    id: 6,
                    type: 'SingleChoice',
                    description: "  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, autem. Quas  nulla vitae, tenetur voluptatibus nesciunt cupiditate ipsam commodi sunt delectus nisi reiciendis maiores fuga similique?   ",
                    result: "Incorrect",
                },
                {
                    id: 7,
                    type: 'SingleChoice',
                    description: "  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, autem. Quas  nulla vitae, tenetur voluptatibus nesciunt cupiditate ipsam commodi sunt delectus nisi reiciendis maiores fuga similique?   ",
                    result: "Incorrect",
                },

            ],
            result: true,
            tabItems: [
                'TRAINING MODE', 'EXAM MODE'
            ],
            questions: ['Correct Answers', 'Incorrect Answers', 'Unanswered Questions'],
            tab: null,
            dialog: false,
            notifications: false,
            sound: true,
            countQuestion: 0,
            totalScore: 800,
            obtainScore: 0,
            widgets: false,
            checkBox1: [{
                type: 'Drag and Drop',
                id: 1
            }, {
                type: 'Single choice',
                id: 1
            }, {
                type: 'Multiple choice',
                id: 3
            }],
            toggle_exclusive: 0,
            incorrectTimes: ["5 questions answered incorrectly one time", "5 questions answered incorrectly two time"],

            correctQuestions: [],
            wrongQuestions: [],
            unansweredQuestion: [],
            totalQuestionsCount: Number,
            totalQuestions: [],
            filter: ['Correct Answers', 'Incorrect Answers'],
            answers: [],
            questionId: Number,
            correctAnswer: [],
            clickme: false,
            sendQuestion: [],
            candidateName: '',
        }

    },
    beforeDestroy() {
        //window.removeEventListener('beforeunload', this.warning)
    },

    created() {

        console.log(this.$route.params.stop)
        if (this.$route.params.stop) {
            this.correctQuestions = this.$route.params.correctQuestions
            this.wrongQuestions = this.$route.params.wrongQuestions
            this.unansweredQuestion = this.$route.params.unansweredQuestion
            this.totalQuestionsCount = this.$route.params.totalQuestions
            this.candidateName = this.$route.params.candidateName
            this.evaluate()
        } else {
            this.getExamSession()
            //  window.addEventListener('beforeunload', this.warning)
        }

        // console.log("iam eval", this.correctQuestions, this.wrongQuestions, this.$route.params.correctQuestions, this.$route.params.wrongQuestions)

        //this.updateSessionStatus()

    },
    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
    },
    methods: {

        async getExamSession() {
            let user_id = this["auth/getUser"].id

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

                    // this.examSessionLength = response.examSessions.length
                    console.log(response.examSessions[0].indexVar)
                    if (response.examSessions.length > 0) {

                        this.candidateName = response.examSessions[0].candidateName
                        this.totalQuestionsCount = response.examSessions[0].totalQuestions
                        for (let indexs = 0; indexs < response.examSessions.length; indexs++) {
                            if (response.examSessions[indexs].conditionOf == 'unanswered') {
                                this.unansweredQuestion.push(response.examSessions[indexs])
                            } else if (response.examSessions[indexs].conditionOf == 'true') {
                                this.correctQuestions.push(response.examSessions[indexs])
                            } else if (response.examSessions[indexs].conditionOf == 'false') {
                                this.wrongQuestions.push(response.examSessions[indexs])
                            }
                        }
                        this.evaluate()
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
        evaluate() {
            let score = 1000 / this.totalQuestionsCount
            let int_part = Math.trunc(score); // returns 3
            let float_part = Number((score - int_part).toFixed(2));
            let ceilScore = Math.ceil(score)
            let floorScore = Math.floor(score)
            if (float_part > .5) {

                this.obtainScore = ceilScore * this.correctQuestions.length

            } else if (float_part <= .5) {

                this.obtainScore = floorScore * this.correctQuestions.length
            }
            if (this.obtainScore < 800) {
                this.result = false
            } else {
                this.result = true
            }

            // this.totalQuestions = this.correctQuestions.concat(this.wrongQuestions)

            if (this.filter[0] === 'Correct Answers') {
                this.totalQuestions = this.correctQuestions
            }
            if (this.filter[0] === 'Incorrect Answers') {
                this.totalQuestions = this.wrongQuestions
            }

            if (this.filter[0] === 'Incorrect Answers' && this.filter[1] === 'Correct Answers' || this.filter[1] === 'Incorrect Answers' && this.filter[0] === 'Correct Answers') {

                this.totalQuestions = this.correctQuestions.concat(this.wrongQuestions)
            }
            if (this.filter[0] === 'Unanswered Questions') {
                this.totalQuestions = this.unansweredQuestion

            }
        },
        getDetails(question) {

            this.sendQuestion = question
            this.clickme = true
        },
        //Below method is from child DetailsDialog
        clickFalse() {
            this.clickme = false
        },
        handleChange: function (e) {
            // this.correctQuestions = this.$route.params.correctQuestions
            // this.wrongQuestions = this.$route.params.wrongQuestions
            // this.unansweredQuestion = this.$route.params.unansweredQuestion
            // this.totalQuestionsCount = this.$route.params.totalQuestions

            if (this.filter[0] === 'Correct Answers') {
                this.totalQuestions = this.correctQuestions
            }
            if (this.filter[0] === 'Incorrect Answers') {
                this.totalQuestions = this.wrongQuestions
            }
            if (this.filter[0] === 'Unanswered Questions') {
                this.totalQuestions = this.unansweredQuestion

            }
            if (this.filter[0] === 'Incorrect Answers' && this.filter[1] === 'Correct Answers' || this.filter[1] === 'Incorrect Answers' && this.filter[0] === 'Correct Answers') {

                this.totalQuestions = this.correctQuestions.concat(this.wrongQuestions)
            }
            if (this.filter[0] === 'Incorrect Answers' && this.filter[1] === 'Unanswered Questions' || this.filter[1] === 'Incorrect Answers' && this.filter[0] === 'Unanswered Questions') {

                this.totalQuestions = this.unansweredQuestion.concat(this.wrongQuestions)
            }
            if (this.filter[0] === 'Correct Answers' && this.filter[1] === 'Unanswered Questions' || this.filter[1] === 'Correct Answers' && this.filter[0] === 'Unanswered Questions') {

                this.totalQuestions = this.unansweredQuestion.concat(this.correctQuestions)
            }
            if (this.filter[0] === 'Incorrect Answers' && this.filter[1] === 'Correct Answers' && this.filter[2] === 'Unanswered Questions' ||
                this.filter[1] === 'Incorrect Answers' && this.filter[0] === 'Correct Answers' && this.filter[2] === 'Unanswered Questions' ||
                this.filter[1] === 'Incorrect Answers' && this.filter[2] === 'Correct Answers' && this.filter[0] === 'Unanswered Questions' ||
                this.filter[2] === 'Incorrect Answers' && this.filter[1] === 'Correct Answers' && this.filter[0] === 'Unanswered Questions' ||
                this.filter[2] === 'Incorrect Answers' && this.filter[0] === 'Correct Answers' && this.filter[1] === 'Unanswered Questions' ||
                this.filter[0] === 'Incorrect Answers' && this.filter[2] === 'Correct Answers' && this.filter[1] === 'Unanswered Questions') {

                this.totalQuestions = this.correctQuestions.concat(this.wrongQuestions)
                this.totalQuestions = this.totalQuestions.concat(this.unansweredQuestion)
            }
            if (this.filter.length === 0) {
                this.totalQuestions = []
            }
        }
    }
}
</script>

<style scoped>
.scrol {

    overflow-y: scroll;
    height: 700px;
}
</style>
