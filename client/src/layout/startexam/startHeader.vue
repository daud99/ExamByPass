<template>
<b-navbar toggleable="lg" type="light" style="background-color: #e3f2fd;">
    <b-navbar-brand>
        <h6>70-762</h6>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
            <b-nav-item href="#">
                <router-link class="nav-item nav-link " :to="{path: '/contactUs'}">

                    <h6>
                        <v-icon right>
                            mdi-export
                        </v-icon>EXPORT
                    </h6>
                </router-link>
            </b-nav-item>
            <b-nav-item>
                <router-link class="nav-item nav-link" :to="{path: '/about'}">
                    <h6>
                        <v-icon right>
                            mdi-pencil
                        </v-icon>EDIT
                    </h6>
                </router-link>
            </b-nav-item>

            <b-nav-item>
                <router-link class="nav-item nav-link" :to="{path: '/about'}">
                    <h6>
                        <v-icon right>
                            mdi-help-circle
                        </v-icon>HELP
                    </h6>
                </router-link>
            </b-nav-item>
            <b-nav-item>
                <router-link class="nav-item nav-link" :to="{path: '/about'}">
                    <h6>
                        <v-icon right>
                            mdi-pause
                        </v-icon>PAUSE
                    </h6>
                </router-link>
            </b-nav-item>
            <b-nav-item>
                <b-button variant="danger" @click="stop()">STOP</b-button>
            </b-nav-item>

        </b-navbar-nav>

    </b-collapse>
</b-navbar>
</template>

<script>
import EventBus from '../../Event/eventBus';
export default {

    data: () => ({
        //
    }),
    methods: {
        stop() {
            console.log(" ia am stop")
            EventBus.$emit('stop');
        }
    },
};
</script>

<style scoped>
.nav-item>h6 {
    font-weight: bold;
    font-size: 18px;

}

.navbar-nav>li {
    padding-left: 1px;
    padding-right: 1px;
}
</style>
