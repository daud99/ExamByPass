<template>
<div>

    <v-row>
        <v-col>
            <v-sheet class="pa-12" color="grey lighten-3">
                <p v-html="questionn.content"></p>
                <v-checkbox v-model="userAnswers" class="ma-0 pa-0" v-for="answerElm in answers" :key="answerElm.id" :style="answerElm.styleAfterSubmit" :label="answerElm.content" :value="answerElm.id"></v-checkbox>
            </v-sheet>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <div v-if="this.detailsDialog===true">
                <v-btn class="ma-2" tile color="indigo" dark @click="submit(userAnswers)">Answer</v-btn>
            </div>
            <div v-if="!this.detailsDialog">
                <v-btn class="ma-2" tile color="indigo" dark @click="stop()">stop</v-btn>
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
export default {
    name: "Multiple",
    props: {
        questionn: Object,
        allowShuffleAnswer: Boolean,
        detailsDialog: Boolean,
        selectedTab: Number,

    },
    components: {
        Footer
    },
    data: () => {
        return {
            showAnswer: false,
            answerCondition: false,
            answers: [],
            boxColor: "",
            correctAnswers: [],
            userAnswers: [],
            message: "",
            allowShuffleAnswers: false
        };
    },
    created() {
        console.log("i am single created");
        if (this.allowShuffleAnswer) {
            this.allowShuffleAnswers = true;
            console.log(" ia am allow")
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
            this.answers = [];
            this.correctAnswers = [];
            this.userAnswers = []
            axios
                .get("/answers/" + this.questionn.id, {})
                .then((resp) => {
                    console.log(resp);
                    this.answers = resp.data;
                    if (this.allowShuffleAnswers) {
                        console.log("i am random", this.allowShuffleAnswers)
                        let answerShuffle = this.answers.sort(() => {
                            return 0.5 - Math.random();
                        });

                    }
                    const result = resp.data.filter((entry) => entry.is_correct === 1).map((entry) => entry.id);
                    console.log("answer filter is", result)
                    this.correctAnswers = result;
                    this.$parent.openDialogOnEntry()
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAnswerElementById(id) {
            console.log(id, this.answers)
            return this.answers.find(
                (el) => el.id == id
            );
        },

        submit() {
            this.answers.forEach((el) => {
                console.log("on submit el", el)
                el.styleAfterSubmit = "background-color: transparent";
            });
            if (this.userAnswers.length === 0) {
                this.$parent.getunansweredQuestion();
            }

            this.showAnswer = true;
            //DOTO AJAX call to get the right answer

            this.correctAnswers.forEach((el) => {
                console.log("correct answers", this.getAnswerElementById(el), el)
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
                    console.log("last el is", el)
                    if (!this.correctAnswers.includes(el)) {
                        console.log("last el n if", this.getAnswerElementById(el).styleAfterSubmit)
                        this.getAnswerElementById(el).styleAfterSubmit =
                            "background-color: red";
                        console.log("last el n if", this.getAnswerElementById(el).styleAfterSubmit)
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
