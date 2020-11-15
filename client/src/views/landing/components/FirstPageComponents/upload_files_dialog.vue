<template>
<div>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
                <div class="row" v-if="!showButton">
                    <div class="col col-lg-6 col-md-6 col-xs-12">
                        <a v-bind="attrs" v-on="on">
                            <card class="d-flex align-items-center">
                                <h5>Upload .ete file</h5>
                                <p>Upload your file here</p>
                            </card>
                        </a>
                    </div>
                    <div class="col col-lg-6 col-md-6 col-xs-12">
                        <router-link to="/exams">
                            <card class="d-flex align-items-center">

                                <h5>Show my exams</h5>
                                <p>Show my uploaded files</p>
                            </card>
                        </router-link>

                    </div>
                </div>
            </template>
            <v-card>
                <v-alert v-if="this.files_check" type="success">File Uploaded</v-alert>
                <v-alert v-if="this.show_alert" color="red" type="error" dark>
                    No Files Selected
                </v-alert>
                <v-card-title class="section_header">
                    <span class="headline">Upload a new Exam</span>
                </v-card-title>
                <v-file-input color="deep-purple accent-4" counter label="File input" prepend-icon="mdi-paperclip" :show-size="1000" ref="myfile" v-model="files">

                    <template v-slot:selection="{ index, text }">
                        <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>
                            {{ text }}
                        </v-chip>

                        <span v-else-if="index === 2" class="overline grey--text text--darken-3 mx-2">
                            +{{ files.length - 2 }} File(s)
                        </span>
                    </template>
                </v-file-input>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialog()">
                        Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="submitFiles()">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</div>
</template>

<style scoped>
.section_header {
    background-color: rgb(65, 30, 243);
    color: white;
}
</style>

<script>
import axios from "axios";
import {
    mapActions,
    mapGetters
} from 'vuex';
export default {
    props: {
        showButton: Boolean
    },
    data: () => ({
        dialog: false,
        files: null,
        files_check: false,
        show_alert: false,
    }),
    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
    },
    created() {
        this.dialog = this.showButton
        console.log("user is", this["auth/isAuthenticated"])
    },
    methods: {
        closeDialog() {
            this.dialog = false
            this.$emit("changeUploadCondition");
        },
        submitFiles() {
            this.show_alert = false
            this.files_check = false
            let formData = new FormData();

            if (this.files) {
                formData.append("file", this.files);
                formData.append("userId", this["auth/getUser"].id)

                console.log(formData.getAll("file"));
                console.log(this.files, formData);
                axios
                    .post("/parser/uploadFile", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => {
                        console.log("Success!");
                        this.files_check = true;

                        console.log({
                            response
                        });
                    })
                    .catch((error) => {
                        console.log({
                            error
                        });
                    });
            } else {
                this.show_alert = true
                console.log("there are no files.");
            }
        },
    },
};
</script>
