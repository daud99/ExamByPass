<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-sheet class="pa-12" color="grey lighten-3">
          <p v-html="question.content"></p>
          <v-responsive>
            <img id="taskImage" :src="question.answers.members.taskImage.value" class="task-image" />
            <canvas id="myCanvas" />
            <draggable
              :list="question.answers.members.placesInfo.elements"
              @start="isDragging=true"
              @end="isDragging=false"
              :move="onMove"
              id="draggableList"
            >
              <img
                v-for="answer in getAllElements"
                :key="answer.members.id.value"
                :id="'cutted' + answer.members.id.value"
                class="cutted"
                :element-id="answer.members.id.value"
                :position-id="answer.members.id.value"
                :place-type="answer.members.placeType.value"
                :post-dragged-place-type="''"
              />
            </draggable>
          </v-responsive>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn class="ma-2" tile color="indigo" dark @click="submit()">Answer</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-show="showAnswer">
        <v-sheet class="pa-12" color="red lighten-3">
          {{ message }}
          <v-responsive v-if="wrongAnswered">
            <img id="answerImage" :src="question.answers.members.taskImage.value" />
            <img
              v-for="answer in getTargetElements"
              :key="answer.members.id.value"
              :id="'answerCutted' + answer.members.id.value"
              class="cutted"
            />
          </v-responsive>
          <div class="explanation" v-html="question.explanation"></div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { fabric } from "fabric";
import draggable from "vuedraggable";

export default {
  name: "DragAndDrop",
  components: {
    draggable,
  },
  data: () => {
    return {
      question: {
        id: 3,
        answers: {
          members: {
            placesInfo: {
              elements: [
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 30,
                        },
                        top: {
                          value: 122,
                        },
                        width: {
                          value: 225,
                        },
                        height: {
                          value: 32,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 0,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 1,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 31,
                        },
                        top: {
                          value: 158,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 2,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 31,
                        },
                        top: {
                          value: 195,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 2,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 3,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 32,
                        },
                        top: {
                          value: 233,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 3,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 4,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 31,
                        },
                        top: {
                          value: 271,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 4,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 5,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 31,
                        },
                        top: {
                          value: 310,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 5,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 6,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 31,
                        },
                        top: {
                          value: 348,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 6,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 7,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 31,
                        },
                        top: {
                          value: 388,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 7,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 8,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 30,
                        },
                        top: {
                          value: 426,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 8,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 9,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 29,
                        },
                        top: {
                          value: 466,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 9,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 10,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 29,
                        },
                        top: {
                          value: 507,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 32,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 10,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 11,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 29,
                        },
                        top: {
                          value: 546,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 32,
                        },
                      },
                    },
                    placeType: {
                      value: "SOURCE",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 11,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 12,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 195,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 32,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 0,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 13,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 226,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 32,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 14,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 257,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 31,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 2,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 15,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 287,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 30,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 3,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 16,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 316,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 31,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 4,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 17,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 346,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 30,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 5,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 18,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 375,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 30,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: -1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 19,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 404,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 31,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: -1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 20,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 434,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 31,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: -1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 21,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 278,
                        },
                        top: {
                          value: 464,
                        },
                        width: {
                          value: 223,
                        },
                        height: {
                          value: 32,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: -1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 22,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 197,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 31,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 6,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 23,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 227,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 32,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 7,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 24,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 258,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 31,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 8,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 25,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 288,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 31,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 9,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 26,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 318,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 30,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 10,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 27,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 347,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 30,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: 11,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 28,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 376,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 31,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: -1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 29,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 406,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 30,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: -1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 30,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 435,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 31,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: -1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 31,
                    },
                  },
                },
                {
                  members: {
                    area: {
                      members: {
                        left: {
                          value: 531,
                        },
                        top: {
                          value: 465,
                        },
                        width: {
                          value: 224,
                        },
                        height: {
                          value: 33,
                        },
                      },
                    },
                    placeType: {
                      value: "TARGET",
                    },
                    groupIndex: {
                      value: 0,
                    },
                    correctObjectIndex: {
                      value: -1,
                    },
                    position: {
                      value: 0,
                    },
                    ownedPlaceIndex: {
                      value: 0,
                    },
                    id: {
                      value: 32,
                    },
                  },
                },
              ],
            },
            dragDropType: {
              value: "MULTIPLE",
            },
            taskImage: {
              value:
                "data:image/png;base64,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",
            },
          },
        },
        content:
          "DRAG DROP<br /><br />A security administrator wants to implement strong security on the company smart phones and terminal servers located in the data center. <br /><br /><b>INSTRUCTIONS </b><br />Drag and drop the applicable controls to each asset type.<br /><br />Controls can be used multiple times and not all placeholders need to be filled. <br /><br /><i></i><br /><i>If at any time you would like to bring back the initial state of the simulation, please click the Reset All button.</i>",
        examLibraryItemId: 1,
        explanation: "<div></div>",
        extras: null,
        hasExhibits: false,
        isAccessibleInDemoVersion: true,
        offset: 2003944,
        testletId: null,
        type: "SELECT_AND_PLACE",
        typeId: 4,
      },
      showAnswer: false,
      message: "",
      isDragging: false,
      delayedDragging: false,
      list: [],
      wrongAnswered: false,
    };
  },
  computed: {
    getSourceElements() {
      return this.question.answers.members.placesInfo.elements.filter(
        (el) => el.members.placeType.value === "SOURCE"
      );
    },
    getAllElements() {
      return this.question.answers.members.placesInfo.elements;
    },
    getTargetElements() {
      return this.question.answers.members.placesInfo.elements.filter(
        (el) => el.members.placeType.value === "TARGET"
      );
    },
  },
  methods: {
    getCroppedImg(image, crop) {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      return canvas.toDataURL("image/png");
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;

      let relatedElementId = relatedElement.members.id.value;
      let draggedElementId = draggedElement.members.id.value;

      let relatedElementDiv = document.getElementById(
        "cutted" + relatedElementId
      );
      let draggedElementDiv = document.getElementById(
        "cutted" + draggedElementId
      );

      if (
        (draggedElementDiv.getAttribute("place-type") == "SOURCE" &&
          relatedElementDiv.getAttribute("place-type") == "SOURCE") ||
        draggedElementDiv.getAttribute("place-type") == "TARGET"
      ) {
        return;
      }

      let oldLeft = draggedElementDiv.style.left;
      let oldTop = draggedElementDiv.style.top;
      let oldHeight = draggedElementDiv.style.height;
      let oldWidth = draggedElementDiv.style.width;
      let oldPositionId = draggedElementDiv.getAttribute("position-id");

      draggedElementDiv.style.left = relatedElementDiv.style.left;
      draggedElementDiv.style.top = relatedElementDiv.style.top;
      draggedElementDiv.style.height = relatedElementDiv.style.height;
      draggedElementDiv.style.width = relatedElementDiv.style.width;
      draggedElementDiv.setAttribute(
        "position-id",
        relatedElementDiv.getAttribute("position-id")
      );

      relatedElementDiv.style.left = oldLeft;
      relatedElementDiv.style.top = oldTop;
      relatedElementDiv.style.width = oldWidth;
      relatedElementDiv.style.height = oldHeight;
      relatedElementDiv.setAttribute("position-id", oldPositionId);
      relatedElementDiv.setAttribute(
        "post-dragged-place-type",
        draggedElementDiv.getAttribute("place-type")
      );
    },
    submit() {
      var userAnswers = [];
      this.showAnswer = true;
      this.wrongAnswered = false;

      document.getElementById("draggableList").childNodes.forEach((el) => {
        userAnswers.push({
          id: parseInt(el.getAttribute("element-id")),
          position: parseInt(el.getAttribute("position-id")),
          placeType: el.getAttribute("place-type"),
          postDraggedPlaceType: el.getAttribute("post-dragged-place-type"),
        });
      });

      // TODO get correct Answers from backend
      let sourceTypeAnswers = userAnswers.filter(
        (elm) => elm.placeType == "SOURCE"
      );
      let correctAnswers = [];
      this.getTargetElements.forEach((el) => {
        correctAnswers.push({
          id: el.members.id.value,
          placeType: el.members.placeType.value,
          correctObjectIndex: el.members.correctObjectIndex.value,
        });
      });

      for (let el of sourceTypeAnswers) {
        let answerObject = correctAnswers.find((elm) => elm.id == el.position);

        if (!answerObject || answerObject.correctObjectIndex + 1 != el.id) {
          this.wrongAnswered = true;
          break;
        }
      }

      if (this.wrongAnswered) {
        this.message = "WRONG ANSWER";
        this.showAnswerImage(this.getAllElements);
      } else {
        this.message = "CORRECT ANSWER";
      }
    },
    showAnswerImage(answers) {
      const image = new Image();
      var imgWidth = 0;
      var imgHeight = 0;
      var width = 0;
      var height = 0;

      image.src = this.question.answers.members.taskImage.value;
      image.onload = () => {
        imgWidth = image.naturalWidth;
        imgHeight = image.naturalHeight;

        const img2 = document.getElementById("answerImage");
        width = img2.clientWidth;
        height = img2.clientHeight;
        var xRatio = width / imgWidth;
        var yRatio = height / imgHeight;

        answers.forEach((el) => {
          let cutted = document.getElementById(
            "answerCutted" + el.members.id.value
          );

          let sourceAnswer = this.getSourceElements.find(
            (elm) =>
              elm.members.id.value === el.members.correctObjectIndex.value + 1
          );

          if (!sourceAnswer || !cutted) {
            return;
          }
          cutted.src = this.getCroppedImg(image, {
            x: sourceAnswer.members.area.members.left.value,
            y: sourceAnswer.members.area.members.top.value,
            width: sourceAnswer.members.area.members.width.value,
            height: sourceAnswer.members.area.members.height.value,
          });

          cutted.style.width = `${
            el.members.area.members.width.value * xRatio
          }px`;
          cutted.style.height = `${
            el.members.area.members.height.value * yRatio
          }px`;
          cutted.style.left = `${
            el.members.area.members.left.value * xRatio
          }px`;
          cutted.style.top = `${el.members.area.members.top.value * yRatio}px`;
        });
      };
    },
  },
  mounted() {
    const image = new Image();
    var imgWidth = 0;
    var imgHeight = 0;
    var width = 0;
    var height = 0;

    image.src = this.question.answers.members.taskImage.value;
    image.onload = () => {
      imgWidth = image.naturalWidth;
      imgHeight = image.naturalHeight;

      const img2 = document.getElementById("taskImage");
      width = img2.clientWidth;
      height = img2.clientHeight;
      var xRatio = width / imgWidth;
      var yRatio = height / imgHeight;

      const canvas = new fabric.Canvas("myCanvas");
      canvas.setDimensions({ width: width, height: height });

      this.getAllElements.forEach((el) => {
        let cutted = document.getElementById("cutted" + el.members.id.value);

        cutted.src = this.getCroppedImg(image, {
          x: el.members.area.members.left.value,
          y: el.members.area.members.top.value,
          width: el.members.area.members.width.value,
          height: el.members.area.members.height.value,
        });

        cutted.style.width = `${
          el.members.area.members.width.value * xRatio
        }px`;
        cutted.style.height = `${
          el.members.area.members.height.value * yRatio
        }px`;
        cutted.style.left = `${el.members.area.members.left.value * xRatio}px`;
        cutted.style.top = `${el.members.area.members.top.value * yRatio}px`;

        let rectSpecs = el.members.area.members;

        const rect = new fabric.Rect({
          left: rectSpecs.left.value * xRatio,
          top: rectSpecs.top.value * yRatio,
          fill: "white",
          stroke: "black",
          width: rectSpecs.width.value * xRatio,
          height: rectSpecs.height.value * yRatio,
          chosen: false,
          id: el.members.id.value,
        });

        canvas.add(rect);
      });

      document.getElementById("myCanvas").fabric = canvas;
    };
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
  },
};
</script>

<style>
.task-image {
  position: absolute;
  z-index: 1;
}
#myCanvas,
#answerCanvas {
  position: relative;
  z-index: 2;
}
.cutted {
  position: absolute;
  z-index: 3;
}
.explanation div img:first-child {
  display: none;
}
</style>