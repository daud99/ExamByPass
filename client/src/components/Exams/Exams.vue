<template>
<div>
    <v-card class="mx-auto" v-if="this.showList">

        <v-list subheader two-line>
            <v-subheader inset>Exams</v-subheader>

            <template v-for="exam in this.exams">
                <div :key="exam.id" v-on:click="myMethod(exam.id,exam.exam_number)">
                    <a class="list-group-item list-group-item-action">
                        <v-list-item class="table-hover">

                            <v-list-item-avatar>
                                <v-icon class="grey lighten-2" dark>
                                    mdi-file
                                </v-icon>
                            </v-list-item-avatar>
                            <v-hover>
                                <v-list-item-content>
                                    <v-list-item-title v-text="exam.exam_number"></v-list-item-title>

                                    <v-list-item-subtitle>{{exam.real_question_count}} questions</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-hover>
                            <v-list-item-action>
                                <v-list-item-action-text>Time Limit:{{exam.time_limit}}</v-list-item-action-text>
                                <v-menu bottom offset-y>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="ma-2" v-bind="attrs" v-on="on" fab outlined color="indigo">
                                            <v-icon>mdi-format-list-bulleted-square</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item v-for="(item, i) in items" :key="i" @click="() => {}">
                                            <v-list-item-title>{{ item.title }}</v-list-item-title>

                                        </v-list-item>

                                    </v-list>
                                </v-menu>
                            </v-list-item-action>

                        </v-list-item>
                    </a>
                </div>
            </template>

        </v-list>
        <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <v-dialog v-model="dialog" max-width="45%">

                <v-card>
                    <v-card-title class="headline blue darken-2">
                        <h3 style="color:white">Start Exam:&nbsp;&nbsp;</h3>
                        <h4 style="color:white">{{this.examName}}</h4>
                    </v-card-title>

                    <div class="container-fluid">
                        <div class="row">
                            <div class="col col-lg-12 col-md-12 col-xs-12">
                                <button type="button" class="btn btn-sm btn-primary btn-block">
                                    <h4 style="color:white; text-weigth:bolder; line-height: 1.6;">
                                        <v-icon color="white">mdi-play</v-icon>
                                        CONTINUE LAST SESSION
                                    </h4>
                                    <h6 style="color:white; text-weigth:bolder; line-height: 1.6;">AT QUESTION 1/3</h6>
                                </button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-lg-6 col-md-6 col-xs-6">
                                <button type="button" class="btn btn-sm btn-primary btn-block">
                                    <v-icon color="white">mdi-clock</v-icon>
                                    <h6 style="color:white; text-weigth:bolder; line-height: 1.6;">TRAINING MODE</h6>
                                </button>
                            </div>
                            <div class="col col-lg-6 col-md-6 col-xs-6">
                                <button type="button" class="btn btn-sm btn-primary btn-block">
                                    <v-icon color="white">mdi-clock</v-icon>
                                    <h6 style="color:white; text-weigth:bolder; line-height: 1.6;">EXAM MODE</h6>
                                </button>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col col-lg-12 col-md-12 col-xs-12">
                                <p>WE SHOW YOU THE CORRECT ANSWER AFTER EACH QUESTION. THERE IS NO TIME LIMIT DURING TRAINING</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col col-lg-4 col-md-4 col-xs-4">
                                <button type="button" class="btn btn-sm btn-primary btn-block">
                                    <v-icon color="white">mdi-dialpad</v-icon>
                                    <h6 style="color:white; text-weigth:bolder; line-height: 1.4;">ALL QUESTIONS</h6>
                                </button>
                            </div>
                            <div class="col col-lg-4 col-md-4 col-xs-4">
                                <button type="button" class="btn btn-sm btn-primary btn-block">
                                    <v-icon color="white">mdi-message-text</v-icon>
                                    <h6 style="color:white; text-weigth:bolder; line-height: 1.4;">SPECIFIC EXAM</h6>
                                </button>
                            </div>
                            <div class="col col-lg-4 col-md-4 col-xs-4">
                                <button type="button" class="btn btn-sm btn-primary btn-block">
                                    <v-icon color="white">mdi-checkbox-marked-circle</v-icon>
                                    <h6 style="color:white; text-weigth:bolder; line-height: 1.4;">INCORRECT QUESTIONS</h6>
                                </button>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col col-lg-12 col-md-12 col-xs-12">
                                <p>RANDOMIZE</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-lg-6 col-md-6 col-xs-6">
                                <v-checkbox label="Question order (Unavailable in trail mode)" color="success" value="primary" hide-details></v-checkbox>
                            </div>
                            <div class="col col-lg-6 col-md-6 col-xs-6">
                                <v-checkbox label="Answer order" color="success" value="primary" hide-details></v-checkbox>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col col-lg-12 col-md-12 col-xs-12">
                                <p>Question Types</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-lg-4 col-md-4 col-xs-4">
                                <v-checkbox label="Drag and Drop" color="success" value="primary" hide-details></v-checkbox>
                            </div>
                            <div class="col col-lg-4 col-md-4 col-xs-4">
                                <v-checkbox label="Single Choice" color="success" value="primary" hide-details></v-checkbox>
                            </div>
                            <div class="col col-lg-4 col-md-4 col-xs-4">
                                <v-checkbox label="Hot Area" color="success" value="primary" hide-details></v-checkbox>
                            </div>
                        </div>
                    </div>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text v-on:click="startExam()">
                            START EXAM
                        </v-btn>
                        <v-btn color="primary" text @click="dialog = false">
                            CANCEL
                        </v-btn>
                    </v-card-actions>

                </v-card>
            </v-dialog>
        </div>

    </v-card>
    <div v-else-if="!this.showList">
        <Main :examId="examId" />
    </div>
</div>
</template>

<script>
import axios from "axios";
import Main from "../questionTypes/Main"
export default {
    components: {
        Main
    },
    name: "Exams",
    data: () => {
        return {
            dialog: false,
            exams: [],
            examName: "",
            examId: Number,
            showList: true,
            items: [{
                    title: 'Delete',

                },
                {
                    title: 'Statistics',
                },
                {
                    title: 'Open in Editor',
                },

            ],

        }

    },
    created() {
        console.log("created")
        this.getExams()
    },
    methods: {

        getExams() {

            axios
                .get("/exams")
                .then((resp) => {
                    console.log(resp);
                    this.exams = resp.data;
                    // var results = resp.data.filter(function (entry) {
                    //   return entry.is_correct === 1;
                    // });

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // sendId(id) {
        //     this.$router.push({
        //         name: 'Main',
        //         params: {
        //             myprop: id
        //         }
        //     })
        // }
        myMethod(id, name) {

            //this.showList = false
            this.examId = id;
            this.examName = name
            console.log("i am tet", this.examId, name)
            this.dialog = true

        },
        startExam() {
            this.showList = false
            this.dialog = false
        }
    }
}
</script>
