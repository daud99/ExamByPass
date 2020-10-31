<template>
<div class="scrolll">

    <v-row>
        <v-col>
            <v-sheet class="pa-12" color="grey lighten-3">
                <p v-html="questionn.content"></p>
                <v-radio-group v-model="userAnswer" :mandatory="true">
                    <v-radio :style="answerElm.styleAfterSubmit" v-for="answerElm in answers" :key="answerElm.id" :label="answerElm.content" :value="answerElm.id"></v-radio>
                </v-radio-group>
            </v-sheet>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <div v-if="this.detailsDialog===true">
                <v-btn class="ma-2" tile color="indigo" dark @click="submit(userAnswer)">Answer</v-btn>
            </div>

            <!-- <h2>{{question_id}}</h2> -->
        </v-col>
    </v-row>
    <v-row>
        <v-col v-show="showAnswer" v-if="this.selectedTab === 0 || this.detailsDialog===true ">
            <v-sheet class="pa-12" color="red lighten-3">
                {{ message }}
                <div v-html="questionn.explanation"></div>
            </v-sheet>
        </v-col>
    </v-row>

</div>
</template>

<script scoped>
import axios from "axios";
import Footer from "./Footer"
export default {
    props: {
        questionn: Object,
        allowShuffleAnswer: Boolean,
        detailsDialog: Boolean,
        selectedTab: Number
    },
    name: "Single",
    components: {
        Footer
    },
    data: () => {
        return {
            answers: [],
            showAnswer: false,
            correctAnswer: [],
            correctProp: [],
            wrongProp: [],
            unansweredProp: [],

            userAnswer: "1",
            message: "",
            styleAfterSubmit: "",
            allowShuffleAnswers: false
        };
    },
    created() {
        console.log("i am single created", this.allowShuffleAnswer);
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
    updated() {
        console.log("prop", this.wrongProp)
    },
    methods: {
        getAnswers() {
            this.answers = [];
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
                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });
                    const result = resp.data.filter((entry) => entry.is_correct === 1);
                    this.correctAnswer = result;
                    this.$parent.openDialogOnEntry()
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        randomAnswers: (answers, allowShuffleAnswers) => {
            console.log("randomize")
            if (allowShuffleAnswers) {
                return answers.sort(() => {
                    return 0.5 - Math.random();
                });
            }

            return answers;
        },
        getAnswerElementById(id) {
            return this.answers.find((el) => el.id == id);
        },
        submit() {

            this.answers.forEach((el) => {
                el.styleAfterSubmit = "background-color: transparent";
            });

            this.showAnswer = true;
            console.log(this.getAnswerElementById(this.correctAnswer[0].id));
            this.getAnswerElementById(this.correctAnswer[0].id).styleAfterSubmit =
                "background-color: green";
            //DOTO AJAX call to get the right answer
            if (this.userAnswer == this.correctAnswer[0].id) {
                this.message = "CORRECT ANSWER";
                if (!this.detailsDialog) {
                    this.$parent.getCorrectQuestion();
                }
            } else {
                this.getAnswerElementById(this.userAnswer).styleAfterSubmit =
                    "background-color: red";
                if (!this.detailsDialog) {
                    this.$parent.getWrongQuestion();
                }
                // /this.wrongProp = this.wrongProp.concat(this.answers)
                //this.wrongProp.push(this.answers)

                // this.answers.map((elem) => {
                //     let json = {}
                //     console.log(elem)
                //     json.questionId = this.questionn.id
                //     json.question = this.questionn.content
                //     json.answerId = elem.id
                //     json.answer = elem.content
                //     this.wrongProp = this.wrongProp.concat(json)
                //     console.log(json)
                //     this.wrongProp.push(json)
                // })

                this.message =
                    "WRONG ANSWER: RIGHT ONE: " + this.correctAnswer[0].content;
            }
        },

    },
};
</script>

<style scoped>

</style>
