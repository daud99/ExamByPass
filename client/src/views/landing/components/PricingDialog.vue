<template>
<v-row justify="center">
    <v-dialog v-model="dialog" width='850px' hide-overlay transition="dialog-bottom-transition">

        <v-card>
            <v-toolbar dark color="primary">

                <v-toolbar-title>Purchase Exam</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <div>
                <p class='pt-5 pl-5'>We offer a <strong>100% satisfaction guarantee.</strong> Subscriptions can be cancelled by the end of the billing cycle.</p>
                <template v-for="product in prices">
                    <div :key="product.pid">
                        <a v-if="product.active" @click="selectt(product.Price.pid, product.name, product.Price.amount)" class="list-group-item list-group-item-action">
                            <v-list-item class="table-hover" style="height:80px">
                                <v-hover>
                                    <v-list-item-content>
                                        <v-list-item-title>{{product.name}} Subscription</v-list-item-title>

                                        <v-list-item-title v-if=" product.Price !==null"> ${{product.Price.amount}}&nbsp;&nbsp;
                                            <div style="display:inline-block" v-if="product.name==='Monthly' || product.name==='Yearly' ||product.name==='Quaterly'">
                                                <span v-if="product.name==='Monthly'">per month</span>
                                                <span v-if="product.name==='Yearly'">per year</span>
                                                <span v-if="product.name==='Quaterly'">per quarter</span>
                                            </div>
                                            <div style="display:inline-block" v-else>
                                                <span>per VCE file</span>
                                            </div>
                                        </v-list-item-title>
                                        <v-list-item-subtitle>One-time payment for this exam.Unlimited free retries forever.
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-hover>
                                <v-list-item-action>

                                    <v-list-item-action-text>
                                        <v-icon>mdi-cart-outline</v-icon>
                                    </v-list-item-action-text>

                                </v-list-item-action>

                            </v-list-item>
                        </a>
                    </div>
                </template>
            </div>

        </v-card>
        <v-toolbar>

            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn text @click="dialog = false">
                    CANCEL
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </v-dialog>
</v-row>
</template>

<script>
import axios from 'axios'
export default {
    props: {
        prices: Array,
        open: Boolean
    },
    data() {
        return {
            dialog: false,

            items: [{
                title: 'Delete',
            }, ],
        }

    },
    created() {
        this.dialog = true
        console.log("i am sub screated")

    },
    methods: {
        selectt(product_id, product_name, product_price) {
            // this.$emit("message", "child component mounted (emitted)");
            this.$emit("selectt", product_id, product_name, product_price);
            // this.$parent.test3()
            // this.$parent.select(product_id, product_name, product_price)
        },
    }
}
</script>

<style scoped>
.borderless {
    border-top: 0 none;
    border: none;

}
</style>
