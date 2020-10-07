<template>
<div id="pricingSection">
    <div class="py-5 bg-secondary">
    <div class="container shape-container d-flex align-items-center">
      <div class="col px-0">
          <v-layout justify-center>
            <h5 style="text-weight:bolder">PRICING</h5>
          </v-layout>
        <div class="row">
          <div class="col col-lg-4 col-md-4 col-xs-12">
            <v-card class="mx-auto rounded-lg" max-width="344" color="LightGray" elevation="6">
              <v-card-text>
                <v-layout justify-center>
                  <h5 style="text-weight:bolder">One Exam File</h5>
                </v-layout>
                <v-layout justify-center>
                  <h5 style="text-weight:bolder">$9.99&nbsp;&nbsp;per VCE File</h5>
                </v-layout>
                <v-layout justify-center>
                  <p >One-time payment for this exam</p>
                </v-layout>
                <v-layout justify-center>
                  <p>Unlimited free retries forever.</p>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>
          <div class="col col-lg-4 col-md-4 col-xs-12">
            <v-card class="mx-auto rounded-lg" max-width="344" color="LightGray" elevation="6">
              <v-card-text>
                <v-layout justify-center>
                  <h5 style="text-weight:bolder">One Exam File</h5>
                </v-layout>
                <v-layout justify-center>
                  <h5 style="text-weight:bolder">$9.99&nbsp;&nbsp;per VCE File</h5>
                </v-layout>
                <v-layout justify-center>
                  <p >One-time payment for this exam</p>
                </v-layout>
                <v-layout justify-center>
                  <p>Unlimited free retries forever.</p>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>
          
          <div class="col col-lg-4 col-md-4 col-xs-12">
            <v-card class="mx-auto rounded-lg" max-width="344" color="LightGray" elevation="6">
              <v-card-text>
                <v-layout justify-center>
                  <h5 style="text-weight:bolder">One Exam File</h5>
                </v-layout>
                <v-layout justify-center>
                  <h5 style="text-weight:bolder">$9.99&nbsp;&nbsp;per VCE File</h5>
                </v-layout>
                <v-layout justify-center>
                  <p >One-time payment for this exam</p>
                </v-layout>
                <v-layout justify-center>
                  <p>Unlimited free retries forever.</p>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</div>
</template>

<script>
import card from '../../../components/Card'
import ComponentOne from "./component1";
import ComponentTwo from "./component2";
export default {
  components: {
    card,
    ComponentOne,
    ComponentTwo
  }
}
</script>

<style scoped>
.bg-primary {
  color: white;
}
</style>