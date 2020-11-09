<template>
    <div>
        
    </div>
</template>
<script>
import {
    quickRequest
} from "../../../common/misc";
import Swal from "sweetalert2";
export default {
    components: {
    },

    created() {
    console.log(this.$route.params.token)
    this.verify()
    },
    methods: {
        async verify(){
            try {
                let response = await quickRequest("/verifyWithEmailUser", "POST", {token:this.$route.params.token,verify:true});
                if ("error" in response) {
                Swal.fire({
                    type: "error",
                    icon: "error",
                    title: "Error",
                    text: response.error,
                });
                } else if (response.msg) {
                    console.log(response)
                Swal.fire({
                    type: "success",
                    icon: "success",
                    title: "Message",
                    text: response.msg,
                });
                this.loading = false;
                this.$router.push("/login");
                }
            } catch (e) {
                console.log("error");
                console.log(e);
            }
        }
    },
}
</script>

<style scoped>
.navbar {
    padding: 1rem 1rem;
}

@media screen and (min-width: 989px) {
    .navbar .nav-item {
        color: black;
        padding-top: 10px;

    }
}
</style>
