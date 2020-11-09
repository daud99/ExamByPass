<template>
<header class="header-global">
    <base-nav class="navbar-main" transparent type="" effect="light" expand>
        <br />
        <br />
        <br />
        <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
            <img src="https://res.cloudinary.com/de1v32nv0/image/upload/v1604080465/logo/logovector_-_Copy_5_rd0qiu.svg">
        </router-link>

        <div class="row" slot="content-header" slot-scope="{ closeMenu }">
            <div class="col-6 collapse-brand">
                <a href="#">
                    <img src="https://res.cloudinary.com/de1v32nv0/image/upload/v1604080465/logo/logovector_-_Copy_5_rd0qiu.svg">
                </a>
            </div>
            <div class="col-6 collapse-close">
                <close-button @click="closeMenu"></close-button>
            </div>
        </div>

        <ul class="navbar-nav align-items-lg-center ml-lg-auto">
            <li class="nav-item">
                <base-button tag="a" @click="
              () => {
                this.$router.push({ name: 'register' });
              }
            " class="mb-3 mb-sm-0" type="white" icon="fa fa-user-plus">
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
