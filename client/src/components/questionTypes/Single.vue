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
            <v-btn class="ma-2" tile color="indigo" dark @click="submit(userAnswer)">Answer</v-btn>
            <div v-if="!this.detailsDialog">
                <v-btn class="ma-2" tile color="indigo" dark @click="stop()">stop</v-btn>
            </div>
            <!-- <h2>{{question_id}}</h2> -->
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

</div>
</template>

<script scoped>
import axios from "axios";
import Footer from "./Footer"
export default {
    props: {
        questionn: Object,
        allowShuffleAnswer: Boolean,
        detailsDialog: Boolean
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
            question: {
                id: 3,
                answers: {
                    members: {
                        answers: {
                            elements: [{
                                    id: "1",
                                    styleAfterSubmit: "",
                                    members: {
                                        isCorrect: {
                                            value: true,
                                        },
                                        content: {
                                            value: "The file extension is not registered as an allowed asset MIMES in the OSGI config, Day CQ DAM Asset Upload Restriction.",
                                        },
                                    },
                                },
                                {
                                    id: "2",
                                    styleAfterSubmit: "",
                                    members: {
                                        isCorrect: {
                                            value: false,
                                        },
                                        content: {
                                            value: "The file extension is case-sensitive and should be all lower case.",
                                        },
                                    },
                                },
                                {
                                    id: "3",
                                    styleAfterSubmit: "",
                                    members: {
                                        isCorrect: {
                                            value: false,
                                        },
                                        content: {
                                            value: "The user does not have permission to upload an asset with the specific file extension.",
                                        },
                                    },
                                },
                                {
                                    id: "4",
                                    styleAfterSubmit: "",
                                    members: {
                                        isCorrect: {
                                            value: false,
                                        },
                                        content: {
                                            value: "The MIME Type mapping setup for the file extension does not exist in OSGI config, Day CQ Scene7 Asset Mime type Service.",
                                        },
                                    },
                                },
                            ],
                        },
                        allowShuffleAnswers: {
                            value: true,
                        },
                    },
                },
                content: "An author uploads a PDF document and receives a “Restricted Files” error.<br /><br />What is causing this problem?",
                examLibraryItemId: 1,
                explanation: 'Reference: <a href="https://community.adobe.com/t5/photoshop-elements/elements-9-organizer-only-imports-one-folder-at-a-time/m-p/3144080?page=3"><u>https://community.adobe.com/t5/photoshop-elements/elements-9-organizer-only-imports-one-folder-at-a-time/m-p/3144080?page=3</u></a>',
                extras: null,
                hasExhibits: false,
                isAccessibleInDemoVersion: true,
                offset: 94515,
                testletId: null,
                type: "SINGLE_CHOICE",
                typeId: 1,
            },
            correctAnswer2: {
                value: {
                    id: "1",
                    content: "The file extension is not registered as an allowed asset MIMES in the OSGI config, Day CQ DAM Asset Upload Restriction.",
                },
            },
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
        submit(userAnswer) {
            console.log(userAnswer);
            this.answers.forEach((el) => {
                el.styleAfterSubmit = "background-color: transparent";
            });
            console.log(this.correctAnswer);
            this.showAnswer = true;
            console.log(this.getAnswerElementById(this.correctAnswer[0].id));
            this.getAnswerElementById(this.correctAnswer[0].id).styleAfterSubmit =
                "background-color: green";
            //DOTO AJAX call to get the right answer
            if (userAnswer == this.correctAnswer[0].id) {
                this.message = "CORRECT ANSWER";
                if (!this.detailsDialog) {
                    this.$parent.getCorrectQuestion();
                }
            } else {
                this.getAnswerElementById(userAnswer).styleAfterSubmit =
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
        stop() {
            this.$parent.stop();
            // ar = ar.concat(this.questionn)
            //  let arraySet2 = new Set(this.wrongProp);
            // const array1 = JSON.parse(JSON.stringify(this.wrongProp))
            // const uniqueAddresses = Array.from(new Set(array1.map(a => a.answerId)))
            //     .map(id => {
            //         return array1.find(a => a.answerId === id)
            //     })
            //this.wrongProp = uniqueAddresses
            // console.log(this.wrongProp, uniqueAddresses)
        }
    },
};
</script>

<style scoped>

</style>
