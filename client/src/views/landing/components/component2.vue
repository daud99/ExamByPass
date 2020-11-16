<template>
  <div class="py-5" id="detailOneSection">
    <div class="container shape-container d-flex align-items-center">
      <div class="col px-0">
        <div class="row" style="background-color:#00BFFF">
          <div class="col offset-lg-1 offset-md-1 col-lg-7 col-md-7 col-xs-7">
          <br><br>
          <v-layout justify-left>
            <h4 style="color:white">HAVE QUESTIONS? LET US KNOW!</h4>
          </v-layout><br>
          <v-layout justify-left>
            <p style="color:white">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor itaque modi ab accusantium architecto voluptates ipsa molestiae.</p>
          </v-layout><br><br><br>
          </div>
          <div class="col offset-lg-1 offset-md-1 col-lg-3 col-md-3 col-xs-3">
          <br><br>
          <v-layout justify-left>
            <button type="button" class="btn btn-warning" @click="() => {
                        this.$router.push({ name: 'ContactUs' });
                      }">
              CONTACT US
            </button>
          </v-layout><br>
          </div>
        </div><br><br>
        <div class="row">
          <div class="col offset-lg-1 offset-md-1 col-lg-4 col-md-4 col-xs-4">
              <div style="border-bottom: 4px solid indigo;">
                <v-layout justify-center>
                <v-icon
                  dark
                  right
                  color="primary"
                  x-large
                >
                  mdi-checkbox-marked-circle
                </v-icon>
                </v-layout><br><br>
                <v-layout justify-center>
                  <h4>Service 3</h4>
                </v-layout>
              </div><br><br><br>
              <div style="border-bottom: 4px solid indigo;">
                <v-layout justify-center>
                <v-icon
                  dark
                  right
                  color="primary"
                  x-large
                >
                  mdi-checkbox-marked-circle
                </v-icon>
                </v-layout><br><br>
                <v-layout justify-center>
                  <h4>Service 1</h4>
                </v-layout>
              </div><br><br><br>
              <div style="border-bottom: 4px solid indigo;">
                <v-layout justify-center>
                <v-icon
                  dark
                  right
                  color="primary"
                  x-large
                >
                  mdi-checkbox-marked-circle
                </v-icon>
                </v-layout><br><br>
                <v-layout justify-center>
                  <h4>Services 2</h4>
                </v-layout>
              </div><br><br><br>         
          </div>
          <div class="col offset-lg-1 offset-md-1 col-lg-6 col-md-6 col-xs-6" style="border-left: 6px solid grey;">
                 <v-layout justify-left>
                  <h2>SERVICES</h2>
                </v-layout>
                <v-layout justify-left>
                  <h6 STYLE="color:blue;">EXPLORE HERE</h6>
                </v-layout>
                <v-layout justify-left max-width="50%">
                  <p style="color:dark-grey; font-size: 15px;"> Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas. Efficiently unleash media information without cross-media value. Quickly maximize value timely deliverables schemas.</p>
                </v-layout>      
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