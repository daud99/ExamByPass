<template>
    <div :class="{'wrapper core-content': true, 'loading': loading}">

        <slot></slot>
        <div class='preloader' v-show="loading">
            <div class='preloader-content'>
                  <circle9></circle9>
            </div>
        </div>

    </div>
</template>

<script>

import {Circle9} from 'vue-loading-spinner';

export default {
    name: 'core-content',
    components: {
        Circle9
    },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        loading: function (newValue, oldValue) {
            document.getElementById("preloader-block").style.display = newValue ? "block" : "none";
        }
    }
};

</script>

<style lang="scss" scoped>

.wrapper {
    position: relative;

    .preloader {
        position: fixed;
        left: 0px;
        right: 0px;
        top: 50%;
        text-align: center;
        z-index: 1041;
        .preloader-content {
            display: inline-block;
        }

    }
}

</style>
