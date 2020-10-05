<template>
<<<<<<< Updated upstream
    <header class="header-global">
        <base-nav class="navbar-main" transparent type="" effect="light" expand>
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
          <h3 v-bind:style="{ 'color': 'white' }">Exam</h3>
            </router-link>
=======
  <header class="header-global">
    <base-nav type="default" effect="dark" expand>
      <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
        <h3 v-bind:style="{ color: 'white' }">ExamByPass</h3>
      </router-link>
>>>>>>> Stashed changes

      <div class="row" slot="content-header" slot-scope="{ closeMenu }">
        <div class="col-6 collapse-brand">
          <a
            href="https://demos.creative-tim.com/vue-argon-design-system/documentation/"
          >
            <img src="img/brand/blue.png" />
          </a>
        </div>
        <div class="col-6 collapse-close">
          <close-button @click="closeMenu"></close-button>
        </div>
      </div>

      <ul class="navbar-nav align-items-lg-center ml-lg-auto">
        <li class="nav-item pointer">
          <h6 style="color: white; padding-top: 10px" @click="h6">
            <strong>HELP</strong>
          </h6>
        </li>
        &nbsp; &nbsp; &nbsp;
        <li class="nav-item pointer">
          <h6 style="color: white; padding-top: 10px" @click="h6">
            <strong>PRICING</strong>
          </h6>
        </li>
        &nbsp; &nbsp; &nbsp;
        <li class="nav-item pointer">
          <h6 style="color: white; padding-top: 10px" @click="h6">
            <strong>EDITOR</strong>
          </h6>
        </li>
        &nbsp; &nbsp; &nbsp;
        <li class="nav-item">
          <base-button
            tag="a"
            @click="
              () => {
                this.$router.push({ name: 'login' });
              }
            "
            class="mb-3 mb-sm-0"
            type="white"
            icon="fa fa-sign-in"
          >
            Login
          </base-button>
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown,
  },
  methods: {
    scrollToElement() {
      let element_id = document.getElementById("pricingSection");
      if (element_id) {
        element_id.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    },
    h6() {
      this.scrollToElement();
    },
  },
};
</script>

<style scoped>
</style>
