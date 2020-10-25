<template>
<div>
    <v-row>
        <v-col>
            <v-sheet class="pa-12" color="grey lighten-3">
                <p v-html="questionn.content"></p>
                <v-responsive>
                    <img id="taskImage" :src="questionn.task_image" class="task-image" />
                    <canvas id="myCanvas" @click="handleCanvasClicking" />
                </v-responsive>
            </v-sheet>
        </v-col>
    </v-row>
    <v-row>
        <v-col>

            <div v-if="this.detailsDialog===true">
                <v-btn class="ma-2" tile color="indigo" dark @click="submit">Answer</v-btn>
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
                <div class="explanation" v-html="questionn.explanation"></div>
            </v-sheet>
        </v-col>
    </v-row>
</div>
</template>

<script>
import {
    fabric
} from "fabric";
import axios from "axios";

export default {
    props: {
        questionn: Object,
        detailsDialog: Boolean,
        selectedTab: Number
    },
    name: "HotArea",
    data: () => {
        return {
            answers: [],
            answer_area: [],
            correctAnswer: [],
            canvas: null,
            showAnswer: false,
            message: "",
            question: {
                id: 10,
                answers: {
                    members: {
                        answerAreas: {
                            elements: [{
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 127,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 25,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: true,
                                        },
                                        id: {
                                            value: 1,
                                        },
                                    },
                                },
                                {
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 151,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 25,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: false,
                                        },
                                        id: {
                                            value: 2,
                                        },
                                    },
                                },
                                {
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 255,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 25,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: false,
                                        },
                                        id: {
                                            value: 3,
                                        },
                                    },
                                },
                                {
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 279,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 25,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: true,
                                        },
                                        id: {
                                            value: 4,
                                        },
                                    },
                                },
                                {
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 382,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 29,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: false,
                                        },
                                        id: {
                                            value: 5,
                                        },
                                    },
                                },
                                {
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 410,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 26,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: false,
                                        },
                                        id: {
                                            value: 6,
                                        },
                                    },
                                },
                                {
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 435,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 25,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: true,
                                        },
                                        id: {
                                            value: 7,
                                        },
                                    },
                                },
                                {
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 537,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 26,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: true,
                                        },

                                        id: {
                                            value: 8,
                                        },
                                    },
                                },
                                {
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 562,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 26,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: false,
                                        },
                                        id: {
                                            value: 9,
                                        },
                                    },
                                },
                                {
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 86,
                                                },
                                                top: {
                                                    value: 587,
                                                },
                                                width: {
                                                    value: 543,
                                                },
                                                height: {
                                                    value: 29,
                                                },
                                            },
                                        },
                                        isRightAnswer: {
                                            value: false,
                                        },
                                        id: {
                                            value: 10,
                                        },
                                    },
                                },
                            ],
                        },
                        taskImage: {
                            value: "",
                        },
                    },
                },
                content: "HOTSPOT<br /><br />You need to configure a data loss prevention (DLP) policy to meet the compliance and security requirements.<br /><br />How should you configure the policy rule? To answer, select the appropriate options in the answer area.<br /><br /><b>NOTE</b>: Each correct selection is worth one point.",
                examLibraryItemId: 1,
                explanation: '',
                extras: null,
                hasExhibits: false,
                isAccessibleInDemoVersion: false,
                offset: 56579,
                testletId: 4,
                type: "HOT_AREA",
                typeId: 6,
            },
            chosenAnswers: [],
            rightAnswers: [],
        };
    },
    created() {
        this.$nextTick(() => this.getAnswers());
    },
    watch: {
        questionn: function () {
            this.showAnswer = false;
            this.chosenAnswers = []
            console.log("watcher")
            this.getAnswers();
        },
    },
    methods: {

        getAnswers() {
            this.answers = [];
            this.chosenAnswers = []
            axios
                .get("/answers/" + this.questionn.id, {})
                .then((resp) => {
                    console.log(resp);
                    this.answers = resp.data;
                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });
                    if (
                        this.answers.length !== 0 &&
                        this.question.type === "HOT_AREA"
                    ) {
                        this.getAnswerArea();
                    }
                    this.$parent.openDialogOnEntry()

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAnswerArea() {
            this.answer_area = [];

            axios
                .get("/answers_area/" + this.answers[0].id, {})
                .then((resp) => {
                    console.log(resp);
                    this.answer_area = resp.data;
                    console.log("in get answer method", this.answer_area)
                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });
                    // if (this.isLoaded) {
                    //     console.log("i am isloaded")
                    //     this.getMounted()
                    // }
                    const result = resp.data.filter((entry) => entry.is_right_answer === 1);
                    console.log(result)
                    let result_id = result.map(a => a.id);
                    console.log(result_id)
                    this.correctAnswer = result_id;
                    this.getMounted(resp)
                })
                .catch((err) => {
                    console.log(err);
                });
            console.log("in end getanswerarea", this.answer_area)
        },
        getMounted(answer_area2) {
            const img = new Image();
            var imgWidth = 0;
            var imgHeight = 0;
            var width = 0;
            var height = 0;
            var that = this;
            img.src = this.questionn.task_image;
            console.log("i am mounted")
            // console.log("answer area is", this.answer_area, answer_area2)
            img.onload = function () {
                imgWidth = img.naturalWidth;
                imgHeight = img.naturalHeight;

                const img2 = document.getElementById("taskImage");
                width = img2.clientWidth;
                height = img2.clientHeight;
                var xRatio = width / imgWidth;
                var yRatio = height / imgHeight;

                const canvas = new fabric.Canvas("myCanvas");
                canvas.setDimensions({
                    width: width,
                    height: height
                });

                console.log("answer area is", this.answer_area, answer_area2)
                answer_area2.data.forEach((answer) => {
                    let rectSpecs = answer;
                    console.log(rectSpecs)
                    const rect = new fabric.Rect({
                        left: rectSpecs.left_position * xRatio,
                        top: rectSpecs.top * yRatio,
                        fill: "transparent",
                        stroke: "transparent",
                        width: rectSpecs.width * xRatio,
                        height: rectSpecs.height * yRatio,
                        chosen: false,
                        id: answer.id,
                    });
                    console.log(rect)
                    canvas.add(rect);
                });
                document.getElementById("myCanvas").fabric = canvas;
            };
        },

        handleCanvasClicking(event) {
            var canvas = document.getElementById("myCanvas").fabric;
            console.log(canvas, event)
            var pointer = canvas.getPointer(event);
            var objects = canvas.getObjects();
            for (var i = objects.length - 1; i >= 0; i--) {
                if (objects[i].containsPoint(pointer)) {
                    let indexOfSelected = this.chosenAnswers.indexOf(
                        objects[i].get("id")
                    );
                    if (!objects[i].get("chosen")) {
                        objects[i].set("chosen", true);
                        objects[i].set("fill", "rgba(128,128,128,0.3)");
                        if (indexOfSelected == -1) {
                            this.chosenAnswers.push(objects[i].get("id"));
                        }
                    } else {
                        objects[i].set("chosen", false);
                        objects[i].set("fill", "transparent");
                        if (indexOfSelected > -1) {
                            this.chosenAnswers.splice(indexOfSelected, 1);
                        }
                    }
                    break;
                }
            }

            canvas.renderAll();

            event.preventDefault();
            return false;
        },
        submit() {

            this.showAnswer = true;
            // TODO send this chosen Answers IDs to check it with correct one from server side
            this.rightAnswers = [1, 4, 7, 8];

            var wrongAnswered = false;

            var canvas = document.getElementById("myCanvas").fabric;
            console.log(this.correctAnswer, canvas)
            var objects = canvas.getObjects();
            for (var i = objects.length - 1; i >= 0; i--) {
                if (
                    this.correctAnswer.indexOf(objects[i].get("id")) > -1 &&
                    !objects[i].get("chosen")
                ) {
                    objects[i].set("fill", "rgba(0,255,0,0.3)");
                    wrongAnswered = true;
                    continue;
                }

                if (objects[i].get("chosen")) {
                    if (this.correctAnswer.indexOf(objects[i].get("id")) > -1) {
                        objects[i].set("fill", "rgba(0,255,0,0.3)");
                    } else {
                        objects[i].set("fill", "rgba(255,0,0,0.3)");
                        wrongAnswered = true;
                    }
                }
            }

            if (wrongAnswered) {
                if (!this.detailsDialog && this.chosenAnswers.length !== 0) {
                    this.$parent.getWrongQuestion();
                }
                this.message = "WRONG ANSWER";
            } else {
                if (!this.detailsDialog) {
                    this.$parent.getCorrectQuestion();
                }
                this.message = "CORRECT ANSWER";
            }
            if (this.chosenAnswers.length === 0) {
                this.$parent.getunansweredQuestion();
            }
            canvas.renderAll();
        },
        stop() {
            this.$parent.stop();
        }
    },
};
</script>

<style>
.task-image {
    position: absolute;

    z-index: 1;
}

#myCanvas {
    position: relative;
    z-index: 2;

}

.explanation div img:first-child {
    display: none;
}
</style>
