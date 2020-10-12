<template>
  <stripe-checkout
    ref="sessionRef"
    :pk="publishableKey"
    :session-id="sessionId"
  >
    <template slot="checkout-button">
      <v-btn 
        @click="$refs.sessionRef.redirectToCheckout()"
        color="#42b883"
        large
        dark
      >Subscribe</v-btn>
    </template>
  </stripe-checkout>
</template>
 
<script>
import { StripeCheckout } from 'vue-stripe-checkout';
import { quickRequest } from "../../../common/misc";

export default {
  name: "stripe",
  components: {
    StripeCheckout
  },
  data: () => ({
    loading: false,
    publishableKey: "pk_test_51HadhZJa5xATEu66jbChzBu8KqvOqh7mwDXzj1BU28chuoKxtVRf3HV323E7OogpVXtFQkX5vvGHQnttxmdX1toB00ehhIa8zB",
    items: [
      {
        sku: 'sku_FdQKocNoVzznpJ', 
        quantity: 1
      }
    ],
    sessionId: '',
    successUrl: '/success',
    cancelUrl: '/cancel',
  }),
  async mounted() {
     let response = await quickRequest("/create-checkout-session", "POST", {});
     console.log("response");
     console.log(response);
     this.sessionId = response.id;
     console.log(this.sessionId);
  },
  methods: {
    checkout () {
      this.$refs.checkoutRef.redirectToCheckout();
    }
  }
}
</script> 