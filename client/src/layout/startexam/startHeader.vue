<template>
<div>
    <base-nav background='background-color:  #E8F5E9;' effect="light" expand>
        <div slot="brand" class="navbar-brand mr-lg-5">
            <h6>{{examName}}</h6>
        </div>

        <div class="row" slot="content-header" slot-scope="{closeMenu}">
            <div class="col-6 collapse-brand">
                <h6>{{examName}}</h6>
            </div>
            <div class="col-6 collapse-close">
                <close-button @click="closeMenu"></close-button>
            </div>
        </div>

        <ul class="navbar-nav ml-lg-auto">
            <li class="nav-item">
                <button type="button" class="nav-item nav-link btn-sm ">

                    <v-icon color='rgba(0,0,0,0.87)' class="mb-2" size='25px' right>
                        mdi-help-circle
                    </v-icon><span class="spanText ">HELP</span>
                </button>

            </li>
            <li class="nav-item">
                <button class="nav-item nav-link btn-xs" @click="save()">

                    <v-icon color='rgba(0,0,0,0.87)' class="mb-2" size='25px' right>
                        mdi-pause
                    </v-icon><span class="spanText ">PAUSE</span>

                </button>

            </li>
            <li class="nav-item">
                <div class="nav-item nav-link">
                    <v-btn small @click="stop()" color="error">
                        STOP
                    </v-btn>
                </div>
            </li>

        </ul>

    </base-nav>

</div>
</template>

<script>
import EventBus from '../../Event/eventBus';
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
export default {
    components: {
        BaseNav,
        CloseButton,
        BaseDropdown,

    },
    data: () => ({
        //
        examName: String
    }),
    created() {
        console.log("name is", this.$examName)
        this.examName = JSON.parse(localStorage.getItem("examName"));
    },
    methods: {
        stop() {
            console.log(" ia am stop")
            EventBus.$emit('stop');
        },
        save() {
            console.log(" ia am save")
            EventBus.$emit('save');
        }
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans&display=swap');

.spanText {

    font-size: 15px;
    font-weight: 700;

    font-family: 'PT Sans', sans-serif;

}
</style>
