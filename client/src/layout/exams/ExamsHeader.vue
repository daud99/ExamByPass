<template>
<div>
    <base-nav background='background-color:  #e3f2fd;' effect="light" expand>
        <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
            <img src="https://res.cloudinary.com/de1v32nv0/image/upload/v1604080465/logo/logovector_-_Copy_5_rd0qiu.svg">
        </router-link>

        <div class="row" slot="content-header" slot-scope="{closeMenu}">
            <div class="col-6 collapse-brand">
                <a href="#">
                    <img src="https://res.cloudinary.com/de1v32nv0/image/upload/v1604080465/logo/logovector_-_Copy_5_rd0qiu.svg">
                </a>
            </div>
            <div class="col-6 collapse-close">
                <close-button @click="closeMenu"></close-button>
            </div>
        </div>

        <ul class="navbar-nav ml-lg-auto">
            <li class="nav-item">
                <button type="button" class="nav-item nav-link btn-sm " @click="showDeleted()">
                    <v-icon color='rgba(0,0,0,0.87)' class="mb-2" size='25px' right>
                        mdi-delete-variant
                    </v-icon>
                    <span class="spanText ">SHOW DELETED</span>
                </button>

            </li>
            <li class="nav-item">
                <button class="nav-item nav-link btn-xs" @click="upload()">

                    <v-icon color='rgba(0,0,0,0.87)' class="mb-1" size='25px' right>
                        mdi-upload
                    </v-icon>
                    <span class="spanText ">UPLOAD</span>

                </button>

            </li>

        </ul>

    </base-nav>
    <div v-if="isUpload">
        <uploadfile @changeUploadCondition="changeUploadCondition" :showButton='true' />
    </div>
</div>
</template>

<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import EventBus from '../../Event/eventBus';
import uploadfile from '../../views/landing/components/FirstPageComponents/upload_files_dialog'
export default {
    data() {
        return {
            isUpload: false
        }
    },
    components: {
        BaseNav,
        CloseButton,
        BaseDropdown,
        uploadfile
    },
    methods: {
        upload() {
            this.isUpload = true
        },
        changeUploadCondition() {
            this.isUpload = false
        },
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
    font-weight: 400;
    font-size: 15px;

}

.spanText {
    font-weight: 450;
    font-size: 14px;
    letter-spacing: 1.2px;

}
</style>
