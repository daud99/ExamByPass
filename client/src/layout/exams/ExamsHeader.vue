<template>
<header class="header-global">
    <b-navbar toggleable="lg" type="light" style="background-color: #e3f2fd;">
        <b-navbar-brand>
            <router-link class="navbar-brand" to="/">
                <img src="https://res.cloudinary.com/de1v32nv0/image/upload/v1604080465/logo/logovector_-_Copy_5_rd0qiu.svg">
            </router-link>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item href="#">
                    <a class="nav-item nav-link " @click="showDeleted()">

                        <h6>
                            <v-icon right>
                                mdi-delete-variant
                            </v-icon>SHOW DELETED
                        </h6>
                    </a>
                </b-nav-item>
                <b-nav-item>
                    <router-link class="nav-item nav-link" :to="{path: '/about'}">
                        <h6>
                            <v-icon right>
                                mdi-upload
                            </v-icon>UPLOAD
                        </h6>
                    </router-link>
                </b-nav-item>
                <b-nav-item>

                </b-nav-item>

            </b-navbar-nav>

        </b-collapse>
    </b-navbar>
    <div></div>
</header>
</template>

<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import EventBus from '../../Event/eventBus';
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
                element_id.scrollIntoView({
                    block: "end",
                    behavior: "smooth"
                });
            }
        },
        h6() {
            this.scrollToElement();
        },
        showDeleted() {
            EventBus.$emit('delete');
        }
    },
};
</script>

<style scoped>
.navbar-brand-img {
    height: 45px;
    width: 230px;
}

.nav-item>h6 {
    font-weight: bold;
    font-size: 16px;

}
</style>
