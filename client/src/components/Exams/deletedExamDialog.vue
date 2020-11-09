<template>
<v-row justify="center">
    <v-dialog v-model="dialog" scrollable persistent KeyboardEvent max-width="1000px">

        <v-card>
            <v-card-title>Deleted Exams</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 600px;">
                <template v-for="exam in exams">
                    <div :key="exam.id" v-on:click="myMethod(exam.id,exam.exam_number)">
                        <a class="list-group-item list-group-item-action" v-if="exam.deleted">
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
                                            <v-list-item v-for="(item, i) in items" :key="i" @click="listItem(item,exam.id)">
                                                <v-list-item-title>{{ item.title }}</v-list-item-title>

                                            </v-list-item>

                                        </v-list>
                                    </v-menu>
                                </v-list-item-action>

                            </v-list-item>
                        </a>
                    </div>
                </template>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="blue darken-1" text @click="callParent()">
                    Close
                </v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>
</v-row>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
    props: {
        deletedDialog: Boolean,
        exams: Array
    },
    data() {
        return {
            dialogm1: '',
            show: false,
            dialog: false,

            items: [{
                    title: 'Undelete',

                },

            ],
        }
    },

    created() {
        console.log("created deleed", this.exams)
        this.dialog = this.deletedDialog

    },
    methods: {

        recoverExam(id) {
            console.log("id is", id)
            axios
                .put("/recover/" + id)
                .then(() => {
                    Swal.fire({
                        type: "Success",
                        title: "Recovered",
                        text: "Exam is recovered successfully",
                    });
                    this.$parent.getExams()
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        myMethod(id, number) {

        },
        listItem(item, id) {
            console.log("i am in list", item.title)
            if (item.title === "Undelete") {
                this.recoverExam(id)
            }
        },
        callParent() {
            console.log("hi call")
            this.dialog = false
            // this.$parent.getExams()
            this.$parent.clickFalse();

        }
    }
}
</script>
