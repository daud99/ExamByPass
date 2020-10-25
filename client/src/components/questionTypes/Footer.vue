<template>
<v-footer :fixed='true' color="primary lighten-1" padless>
    <v-row class="justify-space-between" no-gutters>
        <v-btn text class="my-2" @click=" previousQuestion">
            <v-icon x-large color="white">
                mdi-arrow-left-circle
            </v-icon>
        </v-btn>

        <v-chip class="ma-2 " color="primary" label style="font-size:18px">

            Question <span style="font-size:px;padding-left:30px">{{counter+1}} / {{totalQuestions}}</span>

        </v-chip>
        <v-btn text class="my-2" @click="nextQuestion">
            <v-icon x-large color="white">
                mdi-arrow-right-circle
            </v-icon>
        </v-btn>

        <v-col class="primary lighten-2 py-0 text-center white--text" cols="12" style="font-size:22px">

            <v-chip outlined class="ma-2 " color="white" label style="font-size:18px">

                <strong>Score</strong> : {{this.obtainScore}}/{{this.totalScore}}
            </v-chip>
        </v-col>

    </v-row>
</v-footer>
</template>

<script>
export default {
    props: {
        counter: Number,
        totalQuestions: Number
    },
    data: () => {
        return {
            // totalQuestions: 50,
            countQuestion: 0,
            totalScore: 800,
            obtainScore: 0,
            count: 0
        }
    },
    methods: {
        submit() {},
        nextQuestion() {
            if (this.counter + 1 < this.totalQuestions) {
                console.log(this.counter + 1, this.totalQuestions)
                this.$parent.submit();
            }

        },
        previousQuestion() {

            if (this.counter >= 1) {
                this.$parent.decrement();
            }
        }
    },
}
</script>
