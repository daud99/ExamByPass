<template>
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

                    <v-textarea :error-messages="messageErrors" v-model="message" :counter="200" label="Message" outlined shaped @input="$v.message.$touch()" @blur="$v.message.$touch()" required></v-textarea>

                    <v-btn class="mr-4">
                        Submit
                    </v-btn>

                </v-form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import card from '../../components/Card'
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
            maxLength: maxLength(20),
            minLength: minLength(1)
        },
        email: {
            required,
            email
        }
    },
    data: () => ({
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

    },
    created() {
        this.firstname = this["auth/getUser"].firstName;
        this.lastname = this["auth/getUser"].lastName;
        this.email = this["auth/getUser"].email;
    },
    methods: {
        submit() {
            console.log(this.firstname)
            console.log(this.lastname)
            console.log(this.email)
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
