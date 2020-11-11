<template>
<div>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">

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
                    <v-btn color="blue darken-1" text @click="dialog = false">
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
    methods: {
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
