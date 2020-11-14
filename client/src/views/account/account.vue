<template>
  <div class="py-5" id="accountTabSection" :style="{marginTop:'100px'}">
    <div class="container shape-container d-flex align-items-center">
      <div class="col px-0">
        <div class="row">
          <div class="col offset-lg-1 offset-md-1 col-lg-10 col-md-10 col-xs-12">
            <v-card class="mx-auto rounded-lg" max-width="100%" color="LightGray" >
                <v-tabs v-model="tab" align-with-title fixed-tabs next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                    <v-tabs-slider color="yellow"></v-tabs-slider>
                    <v-tab key="Account" ><v-icon large color="indigo darken-2">mdi-account-child-circle</v-icon>Account</v-tab>
                    <v-tab key="Subscriptions" v-if="(_self['auth/getUser'].roles!='admin')"><v-icon large color="indigo darken-2">mdi-playlist-check</v-icon>Subscriptions</v-tab>
                    <v-tab key="Payments" v-if="(_self['auth/getUser'].roles!='admin')"><v-icon large color="indigo darken-2">mdi-credit-card-settings-outline</v-icon>Payments and Invoices</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item key="Account">
                        <AccountComponent/>
                    </v-tab-item>
                    <v-tab-item v-if="(_self['auth/getUser'].roles!='admin')" key="Subscriptions">
                        <SubscriptionComponent/>
                    </v-tab-item>
                    <v-tab-item v-if="(_self['auth/getUser'].roles!='admin')" key="Payments">
                        <PaymentComponent/>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>
          </div>          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from '../../components/Card';
import AccountComponent from './accountComponent';
import SubscriptionComponent from './subscriptionComponent';
import PaymentComponent from './paymentComponent';
import {mapActions, mapGetters} from 'vuex';
import {quickRequest} from "../../../common/misc";

export default {
  data () {
      return {
        tab: null,
    }
  },
   async created() {
    await this.getCurrentSubscriptionStatus();
  },
   beforeDestroy: function(){
    document.getElementById("preloader-block").style.display = "none";
  },
  components: {
    card,
    AccountComponent,
    SubscriptionComponent,
    PaymentComponent
  },
  computed: {
    ...mapGetters([
      'auth/getUser'
    ]),
    ...mapGetters(["auth/isAuthenticated"]),
    
  },
  methods: {
     ...mapActions([
      'auth/setUser'
    ]),
    async getCurrentSubscriptionStatus() {
      try {
        let res = await quickRequest("/subscription-management/get-subscription-status", "POST", {});
        let response = this['auth/getUser'];
        localStorage.setItem("subscription_status", res.subscription_status); 
        response.subscription_status = res.subscription_status;
        this['auth/setUser'](response);
      } 
      catch(e) {
        console.log("error");
        console.log(e);
      }
    }
  }
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>