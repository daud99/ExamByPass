<template>
<core-content :loading="loading">
<div class="py-5" id="aboutSection" :style="{marginTop:'100px'}">
    <div class="container-fluid">
        <div class="row">
            <div class="col offset-lg-2 offset-md-2 col-lg-7 col-md-7 col-xs-12">
                <h4>Contact Us</h4><br><br>
                <v-form lazy-validation>
                    <v-text-field v-model="firstname" :error-messages="firstnameErrors" :counter="20" label="First Name" outlined shaped @input="$v.firstname.$touch()" @blur="$v.firstname.$touch()" required></v-text-field>
                    <v-text-field :error-messages="lastnameErrors" v-model="lastname" :counter="20" label="Last Name" outlined shaped @input="$v.lastname.$touch()" @blur="$v.lastname.$touch()" required></v-text-field>

                    <v-text-field :error-messages="emailErrors" v-model="email" label="E-mail" outlined shaped @input="$v.email.$touch()" @blur="$v.email.$touch()" required></v-text-field>

                    <v-text-field :error-messages="problemTypeErrors" v-model="problemType" :counter="20" label="Problem Type" outlined shaped @input="$v.problemType.$touch()" @blur="$v.problemType.$touch()" required></v-text-field>

                    <v-textarea :error-messages="messageErrors" v-model="message" :counter="2000" label="Message" outlined shaped @input="$v.message.$touch()" @blur="$v.message.$touch()" required></v-textarea>

                    <v-btn class="mr-4" :disabled="$v.$invalid" @click="submitContactUs">
                        Submit
                    </v-btn>

                </v-form>
            </div>
        </div>
    </div>
</div>
</core-content>
</template>

<script>
import card from '../../components/Card'
import Swal from "sweetalert2";
import { quickRequest } from "../../../common/misc.js";
import {
    mapActions,
    mapGetters
} from 'vuex';
import {
    validationMixin
} from 'vuelidate'
import {
    required,
    maxLength,
    minLength,
    email
} from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],
    validations: {
        firstname: {
            required,
            maxLength: maxLength(20),
            minLength: minLength(1)
        },
        lastname: {
            required,
            maxLength: maxLength(20),
            minLength: minLength(1)
        },
        problemType: {
            required,
            maxLength: maxLength(20),
            minLength: minLength(1)
        },
        message: {
            required,
            maxLength: maxLength(2000),
            minLength: minLength(1)
        },
        email: {
            required,
            email
        }
    },
    data: () => ({
        loading:false,
        firstname: '',
        lastname: '',
        email: '',
        problemType: '',
        message: ''
    }),
    components: {
        card
    },
    computed: {
        ...mapGetters(["auth/getUser"]),
        ...mapGetters(["auth/isAuthenticated"]),
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
    problemTypeErrors () {
        const errors = []
        if (!this.$v.problemType.$dirty) return errors
        !this.$v.problemType.maxLength && errors.push('Problem Type must be at most 20 characters long')
        !this.$v.problemType.minLength && errors.push('Problem Type must be at least 1 characters long')
        !this.$v.problemType.required && errors.push('Problem Type is required.')
        return errors
    },
    messageErrors () {
        const errors = []
        if (!this.$v.message.$dirty) return errors
        !this.$v.message.maxLength && errors.push('Message must be at most 2000 characters long')
        !this.$v.message.minLength && errors.push('Message must be at least 1 characters long')
        !this.$v.message.required && errors.push('Message is required.')
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
        if(this["auth/isAuthenticated"]){
            this.firstname = this["auth/getUser"].firstName;
            this.lastname = this["auth/getUser"].lastName;
            this.email = this["auth/getUser"].email;
        }else{
            this.firstname = '';
            this.lastname = '';
            this.email = '';
        }
        
    },
    beforeDestroy: function(){
        document.getElementById("preloader-block").style.display = "none";
    },
    methods: {
        async submitContactUs() {
            console.log(this.firstname)
            console.log(this.lastname)
            console.log(this.email)
            console.log(this.problemType)
            console.log(this.message)
            try {
                const data = {
                firstName: this.firstname,
                lastName: this.lastname,
                email: this.email,
                problemType: this.problemType,
                message: this.message
                };
                this.loading = true;
                let response = await quickRequest("/contactUs", "POST", data);
                console.log(response)
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
                this["auth/isAuthenticated"]? this.$router.push("dashboard"): this.$router.push("/");
                }
            } catch (e) {
                console.log(e)
                Swal.fire({
                type: "error",
                title: "Error Fetching Information",
                text: "Could not update through the server.",
                });
            } finally {
                this.loading = false;
            }
        },
        clear() {
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
