<template>
<button class="navbar-toggler" type="button" data-toggle="collapse" :data-target="target" :aria-controls="target" :aria-expanded="toggled" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
</button>
</template>

<script>
export default {
    props: {
        target: {
            type: [String, Number],
            description: "Button target element"
        },
        toggled: {
            type: Boolean,
            default: false,
            description: "Whether button is toggled"
        }
    }
};
</script>

<style>
.navbar-toggler .navbar-toggler-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgb(0,0,0)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E") !important;
}
</style>
