<template>
<div v-if="is_data_fetched">
    <div v-if="questions[indexVar].type === 'SINGLE_CHOICE'">
        <Single :questionn="questions[indexVar]" :is_called="true" />
    </div>
    <div v-else-if="questions[indexVar].type === 'MULTIPLE_CHOICE'">
        <Multiple :questionn="questions[indexVar]" />
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
    <v-btn :disabled="this.is_button_disabled" class="ma-2" tile color="indigo" dark @click="counter()">next</v-btn>
</div>
</template>

<script>
import Single from "./Single.vue";
import Multiple from "./Multiple.vue";
import DragAndDrop from "./DragAndDrop";
import FillInTheBlank from './FillInTheBlank'
import HotArea from './HotArea'
import axios from "axios";
//import Vue from "vue";

export default {
    components: {
        Single,
        Multiple,
        DragAndDrop,
        FillInTheBlank,
        HotArea
    },
    props: {
        myprop: Object
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
        };
    },

    created() {
        this.getQuestions();
        console.log(this.myprop, this.$route.params.myprop)
    },
    methods: {
        getQuestions() {
            this.questions = [];
            axios
                .get("/questions/" + this.page)
                .then((resp) => {
                    console.log(resp);
                    this.questions = resp.data;
                    this.is_data_fetched = true;
                    this.is_button_disabled = false;
                    console.log(this.questions);
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
                this.counterL = 0;
                this.is_button_disabled = true;
                this.getQuestions();
            } else {
                this.counterL++;
            }
            console.log(this.indexVar, this.counterL);
            this.indexVar = this.counterL;
        },
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
