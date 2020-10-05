<template>
  <div class="py-5" id="detailOneSection">
    <div class="container shape-container d-flex align-items-center">
      <div class="col px-0">
        <div class="row">
          <div class="col offset-lg-1 offset-md-1 col-lg-10 col-md-10 col-xs-12">
            
          <v-layout justify-center>
            <h5 style="text-weight:bolder">VCE Trainer Editor&nbsp;&nbsp;<v-chip color="grey">PREVIEW</v-chip></h5>
          </v-layout>
            <div class="mx-auto rounded-lg" max-width="344" color="LightGray" >
              <v-card-text>
               <v-img src="https://res.cloudinary.com/de1v32nv0/image/upload/v1601901119/Usman/crousel2_go1ri4.png"></v-img>
                <v-layout justify-center>
                  <p>Create your own exams or edit existing exam files in .vce, .vte or .pdf format.</p>
                </v-layout>
                <v-layout justify-center>
                  <p >The editor can be used free of charge to create new files. No subscription is required.</p>
                </v-layout>
                <v-layout justify-center>
                  <p><v-chip class="ma-2" color="pink" label text-color="white" >
                        <v-icon left>mdi-start</v-icon>
                        TRY THE EDITOR</v-chip>&nbsp;&nbsp;&nbsp;&nbsp;
                    We love to hear your feedback and feature suggestions. Contact us now</p>
                </v-layout>
              </v-card-text>
            </div>
          
          </div>
        </div>
      </div>
    </div>
    <hr>
  </div>
</template>

<script>
import card from '../../../components/Card'

export default {
  components: {
    card
  }
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>