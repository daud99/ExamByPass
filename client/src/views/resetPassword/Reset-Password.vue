<template>
<core-content :loading="loading">
  <section
    class="section section-shaped section-lg my-0"
    :style="{
      backgroundImage: `url(${'https://www.ecronicon.com/promotions/images/abg3.jpg'})`,
    }"
  >
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
          <card
            type="secondary"
            shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0"
          >
            <template>
              <div class="text-center text-muted mb-4">
                <small>Reset your password</small>
              </div>
              <form role="form">
                <base-input
                  alternative
                  type="password"
                  v-model="password"
                  :valid="$v.password.required && $v.password.minLen"
                  @blur="$v.password.$touch()"
                  error="Password lenght must be greater than 3"
                  placeholder="Password"
                  addon-left-icon="ni ni-lock-circle-open"
                >
                </base-input>
                <base-input
                  alternative
                  type="password"
                  v-model="confirmPassword"
                  :valid="$v.confirmPassword.sameAs"
                  @blur="$v.confirmPassword.$touch()"
                  placeholder="Confirm Password"
                  error="Both password's do not match"
                  addon-left-icon="ni ni-lock-circle-open"
                >
                </base-input>
             
                <div class="text-center">
                  <base-button
                    type="primary"
                    class="my-4"
                    :disabled="$v.$invalid"
                    @click="resetPassword"
                    >Reset Password</base-button
                  >
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
  </section>
</core-content>
</template>
<script>
import { required, minLength, sameAs } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
import { quickRequest } from "../../../common/misc";
import PageMixin from "../page-mixin";

export default {
  name: "reset-password",
  mixins: [PageMixin],
  data() {
    return {
      password: "",
      confirmPassword: "",
      token: this.$route.query.token
    };
  },
  validations: {
    password: {
      required,
      minLen: minLength(4),
    },
    confirmPassword: {
      required,
      sameAs: sameAs("password"),
    },
  },
  beforeDestroy: function(){
    document.getElementById("preloader-block").style.display = "none";
  },
  methods: {
    async resetPassword() {
      this.loading = true;
      try {
        const data = {
          password: this.password,
          token: this.token
        };
        let response = await quickRequest("/auth/update-password", "POST", data);
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
            title: "Password Reset",
            text: response.msg
          });
          this.$router.push("login");
        }
      } catch (e) {
        
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Could not update password through the server.",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style>
</style>
