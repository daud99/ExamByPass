<template>
  <div class="py-5" id="accountComponentSection">
    <v-card flat :style="{paddingLeft:'3%',paddingRight:'3%'}">
        <v-card-text>
            <h4>Welcome,&nbsp;{{_self["auth/getUser"].email}}!</h4><br><br>
            
        </v-card-text>
    </v-card>
  </div>
</template>

<script>
import card from '../../components/Card'
import {mapActions, mapGetters} from 'vuex';
import Swal from "sweetalert2";
import { quickRequest } from "../../../common/misc";
import PageMixin from "../page-mixin";

export default {
  data: () => ({
      subData:{
        created: '',
        current_period_end: '',
        current_period_start: '',
        quantity: '',

        data:[]
      },

      dataObj:{
        amount: '',
        currency: '',
        billing_scheme: '',
        interval: '',
        interval_count:'',
        usage_type:'',
        active:null
      }
      
    }),
  components: {
    card
  },
  computed: {
    ...mapGetters(["auth/getUser"])
  },
  async mounted() {
    try {
        // this.loading = true;
        let response = await quickRequest("/get-subscription", "POST", {});
        console.log(response)
        this.subData.created= response.subscription.created
        this.subData.current_period_end= response.subscription.current_period_end
        this.subData.current_period_start= response.subscription.current_period_start
        this.subData.quantity= response.subscription.quantity
        for(var index=0;index<response.subscription.items.data.length;index++){
          this.dataObj.amount= response.subscription.items.data[index].plan.amount
          this.dataObj.currency= response.subscription.items.data[index].plan.currency
          this.dataObj.billing_scheme= response.subscription.items.data[index].plan.billing_scheme
          this.dataObj.interval= response.subscription.items.data[index].plan.interval
          this.dataObj.interval_count=response.subscription.items.data[index].plan.interval_count
          this.dataObj.usage_type=response.subscription.items.data[index].plan.usage_type
          this.dataObj.active=response.subscription.items.data[index].price.active

          
        }
        
      } catch (e) {
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Could not fetch subscription through the server.",
        });
      } finally {
        // this.loading = false;
      }
  },
  created() {
    this.firstname = this["auth/getUser"].firstName;
    this.lastname = this["auth/getUser"].lastName;
    this.email = this["auth/getUser"].email;
    this.uuid = this["auth/getUser"].uuid;
  },
  methods: {
    submit () {
        console.log(this.firstname)
        console.log(this.lastname)
        console.log(this.email)
    },
    clear () {
        this.$v.$reset()
        this.firstname = ''
        this.lastname = ''
    },
  },
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>