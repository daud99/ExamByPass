<template>
  <header class="header-global">
    <base-nav class="navbar-main" transparent type="" effect="light" expand>
      <br />
      <br />
      <br />
      <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
        <h3 v-bind:style="{ color: 'white' }">ExamByPass</h3>
      </router-link>

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
        <li class="nav-item">
          <base-button
            tag="a"
            @click="
              () => {
                this.$router.push({ name: 'register' });
              }
            "
            class="mb-3 mb-sm-0"
            type="white"
            icon="fa fa-user-plus"
          >
            Register
          </base-button>
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import CloseButton from "@/components/CloseButton";

export default {
  components: {
    BaseNav,
    CloseButton,
  },
};
</script>
<style>
</style>
