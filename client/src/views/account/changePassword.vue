<template>
  <core-content :loading="loading">
    <div class="py-5" id="changePasswordSection" :style="{marginTop:'100px'}">
      <div class="container shape-container d-flex align-items-center">
        <div class="col px-0">
          <div class="row">
            <div class="col offset-lg-1 offset-md-1 col-lg-10 col-md-10 col-xs-12">
              <v-card class="mx-auto rounded-lg" max-width="100%" color="LightGray" >
                  <v-card-text>
                  <h4>PASSWORD RESET</h4><br><br>
                  <v-form lazy-validation>
                      

                      <v-text-field
                          :error-messages="emailErrors"
                          v-model="email"
                          label="E-mail"
                          outlined
                          shaped
                          @input="$v.email.$touch()"
                          @blur="$v.email.$touch()"
                          required
                      ></v-text-field>

                      <v-text-field
                          v-model="oldpassword"

                          :error-messages="oldpasswordErrors"

                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show1 ? 'text' : 'password'"
                          @click:append="show1 = !show1"
                          name="input-10-1"
                          label="Old Password"
                          outlined
                          shaped
                          @input="$v.oldpassword.$touch()"
                          @blur="$v.oldpassword.$touch()"
                          required
                      ></v-text-field>

                      <v-text-field
                          v-model="newpassword"

                          :error-messages="newpasswordErrors"

                          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show2 ? 'text' : 'password'"
                          @click:append="show2 = !show2"
                          name="input-10-2"
                          label="New Password"
                          outlined
                          shaped
                          @input="$v.newpassword.$touch()"
                          @blur="$v.newpassword.$touch()"
                          required
                      ></v-text-field>

                      <v-text-field
                          v-model="confirmpassword"

                          :error-messages="confirmpasswordErrors"

                          :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show3 ? 'text' : 'password'"
                          @click:append="show3 = !show3"
                          name="input-10-3"
                          label="Confirm Password"
                          outlined
                          shaped
                          @input="$v.confirmpassword.$touch()"
                          @blur="$v.confirmpassword.$touch()"
                          required
                      ></v-text-field>
                      

                      <v-btn
                          class="mr-4"
                          @click="changePassword"
                          >
                          Change Password
                      </v-btn>
                      <v-btn class="mr-4" @click="clear">
                          Clear
                      </v-btn>


                  </v-form>
                  </v-card-text>
              </v-card>
          </div>
      </div>
      </div>
      </div>
    </div>
  </core-content>

</template>

<script>
import card from '../../components/Card';
import {mapActions, mapGetters} from 'vuex';
import Swal from "sweetalert2";
import { quickRequest } from "../../../common/misc";
import { validationMixin } from 'vuelidate';
import { required, maxLength, minLength, email } from 'vuelidate/lib/validators';
import PageMixin from "../page-mixin";


export default {
  name: "change-password",
  mixins: [validationMixin, PageMixin],
  validations: {
    oldpassword: { required, minLength: minLength(4) },
    newpassword: { required, minLength: minLength(4) },
    confirmpassword: { required, minLength: minLength(4) },
    email: { required, email }
  },
  data: () => ({
      show1: false,
      show2: false,
      show3: false,
      oldpassword:'',
      newpassword:'',
      confirmpassword:'',
      email: '',
    }),
  components: {
    card
  },
  computed: {
    ...mapGetters(["auth/getUser"]),
    oldpasswordErrors () {
        const errors = []
        if (!this.$v.oldpassword.$dirty) return errors
        !this.$v.oldpassword.minLength && errors.push('Password must be at least 4 characters long')
        !this.$v.oldpassword.required && errors.push('Password is required.')
        return errors
    },
    newpasswordErrors () {
        const errors = []
        if (!this.$v.oldpassword.$dirty) return errors
        this.newpassword!==this.confirmpassword && errors.push('Both Password didnot match')
        !this.$v.newpassword.minLength && errors.push('Password must be at least 4 characters long')
        !this.$v.newpassword.required && errors.push('Password is required.')
        return errors
    },
    confirmpasswordErrors () {
        const errors = []
        if (!this.$v.confirmpassword.$dirty) return errors
        this.newpassword!==this.confirmpassword && errors.push('Both Password didnot match')
        !this.$v.confirmpassword.minLength && errors.push('Password must be at least 4 characters long')
        !this.$v.confirmpassword.required && errors.push('Password is required.')
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
    this.email = this["auth/getUser"].email;
  },
  beforeDestroy: function(){
    document.getElementById("preloader-block").style.display = "none";
  },
  methods: {
    async changePassword() {
        console.log(this.oldpassword)
        console.log(this.newpassword)
        console.log(this.confirmpassword)
        console.log(this.email)
      try {
        const data = {
          old_password: this.oldpassword,
          password: this.newpassword,
          email: this.email
        };
        this.loading = true;
        let response = await quickRequest("/auth/change-password", "POST", data);
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
            title: "Password Changed Successfully!",
            text: response.msg,
          });
          this.loading = false;
          this.$router.push("dashboard");
        }
      } catch (e) {
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Could not change password through the server.",
        });
      } finally {
        this.loading = false;
      }
    },
    clear () {
        this.$v.$reset()
        this.oldpassword = ''
        this.newpassword = ''
        this.confirmpassword = ''
    },
  },
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>