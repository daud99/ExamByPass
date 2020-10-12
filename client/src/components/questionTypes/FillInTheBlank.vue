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
            <v-btn class="ma-2" tile color="indigo" dark @click="submit(userAnswer)">Answer</v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col v-show="showAnswer">
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
                this.message = "CORRECT ANSWER";
            } else {
                this.message =
                    "WRONG ANSWER: RIGHT ONE: " + this.answers[0].fill_in_the_blank_value;
            }
        }
    }
};
</script>
