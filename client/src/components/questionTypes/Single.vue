<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-sheet class="pa-12" color="grey lighten-3">
          <p v-html="questionn.content"></p>
          <v-radio-group v-model="userAnswer" :mandatory="true">
            <v-radio
              :style="answerElm.styleAfterSubmit"
              v-for="answerElm in answers"
              :key="answerElm.id"
              :label="answerElm.content"
              :value="answerElm.id"
            ></v-radio>
          </v-radio-group>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn class="ma-2" tile color="indigo" dark @click="submit(userAnswer)"
          >Answer</v-btn
        >
        <!-- <h2>{{question_id}}</h2> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col v-show="showAnswer">
        <v-sheet class="pa-12" color="red lighten-3">
          {{ message }}
          <div v-html="questionn.explanation"></div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script scoped>
import axios from "axios";
export default {
  props: {
    questionn: Object,
  },
  name: "Single",
  data: () => {
    return {
      answers: [],
      showAnswer: false,
      correctAnswer: [],
      question: {
        id: 3,
        answers: {
          members: {
            answers: {
              elements: [
                {
                  id: "1",
                  styleAfterSubmit: "",
                  members: {
                    isCorrect: {
                      value: true,
                    },
                    content: {
                      value:
                        "The file extension is not registered as an allowed asset MIMES in the OSGI config, Day CQ DAM Asset Upload Restriction.",
                    },
                  },
                },
                {
                  id: "2",
                  styleAfterSubmit: "",
                  members: {
                    isCorrect: {
                      value: false,
                    },
                    content: {
                      value:
                        "The file extension is case-sensitive and should be all lower case.",
                    },
                  },
                },
                {
                  id: "3",
                  styleAfterSubmit: "",
                  members: {
                    isCorrect: {
                      value: false,
                    },
                    content: {
                      value:
                        "The user does not have permission to upload an asset with the specific file extension.",
                    },
                  },
                },
                {
                  id: "4",
                  styleAfterSubmit: "",
                  members: {
                    isCorrect: {
                      value: false,
                    },
                    content: {
                      value:
                        "The MIME Type mapping setup for the file extension does not exist in OSGI config, Day CQ Scene7 Asset Mime type Service.",
                    },
                  },
                },
              ],
            },
            allowShuffleAnswers: {
              value: true,
            },
          },
        },
        content:
          "An author uploads a PDF document and receives a “Restricted Files” error.<br /><br />What is causing this problem?",
        examLibraryItemId: 1,
        explanation:
          'Reference: <a href="https://community.adobe.com/t5/photoshop-elements/elements-9-organizer-only-imports-one-folder-at-a-time/m-p/3144080?page=3"><u>https://community.adobe.com/t5/photoshop-elements/elements-9-organizer-only-imports-one-folder-at-a-time/m-p/3144080?page=3</u></a>',
        extras: null,
        hasExhibits: false,
        isAccessibleInDemoVersion: true,
        offset: 94515,
        testletId: null,
        type: "SINGLE_CHOICE",
        typeId: 1,
      },
      correctAnswer2: {
        value: {
          id: "1",
          content:
            "The file extension is not registered as an allowed asset MIMES in the OSGI config, Day CQ DAM Asset Upload Restriction.",
        },
      },
      userAnswer: "1",
      message: "",
      styleAfterSubmit: "",
    };
  },
  created() {
    console.log("i am single created");
    this.getAnswers();
  },

  watch: {
    questionn: function () {
      this.showAnswer = false;
      this.getAnswers();
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
          const result = resp.data.filter((entry) => entry.is_correct === 1);
          this.correctAnswer = result;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    randomAnswers: (answers, allowShuffleAnswers) => {
      if (allowShuffleAnswers) {
        return answers.sort(() => {
          return 0.5 - Math.random();
        });
      }

      return answers;
    },
    getAnswerElementById(id) {
      return this.answers.find((el) => el.id == id);
    },
    submit(userAnswer) {
      console.log(userAnswer);
      this.answers.forEach((el) => {
        el.styleAfterSubmit = "background-color: transparent";
      });
      console.log(this.correctAnswer);
      this.showAnswer = true;
      console.log(this.getAnswerElementById(this.correctAnswer[0].id));
      this.getAnswerElementById(this.correctAnswer[0].id).styleAfterSubmit =
        "background-color: green";
      //DOTO AJAX call to get the right answer
      if (userAnswer == this.correctAnswer[0].id) {
        this.message = "CORRECT ANSWER";
      } else {
        this.getAnswerElementById(userAnswer).styleAfterSubmit =
          "background-color: red";

        this.message =
          "WRONG ANSWER: RIGHT ONE: " + this.correctAnswer[0].content;
      }
    },
  },
};
</script>
