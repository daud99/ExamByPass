<template>
    <v-dialog v-model="show">
        <div class="container-fluid align-items-center">
          <div class="row">
            <div class="offset-lg-4 offset-md-4 col col-lg-4 col-md-4 col-xs-12">

              <div class="v-card v-sheet theme--light">
                <div class="v-card__body">
                <div class="text-center" file="v-btn/prop-loaders">
                <button type="button" class="btn btn-primary btn-block" @click="$router.push('login')">
                    <span> Login </span>
                </button>
                <button type="button" class="btn btn-success btn-block" style="text-align: center;" @click="$router.push('register')">
                    <span> Sign Up </span>
                </button>
              </div>
              <div class="v-menu"><!---->
              </div>
              </div>
              <div class="v-card__actions" style="justify-content: center; align-items: center;">
                <button type="button" class="btn btn-sm btn-danger">
                  <span class="v-btn__content" @click.stop="show=false"> Close </span>
                </button>
              </div>
              </div>


            </div>         
          </div>
        </div>         
        
    </v-dialog>
    
</template>
<style scoped>
.section_header {
  background-color: rgb(65, 30, 243);
  color: white;
}
</style>
<script>
export default {
  props: ['visible'],
  computed: {
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  },
  data: () => ({
    dialog: false
   
  }),

  methods: {
  
  }
};
</script>
