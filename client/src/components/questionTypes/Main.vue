<template>
<div v-if="is_data_fetched">
    <div v-if="questions[indexVar].type === 'SINGLE_CHOICE'">
        <Single :questionn="questions[indexVar]" :is_called="true" :allowShuffleAnswer='allowShuffleAnswer' />
    </div>
    <div v-else-if="questions[indexVar].type === 'MULTIPLE_CHOICE'">
        <Multiple :questionn="questions[indexVar]" :allowShuffleAnswer='allowShuffleAnswer' />
    </div>
    <div v-else-if="questions[indexVar].type === 'SELECT_AND_PLACE'">
        <DragAndDrop :questionn="questions[indexVar]" />
    </div>
    <div v-else-if="questions[indexVar].type === 'FILL_IN_THE_BLANK'">
        <FillInTheBlank :questionn="questions[indexVar]" />
    </div>
    <div v-else-if="questions[indexVar].type === 'HOT_AREA'">
        <HotArea :questionn="questions[indexVar]" />
    </div>

    <Footer :counter='this.counterL' :totalQuestions='this.totalQuestions' />
</div>
</template>

<script>
import Single from "./Single.vue";
import Multiple from "./Multiple.vue";
import DragAndDrop from "./DragAndDrop";
import FillInTheBlank from './FillInTheBlank'
import HotArea from './HotArea'
import axios from "axios";
import Footer from "./Footer"
//import Vue from "vue";

export default {
    components: {
        Single,
        Multiple,
        DragAndDrop,
        FillInTheBlank,
        HotArea,
        Footer
    },
    props: {
        examId: Number,
        selectedCheck: Array,
        selectedRandomAnswer: Array
    },
    data() {
        return {
            questions: [],
            au: [],
            error: " ",
            page: 1,
            is_data_fetched: false,
            is_button_disabled: false,
            indexVar: 0,
            counterL: 0,
            totalQuestions: 0,
            allowShuffleAnswer: Boolean,
            wrongQuestion: [],
            correctQuestion: []
        };
    },

    created() {
        if (this.selectedRandomAnswer[0] === 'Answer order') {
            console.log("true")
            this.allowShuffleAnswer = true
        } else {
            this.allowShuffleAnswer = false
        }
        this.getQuestions();
        console.log(this.examId, this.selectedRandomAnswer)
    },
    // watch: {
    //     counterL: function () {

    //     },
    // },
    methods: {
        getQuestions() {

            axios
                .get("/questions/" + this.page + "/" + this.examId + "/" + this.selectedCheck)
                .then((resp) => {
                    console.log(resp);

                    this.questions = this.questions.concat(resp.data)
                    this.questions.pop()
                    this.is_data_fetched = true;
                    this.is_button_disabled = false;
                    this.totalQuestions = resp.data[resp.data.length - 1].count
                    console.log(this.questions, this.questions[this.questions.length - 1].count);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        counter() {
            console.log(this.questions.length);
            let totalLength = this.questions.length;

            if (this.counterL >= totalLength - 1) {
                console.log("disable");
                this.is_data_fetched = false;
                this.page += 1;
                this.counterL++;

                this.is_button_disabled = true;
                this.getQuestions();
            } else {
                this.counterL++;
            }
            console.log(this.indexVar, this.counterL);
            this.indexVar = this.counterL;
        },
        decrement() {
            this.counterL--
            this.indexVar = this.counterL;
        },
        getWrongQuestion() {
            //  const array1 = JSON.parse(JSON.stringify(this.wrongProp))

            this.wrongQuestion = this.wrongQuestion.concat(this.questions[this.indexVar])
            let uniqueAddresses = Array.from(new Set(this.wrongQuestion.map(a => a.id)))
                .map(id => {
                    return this.wrongQuestion.find(a => a.id === id)
                })
            this.wrongQuestion = uniqueAddresses

        },
        getCorrectQuestion() {
            this.correctQuestion = this.correctQuestion.concat(this.questions[this.indexVar])
            let uniqueAddresses = Array.from(new Set(this.correctQuestion.map(a => a.id)))
                .map(id => {
                    return this.correctQuestion.find(a => a.id === id)
                })
            this.correctQuestion = uniqueAddresses
        },
        stop() {

            let wrong = this.wrongQuestion.map((elem) => {
                let json = {}
                json.id = elem.id
                json.content = elem.content
                json.explanation = elem.explanation
                json.description = elem.description
                json.type = elem.type
                json.task_image = elem.task_image
                json.exam_library_id = elem.exam_library_id
                json.testlet_id = elem.testlet_id
                json.condition = false
                return json

            })
            let correct = this.correctQuestion.map((elem) => {
                let json = {}
                json.id = elem.id
                json.content = elem.content
                json.explanation = elem.explanation
                json.description = elem.description
                json.type = elem.type
                json.task_image = elem.task_image
                json.exam_library_id = elem.exam_library_id
                json.testlet_id = elem.testlet_id
                json.condition = true
                return json

            })

            this.$router.push({
                name: "Evaluation",
                params: {
                    wrongQuestions: wrong,
                    correctQuestions: correct,
                    totalQuestions: this.totalQuestions
                }
            });
            console.log(this.wrongQuestion)
        }

    },
};

//   computed: {
//     activeUserInfo() {
//       if (this.$store.state.tempUserObj.token !== undefined) {
//         var obj = {
//           id: this.$store.state.tempUserObj.id,
//           firstname: this.$store.state.tempUserObj.firstname,
//           lastname: this.$store.state.tempUserObj.lastname,
//           about: this.$store.state.tempUserObj.about,
//           photoURL:
//             this.$store.state.tempUserObj.photoURL === undefined
//               ? require("@/assets/images/user/user.png")
//               : this.$store.state.AppActiveUser.photoURL,
//           usertype: this.$store.state.tempUserObj.usertype,
//           email: this.$store.state.tempUserObj.email
//         };
//         console.log(obj);
//         return obj;
//       } else {
//         var obj = {
//           id: this.$store.state.AppActiveUser.id,
//           firstname: this.$store.state.AppActiveUser.firstname,
//           lastname: this.$store.state.AppActiveUser.lastname,
//           about: this.$store.state.AppActiveUser.about,
//           photoURL:
//             this.$store.state.AppActiveUser.photoURL === "undefined"
//               ? require("@/assets/images/user/user.png")
//               : this.$store.state.AppActiveUser.photoURL,
//           usertype: this.$store.state.AppActiveUser.usertype,
//           email: this.$store.state.AppActiveUser.email
//         };
//         console.log(obj);
//         return obj;
//       }
//     }
//   },
//   methods: {
//     goToUpload() {
//       this.$router.push("/upload");
//     },
//     goToEdit(idd) {
//       console.log("I am in edit" + idd);
//       this.$router.push({ name: "file-update", params: { id: idd } });
//     },
//     getAuth() {},
//     getCat(cat) {
//       console.log(cat);
//       return new Promise((resolve, reject) => {
//         axios
//           .get("/questions/", {
//             params: {
//               category: cat
//             }
//           })
//           .then(resp => {
//             this.questions = resp.data;
//             // var keys = Object.keys(resp.data);
//             // var rdd = resp.data;
//             resolve(resp);
//           })
//           .catch(err => {
//             console.log(err);
//             reject(err);
//           });
//       });
//     }
//   },

//   created() {
//     return new Promise((resolve, reject) => {
//       axios
//         .get("/questions/", {
//           params: {
//             category: "The Concept"
//           }
//         })
//         .then(resp => {
//           this.questions = resp.data;
//           var keys = Object.keys(resp.data);
//           var rdd = resp.data;
//           // for (var i = 0; i < keys.length; i++) {
//           //   var value = rdd[i];
//           //   var ua = value.userAllowed;
//           // }
//         })
//         .catch(err => {
//           console.log(err);
//           reject(err);
//         });
//     });
//   }
// };
</script>

<style scoped>
body {
    overflow: hidden !important;
}
</style>
