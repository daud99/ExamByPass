<template>
<v-card class="mx-auto">

    <v-list subheader two-line>
        <v-subheader inset>Exams</v-subheader>

        <template v-for="exam in this.exams">
            <div :key="exam.id" v-on:click="myMethod(exam.id)">
                <a class="list-group-item list-group-item-action">
                    <v-list-item class="table-hover">

                        <v-list-item-avatar>
                            <v-icon class="grey lighten-1" dark>
                                mdi-folder
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
</v-card>
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
            exams: [],
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
        myMethod(test) {
            console.log("i am tet", test)

        }
    }
}
</script>
