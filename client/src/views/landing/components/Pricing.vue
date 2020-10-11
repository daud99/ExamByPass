<template>
  <core-content :loading="loading">
    <div id="pricingSection">
    <div class="py-5 bg-secondary">
      <div class="container shape-container d-flex align-items-center">
        <div class="col px-0">
          <v-layout justify-center>
            <h5 style="text-weight: bolder">PRICING</h5>
          </v-layout>
          <div class="row">
            <div class="col col-lg-4 col-md-4 col-xs-12">
              <v-card
                class="mx-auto rounded-lg"
                max-width="344"
                color="LightGray"
                elevation="6"
              >
                <v-card-text>
                  <v-layout justify-center>
                    <h5 style="text-weight: bolder">Monthly Subscription</h5>
                  </v-layout>
                  <v-layout justify-center>
                    <h5 style="text-weight: bolder">$9.99&nbsp;&nbsp;</h5>
                    <p>per VCE File</p>
                  </v-layout>
                  <v-layout justify-center>
                    <p>One-time payment for this exam</p>
                  </v-layout>
                  <v-layout justify-center>
                    <p>Unlimited free retries forever.</p>
                  </v-layout>
                  <stripe-checkout
                    ref="sessionRef"
                    :pk="publishableKey"
                    :session-id="sessionId"
                  >
                    <template slot="checkout-button">
                      <v-btn 
                        @click="subscribe('STRIPE_MONTH_PRICE_ID')"
                        color="#42b883"
                        large
                        dark
                      >Subscribe</v-btn>
                    </template>
                  </stripe-checkout>
                </v-card-text>
              </v-card>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-12">
              <v-card
                class="mx-auto rounded-lg"
                max-width="344"
                color="LightGray"
                elevation="6"
              >
                <v-card-text>
                  <v-layout justify-center>
                    <h5 style="text-weight: bolder">Quaterly Subscription</h5>
                  </v-layout>
                  <v-layout justify-center>
                    <h5 style="text-weight: bolder">$19.99&nbsp;&nbsp;</h5>
                    <p>per VCE File</p>
                  </v-layout>
                  <v-layout justify-center>
                    <p>One-time payment for this exam</p>
                  </v-layout>
                  <v-layout justify-center>
                    <p>Unlimited free retries forever.</p>
                  </v-layout>
                  <stripe-checkout
                    ref="sessionRef"
                    :pk="publishableKey"
                    :session-id="sessionId"
                  >
                    <template slot="checkout-button">
                      <v-btn 
                        @click="subscribe('STRIPE_QUATER_PRICE_ID')"
                        color="#42b883"
                        large
                        dark
                      >Subscribe</v-btn>
                    </template>
                  </stripe-checkout>                  
                </v-card-text>
              </v-card>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-12">
              <v-card
                class="mx-auto rounded-lg"
                max-width="344"
                color="LightGray"
                elevation="6"
              >
                <v-card-text>
                  <v-layout justify-center>
                    <h5 style="text-weight: bolder">Annual Subscription</h5>
                  </v-layout>
                  <v-layout justify-center>
                    <h5 style="text-weight: bolder">$182.00&nbsp;&nbsp;</h5>
                    <p>per VCE File</p>
                  </v-layout>
                  <v-layout justify-center>
                    <p>One-time payment for this exam</p>
                  </v-layout>
                  <v-layout justify-center>
                    <p>Unlimited free retries forever.</p>
                  </v-layout>
                  <stripe-checkout
                    ref="sessionRef"
                    :pk="publishableKey"
                    :session-id="sessionId"
                  >
                    <template slot="checkout-button">
                      <v-btn 
                        @click="subscribe('STRIPE_YEAR_PRICE_ID')"
                        color="#42b883"
                        large
                        dark
                      >Subscribe</v-btn>
                    </template>
                  </stripe-checkout>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </core-content>
  
</template>

<script>
import card from "../../../components/Card";
import ComponentOne from "./component1";
import ComponentTwo from "./component2";
import Swal from "sweetalert2";
import PageMixin from "../../page-mixin";
import { StripeCheckout } from 'vue-stripe-checkout';
import { quickRequest } from "../../../../common/misc";


export default {
  mixins: [PageMixin],
  components: {
    card,
    ComponentOne,
    ComponentTwo,
    StripeCheckout
  },
  data()  {
    return {
      publishableKey: '',
      sessionId: ''
    }
  },
  methods: {
    async subscribe(subscription_type) {
      try {
         let data = {
        type: subscription_type
      };
      this.loading = true;
       let response = await quickRequest("/create-checkout-session", "POST", data);
       if(response.id && response.key) {
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
     
    }
  }
};
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>