<template>
<core-content :loading="loading">
  <div class="py-5" id="accountComponentSection">
    <v-card flat :style="{paddingLeft:'3%',paddingRight:'3%'}">
        <v-card-text>
        <h4>Welcome,&nbsp;{{_self["auth/getUser"].email}}!</h4><br><br>
        <v-form lazy-validation>
            <v-text-field
                v-model="firstname"
                :error-messages="firstnameErrors"
                :counter="20"
                label="First Name"
                outlined
                shaped
                @input="$v.firstname.$touch()"
                @blur="$v.firstname.$touch()"
                required
            ></v-text-field>
            <v-text-field
                :error-messages="lastnameErrors"
                v-model="lastname"
                :counter="20"
                label="Last Name"
                outlined
                shaped
                @input="$v.lastname.$touch()"
                @blur="$v.lastname.$touch()"
                required
            ></v-text-field>
            <v-text-field
                :error-messages="emailErrors"
                v-model="email"
                label="E-mail"
                outlined
                shaped
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
                required disabled
            ></v-text-field>
            <v-text-field
                v-model="uuid"
                outlined
                shaped
                label="User ID"
                disabled
            ></v-text-field>

            <v-btn
                class="mr-4"
                :disabled="$v.$invalid"
                @click="submit"
                >
                Submit
            </v-btn>
            <v-btn class="mr-4" @click="clear">
                Clear
            </v-btn>
            
            <router-link v-if="canShow" to="/ChangePassword">
            <v-btn class="mr-4" @click="clear">
                CHANGE PASSWORD
            </v-btn>
            </router-link>

        </v-form>
        </v-card-text>
    </v-card>
  </div>
  </core-content>
</template>

<script>
import card from '../../components/Card'
import {mapActions, mapGetters} from 'vuex';
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength, email } from 'vuelidate/lib/validators'
import { quickRequest } from "../../../common/misc";
import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {
    firstname: { required, maxLength: maxLength(20), minLength: minLength(1) },
    lastname: { required, maxLength: maxLength(20),minLength: minLength(1) },
    email: { required, email }
  },
  data: () => ({
    loading:false,
    firstname: '',
    lastname: '',
    uuid: '',
    email: '',
    canShow:false
    }),
  components: {
    card
  },
  computed: {
    ...mapGetters(["auth/getUser"]),
    firstnameErrors () {
        const errors = []
        if (!this.$v.firstname.$dirty) return errors
        !this.$v.firstname.maxLength && errors.push('First Name must be at most 20 characters long')
        !this.$v.firstname.minLength && errors.push('First Name must be at least 1 characters long')
        !this.$v.firstname.required && errors.push('First Name is required.')
        return errors
    },
    lastnameErrors () {
        const errors = []
        if (!this.$v.lastname.$dirty) return errors
        !this.$v.lastname.maxLength && errors.push('Last Name must be at most 20 characters long')
        !this.$v.lastname.minLength && errors.push('Last Name must be at least 1 characters long')
        !this.$v.lastname.required && errors.push('Last Name is required.')
        return errors
    },
    emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
    }
  },
  created() {
    if(this["auth/getUser"].auth_type =='LocalAuth'){
      this.canShow=true
    }else{
      this.canShow=false
    }
    this.firstname = this["auth/getUser"].firstName;
    this.lastname = this["auth/getUser"].lastName;
    this.email = this["auth/getUser"].email;
    this.uuid = this["auth/getUser"].uuid;
  },
  methods: {
    async submit () {
        console.log(this.firstname)
        console.log(this.lastname)
        console.log(this.email)
        try {
        const data = {
          firstName: this.firstname,
          lastName: this.lastname,
          email: this.email
        };
        this.loading = true;
        let response = await quickRequest("/auth/updateuser", "POST", data);
        if ("error" in response) {
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Error",
            text: response.error,
          });
        } else if (response.msg) {
          Swal.fire({
            type: "success",
            icon: "success",
            title: "Message",
            text: response.msg,
          });
          if(response.record){
            console.log(response.record)
          }
          this.loading = false;
          this.$router.push("dashboard");
        }
      } catch (e) {
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Could not update through the server.",
        });
      } finally {
        this.loading = false;
      }
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