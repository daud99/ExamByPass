<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <div class="row">
            <div class="col col-lg-6 col-md-6 col-xs-12">
              <a v-bind="attrs" v-on="on">
                <card class="d-flex align-items-center">
                  <h5>Upload .ete file</h5>
                  <p>Upload your file here</p>
                </card>
              </a>
            </div>
            <div class="col col-lg-6 col-md-6 col-xs-12">
              <a>
                <card class="d-flex align-items-center">
                  <h5>Show my exams</h5>
                  <p>Show my uploaded files</p>
                </card>
              </a>
            </div>
          </div>
        </template>
        <v-card>
          <v-alert v-if="this.files_check" type="success"
            >File Uploaded</v-alert
          >
          <v-card-title class="section_header">
            <span class="headline">Upload a new Exam</span>
          </v-card-title>
          <v-file-input
            small-chips
            label="File input w/ small chips"
            ref="myfile"
            v-model="files"
          ></v-file-input>
          <v-btn color="primary" text @click="submitFiles()">Submit</v-btn>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Save
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
export default {
  data: () => ({
    dialog: false,
    files: null,
    files_check: false,
  }),

  methods: {
    submitFiles() {
      let formData = new FormData();

      if (this.files) {
        formData.append("file", this.files);

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
            console.log({ response });
          })
          .catch((error) => {
            console.log({ error });
          });
      } else {
        console.log("there are no files.");
      }
    },
  },
};
</script>
