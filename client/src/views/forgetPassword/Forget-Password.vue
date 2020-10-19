<template>
  <core-content :loading="loading">
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
            <div class="row justify-content-center" style="min-height: 400px">
                <div class="col-lg-5">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0"
                        >
                        <template>
                            <div class="text-center text-muted mb-4">
                                <small>Enter your email address</small>
                            </div>
                              <base-input alternative
                                          class="mb-3" v-model="email"
                                          :valid="$v.email.email && $v.email.required"
                                          @blur="$v.email.$touch()"
                                          error="Enter a valid email address"
                                          placeholder="Email"
                                          addon-left-icon="ni ni-email-83">
                              </base-input>
                              <div class="text-center">
                                  <base-button type="primary" 
                                   :disabled="$v.$invalid"
                                    @click="sendRecoveryEmail"
                                  class="my-4">Request recovery email</base-button>
                              </div>
                        </template>
                    </card>
                    <div class="row mt-3">
                        <div 
                          class="col-12 text-center text-light pointer"
                          @click="() => { this.$router.push({ name: 'register' }) }"
                        >
                          <small>Create new account</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </core-content>
</template>
<script>
import { required, email } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
import { quickRequest } from "../../../common/misc";
import PageMixin from "../page-mixin";

export default {
    name: "forget",
    mixins: [PageMixin],
    data() {
        return {
            email: ""
        }
    },
    validations: {
        email: {
        required,
        email,
        }
    },
    beforeDestroy: function(){
      document.getElementById("preloader-block").style.display = "none";
    },
    methods: {
    async sendRecoveryEmail() {
      this.loading = true;
      try {
        const data = {
          email: this.email
        };
        let response = await quickRequest("/auth/recover-password", "POST", data);
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
            title: "Email sent!",
            text: response.msg,
          });
          this.$router.push("login");
        }
      } catch (e) {
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Could not save user through the server.",
        });
      } finally {
        this.loading = false;
      }
    } 
    }
};
</script>
<style>
</style>
