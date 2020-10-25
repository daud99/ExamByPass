<template>
<v-row justify="center">
    <v-dialog v-model="dialog" fullscreen persistent KeyboardEvent hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn @click="callParent()" icon dark>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Question #{{this.sendQuestion.id}}</v-toolbar-title>
                <v-spacer></v-spacer>

            </v-toolbar>
            <div v-if="this.sendQuestion.type==='SINGLE_CHOICE'">
                <Single :questionn='this.sendQuestion' :detailsDialog='true' />
            </div>
            <div v-if="this.sendQuestion.type==='MULTIPLE_CHOICE'">
                <Multiple :questionn='this.sendQuestion' :detailsDialog='true' />
            </div>
            <div v-if="this.sendQuestion.type==='SELECT_AND_PLACE'">
                <DragAndDrop :questionn='this.sendQuestion' :detailsDialog='true' />
            </div>
            <div v-if="this.sendQuestion.type==='FILL_IN_THE_BLANK'">
                <FillInTheBlank :questionn='this.sendQuestion' :detailsDialog='true' />
            </div>
            <div v-if="this.sendQuestion.type==='HOT_AREA'">
                <HotArea :questionn='this.sendQuestion' :detailsDialog='true' />
            </div>
        </v-card>

    </v-dialog>
</v-row>
</template>

<script>
import Single from "../questionTypes/Single.vue";
import Multiple from "../questionTypes/Multiple";
import DragAndDrop from "../questionTypes/DragAndDrop";
import FillInTheBlank from "../questionTypes/FillInTheBlank";
import HotArea from "../questionTypes/HotArea";
export default {
    components: {
        Single,
        Multiple,
        DragAndDrop,
        FillInTheBlank,
        HotArea
    },
    props: {

        checkCondition: Boolean,
        sendQuestion: Object
    },
    data() {
        return {
            dialog: false,
            notifications: false,
            sound: true,
            widgets: false,

        }
    },
    created() {
        this.dialog = this.checkCondition
        console.log(this.sendQuestion)

    },
    methods: {

        callParent() {
            console.log("hi call")
            this.dialog = false
            this.$parent.clickFalse();
        }
    },
}
</script>
