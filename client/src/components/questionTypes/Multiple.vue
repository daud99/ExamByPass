<template>
<div>

    <v-row>
        <v-col>
            <v-sheet class="pa-12" color="grey lighten-3">
                <p v-html="questionn.content"></p>
                <loading :active.sync="isLoading" :can-cancel="false" height=80 width=80 loader='bars' color='green' :on-cancel="onCancel" :is-full-page="fullPage"></loading>
                <v-checkbox v-model="userAnswers" class="ma-0 pa-0" v-for="answerElm in answers" :key="answerElm.id" :style="answerElm.styleAfterSubmit" :label="answerElm.content" :value="answerElm.id"></v-checkbox>
            </v-sheet>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <div v-if="this.detailsDialog===true">
                <v-btn class="ma-2" tile color="indigo" dark @click="submit(userAnswers)">Answer</v-btn>
            </div>

        </v-col>
    </v-row>
    <v-row>
        <v-col v-show="showAnswer" v-if="this.selectedTab === 0 || this.detailsDialog===true ">
            <div v-if="this.answerCondition">
                <v-sheet class="pa-12" color="green lighten-3">
                    {{ message }}
                    <div v-html="questionn.explanation"></div>
                </v-sheet>
            </div>
            <div v-else-if="!this.answerCondition">
                <v-sheet class="pa-12" color="red lighten-3">
                    {{ message }}
                    <div v-html="questionn.explanation"></div>
                </v-sheet>
            </div>
        </v-col>
    </v-row>

</div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import Footer from "./Footer"
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    name: "Multiple",
    props: {
        questionn: Object,
        allowShuffleAnswer: Boolean,
        detailsDialog: Boolean,
        selectedTab: Number,

    },
    components: {
        Footer,
        Loading
    },
    data: () => {
        return {
            showAnswer: false,
            answerCondition: false,
            answers: [],
            boxColor: "",
            isLoading: false,
            fullPage: true,
            correctAnswers: [],
            userAnswers: [],
            message: "",
            allowShuffleAnswers: false
        };
    },
    created() {

        if (this.allowShuffleAnswer) {
            this.allowShuffleAnswers = true;

        }
        this.getAnswers();
    },

    watch: {
        questionn: function () {
            this.showAnswer = false;
            this.getAnswers();
        },
    },

    methods: {
        getAnswers() {
            this.isLoading = true
            this.answers = [];
            this.correctAnswers = [];
            this.userAnswers = []
            axios
                .get("/answers/" + this.questionn.id, {})
                .then((resp) => {

                    this.answers = resp.data;
                    if (this.allowShuffleAnswers) {

                        let answerShuffle = this.answers.sort(() => {
                            return 0.5 - Math.random();
                        });

                    }
                    const result = resp.data.filter((entry) => entry.is_correct === 1).map((entry) => entry.id);

                    this.correctAnswers = result;
                    this.$parent.openDialogOnEntry()
                    this.isLoading = false
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAnswerElementById(id) {

            return this.answers.find(
                (el) => el.id == id
            );
        },

        submit() {
            this.answers.forEach((el) => {

                el.styleAfterSubmit = "background-color: transparent";
            });
            if (this.userAnswers.length === 0) {
                this.$parent.getunansweredQuestion();
            }

            this.showAnswer = true;
            //DOTO AJAX call to get the right answer

            this.correctAnswers.forEach((el) => {

                this.getAnswerElementById(el).styleAfterSubmit =
                    "background-color: green";
            });

            if (_.isEqual(this.correctAnswers, this.userAnswers)) {
                this.boxColor = 'green'
                this.message = "CORRECT ANSWER";
                this.answerCondition = true
                if (!this.detailsDialog) {
                    this.$parent.getCorrectQuestion();
                }
            } else {
                this.userAnswers.forEach((el) => {

                    if (!this.correctAnswers.includes(el)) {

                        this.getAnswerElementById(el).styleAfterSubmit =
                            "background-color: red";

                    }
                });
                if (!this.detailsDialog && this.userAnswers.length !== 0) {
                    this.$parent.getWrongQuestion();
                }
                this.boxColor = 'red'
                this.message = "WRONG ANSWER";
                this.answerCondition = false
            }
        },
        stop() {
            this.$parent.stop();
        }
    },

};
</script>
