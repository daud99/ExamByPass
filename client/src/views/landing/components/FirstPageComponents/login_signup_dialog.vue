<template>
    <v-dialog v-model="show">
        <div class="v-card v-sheet theme--light">
            <div class="v-card__body">
                 <div class="text-center" file="v-btn/prop-loaders">
            <button type="button" class="ma-2 v-btn v-btn--contained theme--light v-size--default success" @click="$router.push('login')">
                <span class="v-btn__content"> Login </span>
            </button>
            <button type="button" class="ma-2 v-btn v-btn--contained theme--light v-size--default info" @click="$router.push('register')">
                <span class="v-btn__content"> Sign Up </span>
            </button>
           
        </div>
                
                <div class="v-menu"><!----></div>
               
               
               </div><div class="v-card__actions"><button type="button" class="v-btn v-btn--flat v-btn--text theme--light v-size--default primary--text"><span class="v-btn__content" @click.stop="show=false"> Close </span></button></div></div>
        
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
