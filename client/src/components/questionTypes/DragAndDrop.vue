<template>
<div>
    <v-row>
        <v-col>
            <v-sheet class="pa-12" color="grey lighten-3">
                <p v-html="questionn.content"></p>
                <v-responsive>
                    <img id="taskImage" :src="questionn.task_image" class="task-image" />
                    <canvas id="myCanvas" />
                    <draggable :list="this.answer_area" @start="isDragging=true" @end="isDragging=false" :move="onMove" id="draggableList">
                        <img v-for="answer in getAllElements" :key="answer.id" :id="'cutted' + answer.id" class="cutted" :element-id="answer.id" :position-id="answer.id" :place-type="answer.place_type" :post-dragged-place-type="''" />
                    </draggable>
                </v-responsive>
            </v-sheet>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-btn class="ma-2" tile color="indigo" dark @click="submit()">Answer</v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col v-show="showAnswer">
            <v-sheet class="pa-12" color="red lighten-3">
                {{ message }}
                <v-responsive v-if="wrongAnswered">
                    <img id="answerImage" :src="questionn.task_image" />
                    <img v-for="answer in getTargetElements" :key="answer.id" :id="'answerCutted' + answer.id" class="cutted" />
                    <div v-for="answer in getTargetElements" :key="answer.id">
                        {{answer.id}}

                    </div>
                </v-responsive>
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
import draggable from "vuedraggable";
import axios from "axios";
export default {
    name: "DragAndDrop",
    components: {
        draggable,
    },
    props: {
        questionn: Object,
    },
    data: () => {
        return {
            question: {
                id: 3,
                answers: {
                    members: {
                        placesInfo: {
                            elements: [{
                                    members: {
                                        area: {
                                            members: {
                                                left: {
                                                    value: 30,
                                                },
                                                top: {
                                                    value: 122,
                                                },
                                                width: {
                                                    value: 225,
                                                },
                                                height: {
                                                    value: 32,
                                                },
                                            },
                                        },
                                        placeType: {
                                            value: "SOURCE",
                                        },
                                        groupIndex: {
                                            value: 0,
                                        },
                                        correctObjectIndex: {
                                            value: 0,
                                        },
                                        position: {
                                            value: 0,
                                        },
                                        ownedPlaceIndex: {
                                            value: 0,
                                        },
                                        id: {
                                            value: 1,
                                        },
                                    },
                                },

                            ],
                        },
                        dragDropType: {
                            value: "MULTIPLE",
                        },
                        taskImage: {

                        },
                    },
                },
                content: "DRAG DROP<br /><br />A security administrator wants to implement strong security on the company smart phones and terminal servers located in the data center. <br /><br /><b>INSTRUCTIONS </b><br />Drag and drop the applicable controls to each asset type.<br /><br />Controls can be used multiple times and not all placeholders need to be filled. <br /><br /><i></i><br /><i>If at any time you would like to bring back the initial state of the simulation, please click the Reset All button.</i>",
                examLibraryItemId: 1,
                explanation: "<div></div>",
                extras: null,
                hasExhibits: false,
                isAccessibleInDemoVersion: true,
                offset: 2003944,
                testletId: null,
                type: "SELECT_AND_PLACE",
                typeId: 4,
            },
            showAnswer: false,
            message: "",
            isDragging: false,
            delayedDragging: false,
            list: [],
            wrongAnswered: false,
            answers: [],
            answer_area: [],
            correctAnswer: [],
            isLoaded: false,
        };
    },
    created() {
        console.log("i am single created", this.questionn);

        this.$nextTick(() => this.getAnswers());
    },
    computed: {
        getSourceElements() {
            console.log(this.answer_area.filter(
                (el) => el.place_type === "SOURCE"
            ))
            return this.answer_area.filter(
                (el) => el.place_type === "SOURCE"
            );
        },
        getAllElements() {
            return this.answer_area;
        },
        getTargetElements() {
            return this.answer_area.filter(
                (el) => el.place_type === "TARGET"
            );
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
                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });

                    this.getAnswerArea();

                    const result = resp.data.filter((entry) => entry.is_correct === 1);
                    this.correctAnswer = result;
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
                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });
                    this.getMounted()
                    // const result = resp.data.filter((entry) => entry.is_correct === 1);
                    // this.correctAnswer = result;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getMounted() {
            const image = new Image();
            var imgWidth = 0;
            var imgHeight = 0;
            var width = 0;
            var height = 0;
            console.log("i am mounted 1")
            image.src = this.questionn.task_image;
            image.onload = () => {
                imgWidth = image.naturalWidth;
                imgHeight = image.naturalHeight;

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

                this.getAllElements.forEach((el) => {
                    let cutted = document.getElementById("cutted" + el.id);
                    console.log("i am mounted 2")
                    cutted.src = this.getCroppedImg(image, {
                        x: el.left_position,
                        y: el.top,
                        width: el.width,
                        height: el.height,
                    });

                    cutted.style.width = `${el.width * xRatio}px`;
                    cutted.style.height = `${el.height * yRatio}px`;
                    cutted.style.left = `${el.left_position * xRatio}px`;
                    cutted.style.top = `${el.top * yRatio}px`;

                    let rectSpecs = el;

                    const rect = new fabric.Rect({
                        left: rectSpecs.left_position * xRatio,
                        top: rectSpecs.top * yRatio,
                        fill: "white",
                        stroke: "black",
                        width: rectSpecs.width * xRatio,
                        height: rectSpecs.height * yRatio,
                        chosen: false,
                        id: el.id,
                    });

                    canvas.add(rect);
                });

                document.getElementById("myCanvas").fabric = canvas;
            };
        },
        getCroppedImg(image, crop) {
            const canvas = document.createElement("canvas");
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            return canvas.toDataURL("image/png");
        },
        onMove({
            relatedContext,
            draggedContext
        }) {
            const relatedElement = relatedContext.element;
            const draggedElement = draggedContext.element;

            let relatedElementId = relatedElement.id;
            let draggedElementId = draggedElement.id;

            let relatedElementDiv = document.getElementById(
                "cutted" + relatedElementId
            );
            let draggedElementDiv = document.getElementById(
                "cutted" + draggedElementId
            );

            if (
                (draggedElementDiv.getAttribute("place-type") == "SOURCE" &&
                    relatedElementDiv.getAttribute("place-type") == "SOURCE") ||
                draggedElementDiv.getAttribute("place-type") == "TARGET"
            ) {
                return;
            }

            let oldLeft = draggedElementDiv.style.left;
            let oldTop = draggedElementDiv.style.top;
            let oldHeight = draggedElementDiv.style.height;
            let oldWidth = draggedElementDiv.style.width;
            let oldPositionId = draggedElementDiv.getAttribute("position-id");

            draggedElementDiv.style.left = relatedElementDiv.style.left;
            draggedElementDiv.style.top = relatedElementDiv.style.top;
            draggedElementDiv.style.height = relatedElementDiv.style.height;
            draggedElementDiv.style.width = relatedElementDiv.style.width;
            draggedElementDiv.setAttribute(
                "position-id",
                relatedElementDiv.getAttribute("position-id")
            );

            relatedElementDiv.style.left = oldLeft;
            relatedElementDiv.style.top = oldTop;
            relatedElementDiv.style.width = oldWidth;
            relatedElementDiv.style.height = oldHeight;
            relatedElementDiv.setAttribute("position-id", oldPositionId);
            relatedElementDiv.setAttribute(
                "post-dragged-place-type",
                draggedElementDiv.getAttribute("place-type")
            );
        },
        submit() {
            var userAnswers = [];
            this.showAnswer = true;
            this.wrongAnswered = false;
            console.log("i am submit")
            document.getElementById("draggableList").childNodes.forEach((el) => {
                userAnswers.push({
                    id: parseInt(el.getAttribute("element-id")),
                    position: parseInt(el.getAttribute("position-id")),
                    place_type: el.getAttribute("place-type"),
                    postDraggedPlaceType: el.getAttribute("post-dragged-place-type"),
                });
            });

            // TODO get correct Answers from backend
            let sourceTypeAnswers = userAnswers.filter(
                (elm) => elm.place_type == "SOURCE"
            );
            let correctAnswers = [];
            this.getTargetElements.forEach((el) => {
                correctAnswers.push({
                    id: el.id,
                    place_type: el.place_type,
                    correct_object_index: el.correct_object_index,
                });
            });
            console.log(userAnswers, sourceTypeAnswers, correctAnswers)
            for (let el of sourceTypeAnswers) {
                let answerObject = correctAnswers.find((elm) => elm.id == el.position);

                if (!answerObject || answerObject.correct_object_index + 1 != el.id) {
                    this.wrongAnswered = true;
                    break;
                }
            }

            if (this.wrongAnswered) {
                this.message = "WRONG ANSWER";
                this.showAnswerImage(this.getAllElements);
            } else {
                this.message = "CORRECT ANSWER";
            }
        },
        showAnswerImage(answers) {
            const image = new Image();
            var imgWidth = 0;
            var imgHeight = 0;
            var width = 0;
            var height = 0;

            image.src = this.questionn.task_image;
            image.onload = () => {
                imgWidth = image.naturalWidth;
                imgHeight = image.naturalHeight;
                console.log('answers', answers)
                const img2 = document.getElementById("answerImage");
                width = img2.clientWidth;
                height = img2.clientHeight;
                var xRatio = width / imgWidth;
                var yRatio = height / imgHeight;

                answers.forEach((el) => {
                    let cutted = document.getElementById(
                        "answerCutted" + el.id
                    );
                    console.log('answer for each', el.id, document.getElementById(
                        "answerCutted"
                    ))

                    console.log(el.correct_object_index + 1)
                    let sourceAnswer = this.getSourceElements.find(
                        (elm) =>
                        elm.id === el.correct_object_index + 1
                    );
                    console.log(sourceAnswer, cutted)
                    if (!sourceAnswer || !cutted) {
                        return;
                    }
                    cutted.src = this.getCroppedImg(image, {
                        x: sourceAnswer.left_position,
                        y: sourceAnswer.top,
                        width: sourceAnswer.width,
                        height: sourceAnswer.height,
                    });

                    cutted.style.width = `${
            el.width * xRatio
          }px`;
                    cutted.style.height = `${
            el.height * yRatio
          }px`;
                    cutted.style.left = `${
            el.left_position * xRatio
          }px`;
                    cutted.style.top = `${el.top * yRatio}px`;
                });
            };
        },
    },

    watch: {
        questionn: async function () {
            this.showAnswer = false;
            await this.getAnswers();
            this.isLoaded = true
        },
        isDragging(newValue) {
            if (newValue) {
                this.delayedDragging = true;
                return;
            }
            this.$nextTick(() => {
                this.delayedDragging = false;
            });
        },
    },
};
</script>

<style>
.task-image {
    position: absolute;
    z-index: 1;
}

#myCanvas,
#answerCanvas {
    position: relative;
    z-index: 2;
}

.cutted {
    position: absolute;
    z-index: 3;
}

.explanation div img:first-child {
    display: none;
}
</style>
