<template>
  <div class="row">
    <div class="col-lg-1 col-md-1 col-xs-0">
    </div>
    <div class="col-lg-10 col-md-10 col-xs-12 mb-lg-auto">
      <div class="rounded shadow-lg overflow-hidden">
        <b-carousel id="carousel1" controls indicators>
          <!-- Text slides with image -->
          <b-carousel-slide img-src="https://vcetrainer.com/Content/Images/Dark%20Mode.png"></b-carousel-slide>
          <b-carousel-slide img-src="https://res.cloudinary.com/de1v32nv0/image/upload/v1601900478/Usman/crouselImg_ewbiqp.png"></b-carousel-slide>
        </b-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import { BCarousel } from "bootstrap-vue/esm/components/carousel/carousel";
import { BCarouselSlide } from "bootstrap-vue/esm/components/carousel/carousel-slide";

export default {
  components: {
    BCarousel,
    BCarouselSlide
  }
};
</script>

<style scopded>
#carousel1 {
  max-height: 600px;
}
</style>
