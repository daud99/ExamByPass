<template>
  <div class="py-5 bg-secondary">
    <div class="container shape-container d-flex align-items-center">
        <div class="col px-0">
          <div class="row">
            <div class="col col-lg-12 col-md-12 col-xs-12">
              <card class="d-flex align-items-center #f6f9fc">
                <h4>How it works</h4>
                <span>Simply upload your VCE exam file and prepare for your certification exam.</span>
                <br />
                <span>The first five questions can be accessed for free.</span>
                <br />
                <span>To unlock all questions, either a one-time payment or subscription is required.</span>
              </card>
            </div>
          </div>
        </div>
    </div>
    <br />
    <div class="container shape-container d-flex align-items-center">
      <div class="col px-0">
        <div class="row">
          <div class="col col-lg-4 col-md-4 col-xs-12">
            <card class="d-flex align-items-center bg-primary">
              <span>Pricing</span>
              <br />
              <span>$10</span>
            </card>
          </div>
          <div class="col col-lg-4 col-md-4 col-xs-12">
            <card class="d-flex align-items-center bg-primary">
              <span>Pricing</span>
              <br />
              <span>$100</span>
            </card>
          </div>
          <div class="col col-lg-4 col-md-4 col-xs-12">
            <card class="d-flex align-items-center bg-primary">
              <span>Pricing</span>
              <br />
              <span>$1000</span>
            </card>
          </div>
        </div>
      </div>
    </div>
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