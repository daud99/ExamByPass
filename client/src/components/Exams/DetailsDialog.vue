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
            <Single :questionn='this.sendQuestion' :detailsDialog='true' />
        </v-card>

    </v-dialog>
</v-row>
</template>

<script>
import Single from "../questionTypes/Single.vue";
export default {
    components: {
        Single
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
