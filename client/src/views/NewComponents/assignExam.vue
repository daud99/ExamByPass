<template>
<v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">

        <v-card>
            <v-card-title>
                <span class="headline">User Profile</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-list>
                                <v-list-group prepend-icon="mdi-account" no-action>
                                    <template v-slot:activator>
                                        <v-list-item-content>
                                            <v-list-item-title v-text="assignItem.name"></v-list-item-title>
                                        </v-list-item-content>
                                    </template>

                                    <v-list-item v-for="child in userExams" :key="child.id">
                                        <v-list-item-content>
                                            <v-list-item-title v-text="child.exam_number"></v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-group>
                            </v-list>
                        </v-col>
                        <h6>Select Exams to Assign</h6>
                        <v-col cols="12" sm="12">
                            <v-select v-model="select" :items="adminExams" item-text="exam_number" item-value='id' label="Exams*" required></v-select>
                        </v-col>
                        <v-col cols="6" sm="12">
                            <v-btn class="ma-2" outlined color="success" @click="assign()" block>
                                Assign
                            </v-btn>
                        </v-col>
                        <v-col cols="6" sm="12">
                            <v-btn class="ma-2" outlined color="red" @click="unassign()" block>
                                Unassign
                            </v-btn>
                        </v-col>

                    </v-row>
                </v-container>
                <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
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
import {
    mapActions,
    mapGetters
} from 'vuex';
import {
    quickRequest
} from "../../../common/misc"
import Swal from "sweetalert2";
export default {
    props: {
        assignItem: Object,
        assignCondition: Boolean
    },
    data: () => ({
        dialog: false,
        userExams: [],
        adminExams: [],
        select: {},
        items: [{
                title: 'Breakfast & brunch'
            },
            {
                title: 'New American'
            },
            {
                title: 'Sushi'
            },
        ],
        // items: [{
        //     action: 'mdi-account',
        //     active: true,
        //     items: [{
        //             title: 'Breakfast & brunch'
        //         },
        //         {
        //             title: 'New American'
        //         },
        //         {
        //             title: 'Sushi'
        //         },
        //     ],
        //     title: '',
        // }, ],
    }),
    updated() {
        console.log(this.select)
    },
    created() {
        this.getUserExams()
        this.getAdminExams()
        this.dialog = this.assignCondition
        console.log('creates')
    },
    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
    },
    methods: {
        callParent() {
            this.dialog = false

            this.$emit("changeAssignCondition");
        },
        getUserExams() {

            axios
                .get("/exams/" + this.assignItem.id)
                .then((resp) => {

                    // this.exams = resp.data;
                    var results = resp.data.filter(function (entry) {
                        return entry.users.length !== 0;
                    });
                    this.userExams = results;
                    console.log(results)

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAdminExams() {
            let id = this["auth/getUser"].id
            axios
                .get("/exams/" + id)
                .then((resp) => {

                    // this.exams = resp.data;
                    var results = resp.data.filter(function (entry) {
                        return entry.users.length !== 0;
                    });
                    this.adminExams = results;
                    console.log('admin res', results)

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        assign() {
            let examId = this.select
            let userId = this.assignItem.id
            if (examId !== null && examId !== undefined && userId !== null) {
                try {
                    let response = quickRequest("/assignExam", "POST", {}, userId, examId);
                    if ("error" in response) {
                        Swal.fire({
                            type: "error",
                            icon: "error",
                            title: "Error",
                            text: response.error,
                        });
                    }
                    if (response) {
                        this.getUserExams()
                        Swal.fire({
                            type: "success",
                            icon: "success",
                            title: "Exam has assigned",
                            text: 'Exam has assigned successfully',
                        });

                    }
                } catch (e) {
                    console.log(e)
                    Swal.fire({
                        type: "error",
                        title: "Error Occured",
                        text: "Error occured while retriving session",
                    });
                }
            }
        },
        unassign() {
            let examId = this.select
            let userId = this.assignItem.id
            if (examId !== null && examId !== undefined && userId !== null) {
                try {
                    let response = quickRequest("/unassignExam", "DELETE", {}, userId, examId);
                    if ("error" in response) {
                        Swal.fire({
                            type: "error",
                            icon: "error",
                            title: "Error",
                            text: response.error,
                        });
                    }
                    if (response) {
                        this.getUserExams()
                        Swal.fire({
                            type: "success",
                            icon: "success",
                            title: "Exam has unassigned",
                            text: 'Exam has unassigned successfully',
                        });

                    }
                } catch (e) {
                    console.log(e)
                    Swal.fire({
                        type: "error",
                        title: "Error Occured",
                        text: "Error occured while retriving session",
                    });
                }
            }
        }
    },
}
</script>

<style scoped>
.assigndialog {
    z-index: 9999 !important;
    max-height: 60%
}
</style>
