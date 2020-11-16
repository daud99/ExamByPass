<template>
<div>
  <div class="py-5 bg-secondary" id="pricingAboveSection">
    <div class="py-5" id="pricingSectionOne">
      <ComponentOne/>
      <br>
      <br>  
    </div>
    <div class="py-5 bg-secondary" id="pricingSectionTwo">
      <ComponentTwo/>
      <br>
      <br>
    </div>
    <hr>
    <hr>
    <div class="container shape-container d-flex align-items-center">
        <div class="col px-0">
          <div class="row">
            <div class="col col-lg-12 col-md-12 col-xs-12 ">
            <v-layout justify-center>
              <h4>How it works</h4>
              </v-layout><v-layout justify-center>
              <p>Simply upload your VCE exam file and prepare for your certification exam.</p>
              </v-layout><v-layout justify-center>
              <p>The first five questions can be accessed for free.</p>
              </v-layout><v-layout justify-center>
              <small>To unlock all questions, either a one-time payment or subscription is required.</small>
              </v-layout><v-layout justify-center>
              <p><v-icon medium color="teal darken-2">mdi-checkbox-marked-circle</v-icon>&nbsp; 100% satisfaction guarantee</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <p><v-icon medium color="teal darken-2">mdi-checkbox-marked-circle</v-icon>&nbsp;  No monthly commitment</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <p><v-icon medium color="teal darken-2">mdi-checkbox-marked-circle</v-icon>&nbsp; Free Trial</p>

            </v-layout>
            </div>
          </div>
        </div>
    </div><hr>
    <br />
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