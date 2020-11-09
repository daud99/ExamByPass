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
              <form role="form">
                <base-input
                  alternative
                  class="mb-3"
                  placeholder="First Name"
                  v-model="firstName"
                  :valid="$v.firstName.required"
                  @blur="$v.firstName.$touch()"
                  error="Enter a valid First Name"
                  addon-left-icon="ni ni-hat-3"
                >
                </base-input>
                <base-input
                  alternative
                  class="mb-3"
                  placeholder="Last Name"
                  v-model="lastName"
                  :valid="$v.lastName.required"
                  @blur="$v.lastName.$touch()"
                  addon-left-icon="ni ni-hat-3"
                  error="Enter a valid Last Name"
                >
                </base-input>
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
                  error="Password lenght must be greater than 3"
                  placeholder="Password"
                  addon-left-icon="ni ni-lock-circle-open"
                >
                </base-input>
                <!-- <div class="text-muted font-italic">
                                    <small>password strength:
                                        <span class="text-success font-weight-700">strong</span>
                                    </small>
                                </div> -->
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
                <!-- <base-checkbox>
                                    <span>I agree with the
                                        <a href="#">Privacy Policy</a>
                                    </span>
                                </base-checkbox> -->
                <div class="text-center">
                  <base-button
                    type="primary"
                    class="my-4"
                    :disabled="$v.$invalid"
                    @click="saveUser"
                    >Create User</base-button
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
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
import { quickRequest } from "../../../common/misc";
import PageMixin from "../page-mixin";

export default {
  name: "createUser",
  mixins: [PageMixin],
  data() {
    return {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    };
  },
   beforeDestroy: function(){
    document.getElementById("preloader-block").style.display = "none";
  },
  validations: {
    email: {
      required,
      email,
    },
    firstName: {
      required,
    },
    lastName: {
      required,
    },
    password: {
      required,
      minLen: minLength(4),
    },
    confirmPassword: {
      required,
      sameAs: sameAs("password"),
    },
  },
  methods: {
    async saveUser() {
      try {
        const user = {
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
        };
        this.loading = true;
        let response = await quickRequest("/auth/save-user", "POST", user);
        if ("error" in response) {
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Error",
            text: response.error,
          });
          this.loading = false;
        } else if (response.msg) {
          this.loading = false;
          Swal.fire({
            type: "success",
            icon: "success",
            title: "Message",
            text: response.msg,
          });
          this.$router.push("/users");
        }
      } catch (e) {
        console.log("error below");
        console.log(e);
        this.loading = false;
        Swal.fire({
          type: "error",
          title: "Error Fetching Information",
          text: "Could not save user through the server.",
        });
      }
    },
  },
};
</script>
<style>
</style>
