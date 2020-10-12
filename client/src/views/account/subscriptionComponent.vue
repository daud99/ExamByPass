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
      firstname: '',
      lastname: '',
      uuid: '',
      email: '',
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