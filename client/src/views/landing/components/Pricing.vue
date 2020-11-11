<template>
<core-content :loading="loading">
    <div id="pricingSection" v-if="toRender">
        <div class="py-5 bg-secondary">
            <div class="container shape-container d-flex align-items-center">
                <div class="col px-0">
                    <v-layout justify-center>
                        <h5 style="text-weight: bolder">PRICING</h5>

                    </v-layout>
                    <div class="row">
                        <div class="col col-lg-4 col-md-4 col-xs-12" v-for="product in prices" :key="product.pid">

                            <v-card v-if="product.active" class="mx-auto rounded-lg" max-width="344" color="LightGray" elevation="6">
                                <v-card-text>
                                    <v-layout justify-center>
                                        <h5 style="text-weight: bolder">{{product.name}} Subscription</h5>
                                    </v-layout>
                                    <v-layout justify-center>
                                        <h5 style="text-weight: bolder" v-if="toRender && product.Price !==null">{{product.Price.amount}}&nbsp;&nbsp;</h5>
                                        <p>per VCE File</p>
                                    </v-layout>
                                    <v-layout justify-center>
                                        <p>One-time payment for this exam</p>
                                    </v-layout>
                                    <v-layout justify-center>
                                        <p>Unlimited free retries forever.</p>
                                    </v-layout>
                                    <!-- <stripe-checkout
                    ref="sessionRef"
                    :pk="publishableKey"
                    :session-id="sessionId"
                  >
                    <template slot="checkout-button"> -->
                                    <v-btn @click="select(product.Price.pid, product.name, product.Price.amount)" color="#42b883" large dark>Select</v-btn>
                                    <!-- </template>
                  </stripe-checkout>                   -->
                                </v-card-text>
                            </v-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <login-signup-dialog :visible="showDialog" @close="showDialog=false" />
    <payment-dialog :visible="showPaymentDialog" :name="productName" :id="productId" :amount="productPrice" :publickey="publishableKey" @close="showPaymentDialog=false" />
</core-content>
</template>

<script>
import card from "../../../components/Card";
import ComponentOne from "./component1";
import ComponentTwo from "./component2";
import Swal from "sweetalert2";
import PageMixin from "../../page-mixin";
import {
    StripeCheckout,
    StripeElements
} from 'vue-stripe-checkout';
import {
    quickRequest
} from "../../../../common/misc";
import {
    mapGetters
} from 'vuex';
import LoginSignupDialog from "./FirstPageComponents/login_signup_dialog";
import PaymentDialog from "./FirstPageComponents/payment_dialog";

export default {
    mixins: [PageMixin],
    components: {
        card,
        ComponentOne,
        ComponentTwo,
        StripeCheckout,
        LoginSignupDialog,
        StripeElements,
        PaymentDialog
    },

    data() {
        return {
            publishableKey: '',
            sessionId: '',
            showDialog: false,
            showPaymentDialog: false,
            token: null,
            prices: [],
            productId: '',
            productName: '',
            productPrice: null,
            toRender: false
        }
    },
    beforeDestroy: function () {
        document.getElementById("preloader-block").style.display = "none";
    },
    computed: {
        ...mapGetters(["auth/isAuthenticated"]),
    },
    async created() {
        let response = await quickRequest("/get-prices", "POST", {});

        if (response.prices) {

            this.prices = JSON.parse(JSON.stringify(response)).prices;

            this.publishableKey = JSON.parse(JSON.stringify(response)).key;
            this.toRender = true

        } else if (response.error) {
            Swal.fire({
                type: "error",
                title: response.error
            });
        }
    },
    methods: {
        async subscribe(subscription_type) {
            try {
                if (this["auth/isAuthenticated"]) {
                    let data = {
                        type: subscription_type
                    };
                    this.loading = true;
                    let response = await quickRequest("/create-checkout-session", "POST", data);
                    if (response.id && response.key) {
                        this.sessionId = response.id;
                        this.publishableKey = response.key;
                        this.$refs.sessionRef.redirectToCheckout();
                    } else {
                        Swal.fire({
                            type: "error",
                            title: "Subscription failed!",
                            text: "Could not subscribe through the server.",
                        });
                    }
                } else {
                    localStorage.setItem("redirectToPricing", true);
                    this.showDialog = true;
                }
            } catch (e) {
                Swal.fire({
                    type: "error",
                    title: "Error Fetching Information",
                    text: "Could not subscribe through the server.",
                });
            } finally {
                this.loading = false;
                // this.$router.push("dashboard");
            }

        },
        async select(product_id, product_name, product_price) {
            console.log(product_id, product_name, product_price)
            this.productId = product_id;
            this.productName = product_name;
            this.productPrice = product_price;
            try {
                if (this["auth/isAuthenticated"]) {
                    this.showPaymentDialog = true;
                } else {
                    localStorage.setItem("redirectToPricing", true);
                    this.showDialog = true;
                }
            } catch (e) {
                console.log(e);
                Swal.fire({
                    type: "error",
                    title: "Error Fetching Information",
                    text: "Could not subscribe through the server.",
                });
            } finally {
                this.loading = false;
                // this.$router.push("dashboard");
            }

        }
    }
};
</script>

<style scoped>
.bg-primary {
    color: white;
}
</style>
