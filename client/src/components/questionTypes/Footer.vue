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

            <v-chip v-if="this.selectedTab === 0" outlined class="ma-2 " color="white" label style="font-size:18px">

                <strong>Score</strong> : {{this.obtainScore}}/{{this.totalScore}}
            </v-chip>
            <v-chip v-else outlined class="ma-2 " color="white" label style="font-size:18px">

                <div id="countdown_timer" class="font-weight-bold headline" v-bind:class="{timer_complete: timer <= 0 }">
                    <span>{{ hours | two_digits }}</span>
                    <span>:</span>
                    <span>{{ minutes | two_digits }}</span>
                    <span>:</span>
                    <span>{{ seconds | two_digits }}</span>
                </div>
            </v-chip>
        </v-col>

    </v-row>
</v-footer>
</template>

<script>
export default {
    props: {
        counter: Number,
        totalQuestions: Number,
        obtainScore: Number,

    },
    data: () => {
        return {
            // totalQuestions: 50,
            countQuestion: 0,
            totalScore: 800,
            interval: Number,
            timer: Number,
            count: 0,
            selectedTab: Number,
            subscriptionStatus: String
        }
    },
    // watch: {
    //     obtainScore: function () {
    //         this.obtainScore2 = JSON.parse(localStorage.getItem("obtainScore"));
    //         console.log(this.obtainScore2)
    //     }
    // },

    mounted() {
        this.interval = setInterval(() => {
            this.timer--;
            this.check_timer_completed()
        }, 1000);
    },
    created() {
        this.selectedTab = JSON.parse(localStorage.getItem("selectedTab"));
        this.subscriptionStatus = JSON.parse(localStorage.getItem("subscriptionStatus"));
        let examTime = JSON.parse(localStorage.getItem("examTime")) * 60;

        let timer_now = localStorage.getItem('timer_now')
        if (timer_now > 0) {
            this.timer = timer_now
        } else {
            this.timer = examTime
        }

        window.addEventListener('beforeunload', this.save_timer)
    },
    methods: {

        check_timer_completed() {

            if (this.timer <= 0) {
                this.$parent.stop()
                console.log("second end")
                clearInterval(this.interval)
                this.timer = 0
                this.save_timer()
            }
        },
        save_timer() {
            localStorage.setItem('timer_now', this.timer)
            // this.obtainScore2 = JSON.parse(localStorage.getItem("obtainScore"));
            //     console.log('refresh', thi.obtainScore2)

        },
        nextQuestion() {

            //console.log(this.obtainScore2, this.obtainScore)
            if (this.subscriptionStatus === 'active') {
                if (this.counter + 1 < this.totalQuestions) {
                    console.log("i am if", this.counter + 1)
                    this.$parent.submit();
                }
            } else {
                if (this.counter + 1 < this.totalQuestions) {
                    console.log("i am else", this.counter + 1)
                    if (this.counter + 1 <= 10) {

                        this.$parent.submit(this.counter + 1);
                    } else {
                        console.log("please subscribe")
                    }
                }
            }

        },
        previousQuestion() {

            if (this.counter >= 1) {
                this.$parent.decrement();
            }
        }
    },
    computed: {
        seconds() {
            return Math.trunc(this.timer) % 60;
        },
        minutes() {
            return Math.trunc((this.timer) / 60) % 60;
        },
        hours() {
            return Math.trunc((this.timer) / 60 / 60) % 24;
        },
        days() {
            return Math.trunc((this.timer) / 60 / 60 / 24);
        }
    },
    filters: {
        two_digits: function (value) {
            if (value.toString().length <= 1) {
                return "0" + value.toString();
            }
            return value.toString();
        }
    },
}
</script>
