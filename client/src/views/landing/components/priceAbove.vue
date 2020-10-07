<template>
<div>
  <div class="py-5 bg-secondary" id="pricingAboveSection">
    <hr>
    <div class="container shape-container d-flex align-items-center">
        <div class="col px-0">
          <div class="row">
            <div class="col col-lg-12 col-md-12 col-xs-12 ">
            <v-layout justify-center>
              <h4>Earn a free Microsoft Certification Exam worth 165 USD&nbsp;&nbsp;<v-chip color="grey">promo</v-chip></h4><br>
              </v-layout><v-layout justify-center>
              <p>Get a free Microsoft certification exam voucher if you complete the Microsoft Ignite Cloud Skills Challenge .</p><br>
              </v-layout><v-layout justify-center>
              <p>You need to complete at least one challenge before October 7, 2020, in order to get the voucher.</p><br>
              </v-layout><v-layout justify-center>
              <small>We are not affiliated with Microsoft or this special offer, but just wanted to inform you. Conditions apply.</small>br
              </v-layout><v-layout justify-center>
              <v-chip label outlined pill>LIST OF APPLICABLE EXAMS</v-chip>
            </v-layout>
            </div>
          </div>
        </div>
    </div>
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