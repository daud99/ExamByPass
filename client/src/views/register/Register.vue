<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-gradient-default">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container pt-lg-md">
            <div class="row justify-content-center">
                <div class="col-lg-5">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0">
                        <template>
                            <div class="text-muted text-center mb-3">
                                <small>Sign in with</small>
                            </div>
                            <div class="btn-wrapper text-center">
                                <base-button type="neutral">
                                    <img slot="icon" src="img/icons/common/github.svg">
                                    Github
                                </base-button>

                                <base-button type="neutral">
                                    <img slot="icon" src="img/icons/common/google.svg">
                                    Google
                                </base-button>
                            </div>
                        </template>
                        <template>
                            <div class="text-center text-muted mb-4">
                                <small>Or sign up with credentials</small>
                            </div>
                            <form role="form">
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="First Name" v-model="firstName" :valid="$v.firstName.required" @blur="$v.firstName.$touch()" error="Enter a valid First Name"
                                            addon-left-icon="ni ni-hat-3">
                                </base-input>
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Last Name" v-model="lastName" :valid="$v.lastName.required" @blur="$v.lastName.$touch()" addon-left-icon="ni ni-hat-3" error="Enter a valid Last Name">
                                </base-input>
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Email"
                                            addon-left-icon="ni ni-email-83" v-model="email" :valid="$v.email.email && $v.email.required" @blur="$v.email.$touch()" error="Enter a valid email address">
                                    
                                </base-input>
                                <base-input alternative
                                            type="password" v-model="password" :valid="$v.password.required && $v.password.minLen" @blur="$v.password.$touch()" error="Password lenght must be greater than 3"
                                            placeholder="Password"
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
                                <!-- <div class="text-muted font-italic">
                                    <small>password strength:
                                        <span class="text-success font-weight-700">strong</span>
                                    </small>
                                </div> -->
                                 <base-input alternative
                                            type="password" v-model="confirmPassword" :valid="$v.confirmPassword.sameAs" @blur="$v.confirmPassword.$touch()"
                                            placeholder="Confirm Password" error="Both password's do not match"
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
                                <!-- <base-checkbox>
                                    <span>I agree with the
                                        <a href="#">Privacy Policy</a>
                                    </span>
                                </base-checkbox> -->
                                <div class="text-center">
                                    <base-button type="primary" class="my-4" :disabled="$v.$invalid" @click="saveUser">Create account</base-button>
                                </div>
                            </form>
                        </template>
                    </card>
                    <div class="row mt-3">
                        <div 
                          class="col-12 text-center text-light pointer"
                          @click="() => { this.$router.push({ name: 'login' }) }"
                        >
                          <small>Already have an account?</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>

import {required, email, minLength, sameAs} from 'vuelidate/lib/validators'
import Swal from "sweetalert2";
import {quickRequest} from "../../../common/misc"

export default {
    name: "register",
    data() {
        return {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        }
    },
    validations: {
        email: {
            required,
            email
        },
        firstName: {
            required
        },
        lastName: {
            required
        },
        password: {
            required,
            minLen: minLength(4) 
        },
        confirmPassword: {
            required,
            sameAs: sameAs('password')
        }
    },
    methods: {
        async saveUser () {
             try {
                const user = {
                    email: this.email,
                    password: this.password,
                    firstName: this.firstName,
                    lastName: this.lastName
                };
                let response = await quickRequest("/api/auth/save-user", "POST", user);
                if("error" in response) {
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Error",
                        text: response.error
                    })
                } 
                else if(response.msg){
                    this.$router.push("login");
                }
            } 
            catch(e) {
                // console.log("error below");
                // console.log(e);
                Swal.fire({
                    type: "error",
                    title: "Error Fetching Information",
                    text: "Could not save user through the server."
                });
            }
        }
    }
};
</script>
<style>
</style>
