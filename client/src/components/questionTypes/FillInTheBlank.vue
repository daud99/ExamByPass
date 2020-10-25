<template>
<v-container fluid>
    <v-row>
        <v-col>
            <v-sheet class="pa-12" color="grey lighten-3">
                <p v-html="questionn.content"></p>
                <v-text-field v-model="userAnswer" label="Your Response" placeholder="Answer" outlined></v-text-field>
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
            <v-sheet class="pa-12" color="red lighten-3">
                {{ message }}
                <div v-html="questionn.explanation"></div>
            </v-sheet>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import axios from "axios";
export default {
    props: {
        questionn: Object,
        detailsDialog: Boolean,
        selectedTab: Number
    },
    data: () => {
        return {
            answers: [],
            showAnswer: false,
            userAnswer: "",
            message: "",
            correctAnswer: "See the solution below.",
        };
    },
    created() {
        console.log("i am single created");
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
            axios
                .get("/answers/" + this.questionn.id, {})
                .then((resp) => {
                    console.log(resp);
                    this.answers = resp.data;
                    this.$parent.openDialogOnEntry()
                    // const result = resp.data.filter((entry) => entry.is_correct === 1);

                })
                .catch((err) => {
                    console.log(err);
                });
        },

        submit(userAnswer) {
            this.showAnswer = true;
            console.log(this.answers[0])
            //DOTO AJAX call to get the right answer
            if (userAnswer == this.answers[0].fill_in_the_blank_value) {
                if (!this.detailsDialog) {
                    this.$parent.getCorrectQuestion();
                }
                this.message = "CORRECT ANSWER";
            } else {
                if (!this.detailsDialog) {
                    this.$parent.getWrongQuestion();
                }
                this.message =
                    "WRONG ANSWER: RIGHT ONE: " + this.answers[0].fill_in_the_blank_value;
            }
        },
        stop() {
            this.$parent.stop();
        }
    }
};
</script>
