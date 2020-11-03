<template>
<core-content :loading="loading">
  <div class="py-5" id="accountComponentSection">
    <v-card flat :style="{paddingLeft:'3%',paddingRight:'3%'}">
        <v-card-text>
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
                required
            ></v-text-field>
            <v-switch
              v-model="verifyChec"
              label="Is Email Verified (To verify turn on it)"
              color="success"
              value="success"
              hide-details
            ></v-switch><br>
            <v-text-field
                :error-messages="rolesErrors"
                v-model="roles"
                :counter="20"
                label="Roles"
                outlined
                shaped
                @input="$v.roles.$touch()"
                @blur="$v.roles.$touch()"
                required
            ></v-text-field>
            <v-text-field
                v-model="phone"
                label="Phone"
                outlined
                shaped
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

        </v-form>
        </v-card-text>
    </v-card>
  </div>
  </core-content>
</template>

<script>
import card from '../../components/Card'
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength, email } from 'vuelidate/lib/validators'
import { quickRequest } from "../../../common/misc";
import Swal from "sweetalert2";

export default {
  mixins: [validationMixin],
  validations: {
    firstname: { required, maxLength: maxLength(20), minLength: minLength(1) },
    lastname: { required, maxLength: maxLength(20),minLength: minLength(1) },

    roles: { required, maxLength: maxLength(20), minLength: minLength(1) },
    phone: { required, maxLength: maxLength(40)},
    email: { required, email }
  },
  data: () => ({
    loading:false,

    firstname: '',
    lastname: '',
    email: '',
    roles:'',
    phone:'0',
    emailVerified:Boolean,

    verifyChec:'fail',
    canShow:false
    }),
  components: {
    card
  },
  computed: {
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
    rolesErrors () {
        const errors = []
        if (!this.$v.roles.$dirty) return errors
        !this.$v.roles.maxLength && errors.push('Role must be at most 20 characters long')
        !this.$v.roles.minLength && errors.push('Role must be at least 1 characters long')
        !this.$v.roles.required && errors.push('Role is required.')
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
    console.log(this.$route.params.id)
    this.getUser(this.$route.params.id)
  },
  beforeDestroy: function(){
        document.getElementById("preloader-block").style.display = "none";
    },
  methods: {
    async getUser(id) {
      try {
        let response = await quickRequest("/getSingleUser", "GET",{},id);
        if ("error" in response) {
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Error",
            text: response.error,
          });
        }else {
            console.log(response)
            this.firstname= response.user.firstName
            this.lastname= response.user.lastName
            this.email= response.user.email
            this.roles=response.user.roles
            if(response.user.phoneNumber){
                this.phone=response.user.phoneNumber
            }
            this.emailVerified=response.user.emailVerified
        }
      } catch (e) {
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Error occured",
        });
      }
    },
    async submit () {
        console.log(this.firstname)
        console.log(this.lastname)
        console.log(this.email)
        console.log(this.roles)
        console.log(this.verifyChec)
        if(this.verifyChec=="success"){
            this.emailVerified=true
        }else if(this.verifyChec=='fail'){
            this.emailVerified=false
        }
        console.log(this.emailVerified)
        console.log(this.phone)
        try {
        const data = {
          firstName: this.firstname,
          lastName: this.lastname,
          email: this.email,
          roles: this.roles,
          phoneNumber: this.phoneNumber,
          emailVerified: this.emailVerified
        };
        this.loading = true;
        let response = await quickRequest("/auth/update-user-byAdmin", "POST", data);
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
          this.loading = false;
          this.$router.push("/users");
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