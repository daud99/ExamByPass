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
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-6">
                <p class="text-lg-h6">Candidate <span>
                        <v-chip class="ma-2" color="green" label>
                            Umar
                        </v-chip>

                    </span></p>
            </div>
        </div>
        <div class="row text-center">
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-6">
                <p class="text-lg-h6">Your Score <span>
                        <v-chip class="ma-2" color="blue" label outlined>
                            0/100
                        </v-chip>
                    </span></p>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-6">
                <p class="text-lg-h6">Pass Score <span>
                        <v-chip class="ma-2" color="blue" label outlined>
                            80/100
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
                        <td>{{ question.content }}</td>
                        <td v-if="question.condition ">
                            <v-chip class="ma-2" color="green" label text-color="white" v-on:click="getDetails(question)">
                                Correct
                            </v-chip>
                        </td>
                        <td v-else-if='!question.condition'>
                            <v-chip class="ma-2" color="red" label text-color="white" v-on:click="getDetails(question)">
                                Incorrect
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
            totalQuestionsCount: Number,
            totalQuestions: [],
            filter: ['Correct Answers', 'Incorrect Answers'],
            answers: [],
            questionId: Number,
            correctAnswer: [],
            clickme: false,
            sendQuestion: []
        }

    },
    updated() {
        console.log(" ia m updated", this.filter)
    },
    created() {
        //   console.log()
        this.correctQuestions = this.$route.params.correctQuestions
        this.wrongQuestions = this.$route.params.wrongQuestions
        this.totalQuestionsCount = this.$route.params.totalQuestions
        // this.totalQuestions = this.correctQuestions.concat(this.wrongQuestions)

        if (this.filter[0] === 'Correct Answers') {
            this.totalQuestions = this.correctQuestions
        }
        if (this.filter[0] === 'Incorrect Answers') {
            this.totalQuestions = this.wrongQuestions
        }

        if (this.filter[0] === 'Incorrect Answers' && this.filter[1] === 'Correct Answers' || this.filter[1] === 'Incorrect Answers' && this.filter[0] === 'Correct Answers') {
            console.log('i am else if')
            this.totalQuestions = this.correctQuestions.concat(this.wrongQuestions)
        }
        if (this.filter === 'Unanswered Questions') {

        }
        if (this.filter === 'Incorrect Answers' && this.filter === 'Unanswered Questions') {

        }
        if (this.filter === 'Unanswered Questions' && this.filter === 'Correct Answers') {

        }
        if (this.filter === 'Incorrect Answers' && this.filter === 'Correct Answers' && this.filter === 'Unanswered Questions') {

        }

        //console.log(this.totalQuestions)
        console.log(this.wrongQuestions, this.correctQuestions, this.totalQuestions)
    },
    methods: {
        getDetails(question) {
            console.log(question)
            this.sendQuestion = question
            this.clickme = true
        },
        //Below method is from child DetailsDialog
        clickFalse() {
            this.clickme = false
        },
        handleChange: function (e) {
            this.correctQuestions = this.$route.params.correctQuestions
            this.wrongQuestions = this.$route.params.wrongQuestions
            this.totalQuestionsCount = this.$route.params.totalQuestions
            // this.totalQuestions = this.correctQuestions.concat(this.wrongQuestions)

            if (this.filter[0] === 'Correct Answers') {
                this.totalQuestions = this.correctQuestions
            }
            if (this.filter[0] === 'Incorrect Answers') {
                this.totalQuestions = this.wrongQuestions
            }

            if (this.filter[0] === 'Incorrect Answers' && this.filter[1] === 'Correct Answers' || this.filter[1] === 'Incorrect Answers' && this.filter[0] === 'Correct Answers') {
                console.log('i am else if')
                this.totalQuestions = this.correctQuestions.concat(this.wrongQuestions)
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
