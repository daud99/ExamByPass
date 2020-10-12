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
              <div class="text-muted text-center mb-3">
                <small>Sign in with</small>
              </div>
              <div class="btn-wrapper text-center">
                <!-- <base-button type="neutral">
                  <img slot="icon" src="img/icons/common/github.svg" />
                  <a href="http://localhost:3000/login/github">Github</a>
                </base-button> -->

                <base-button type="neutral">
                  <img slot="icon" src="img/icons/common/google.svg" />
                  <a href="http://localhost:3000/login/google">Google</a>
                </base-button>

                 <base-button type="neutral">
                  <img slot="icon" src="img/icons/common/facebook.png" class="fb-icon"/>
                  <a href="http://localhost:3000/login/facebook">facebook</a>
                </base-button>
                
              </div>
            </template>
            <template>
              <div class="text-center text-muted mb-4">
                <small>Or sign in with credentials</small>
              </div>
              <form role="form">
                <base-input
                  alternative
                  class="mb-3"
                  placeholder="Email"
                  addon-left-icon="ni ni-email-83"
                  v-model="email"
                  :valid="$v.email.email && $v.email.required"
                  @blur="$v.email.$touch()"
                  error="Enter a valid email address"
                >
                </base-input>
                <base-input
                  alternative
                  type="password"
                  v-model="password"
                  :valid="$v.password.required && $v.password.minLen"
                  @blur="$v.password.$touch()"
                  error="Enter a valid password"
                  placeholder="Password"
                  addon-left-icon="ni ni-lock-circle-open"
                >
                </base-input>
                <base-checkbox> Remember me </base-checkbox>
                <div class="text-center">
                  <base-button
                    type="primary"
                    class="my-4"
                    :disabled="$v.$invalid"
                    @click="tryLogin"
                    >Sign In</base-button
                  >
                </div>
              </form>
            </template>
          </card>
          <div class="row mt-3">
            <div
              class="col-6 text-light pointer"
              @click="
                () => {
                  this.$router.push({ name: 'forget' });
                }
              "
            >
              <small>Forgot password?</small>
            </div>
            <div
              class="col-6 text-right text-light pointer"
              @click="
                () => {
                  this.$router.push({ name: 'register' });
                }
              "
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
<style scoped>
</style>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
import { quickRequest } from "../../../common/misc";
import { mapActions, mapGetters } from "vuex";
import PageMixin from "../page-mixin";


export default {
  name: "login",
  mixins: [PageMixin],
  data() {
    return {
      email: "",
      password: "",
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLen: minLength(4),
    },
  },
  beforeDestroy: function(){
    document.getElementById("preloader-block").style.display = "none";
  },
  computed: {
    ...mapGetters(["auth/getUser"]),
  },
  methods: {
    ...mapActions(["auth/setUser"]),
    async tryLogin() {
      try {
        const login = {
          email: this.email,
          password: this.password,
        };
        this.loading = true;
        let response = await quickRequest("/auth/log-in", "POST", login);
        if ("error" in response) {
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Error",
            text: response.error,
          });
        } else if (response.user) {
          localStorage.setItem("email", response.user.email);
          localStorage.setItem("firstName", response.user.firstName);
          localStorage.setItem("lastName", response.user.lastName);
          localStorage.setItem("id", response.user.id);
          localStorage.setItem("roles", response.user.roles);
          localStorage.setItem("uuid", response.user.uuid);
          localStorage.setItem("subscription_status", response.user.subscription_status); 
          localStorage.setItem("auth_type", response.user.auth_type); 
          this["auth/setUser"](response.user);
        }
      } catch (e) {
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Could not save user through the server.",
        });
      } finally {
        this.loading = false;
        this.$router.push("dashboard");
      }
    },
  },
};
</script>
<style>
.fb-icon {
  color: blue;
}
</style>
