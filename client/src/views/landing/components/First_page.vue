<template>
  <section class="section-shaped my-0">
    <div class="shape shape-style-1 shape-primary">
      <span class="span-150"></span>
      <span class="span-50"></span>
      <span class="span-50"></span>
      <span class="span-75"></span>
      <span class="span-100"></span>
      <span class="span-75"></span>
      <span class="span-50"></span>
      <span class="span-100"></span>
      <span class="span-50"></span>
      <span class="span-100"></span>
    </div>
    <div class="container shape-container d-flex align-items-center">
      <div class="col px-0">
        <br />
        <br />
        <div class="row">
          <div class="col col-lg-6 col-md-6 col-xs-12">
            <card class="d-flex align-items-center">
              <h5>Upload .ete file</h5>
            </card>
          </div>
          <div class="col col-lg-6 col-md-6 col-xs-12">
            <card class="d-flex align-items-center">
              <h5>Show my exams</h5>
            </card>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <div class="row">
          <div class="col col-lg-12 col-md-12 col-xs-12">
            <carousel />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import card from '../../../components/Card'
import carousel from './FirstPageComponents/Carousel'

export default {
  components: {
    card,
    carousel
  }
};
</script>

<style>
</style>
