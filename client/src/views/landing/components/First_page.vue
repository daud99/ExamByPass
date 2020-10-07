<template>
  <section
    :style="{
      backgroundImage: `url(${'https://res.cloudinary.com/de1v32nv0/image/upload/v1601894257/Usman/GettyImages_482204997-56a132995f9b58b7d0bcf644_nmqjge.jpg'})`,
    }"
  >
    <div class="container shape-container d-flex align-items-center">
      <div class="col px-0">
        <br />
        <br />
        <upload_files_dialog />
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
import card from "../../../components/Card";
import carousel from "./FirstPageComponents/Carousel";
import upload_files_dialog from "./FirstPageComponents/upload_files_dialog";

export default {
  components: {
    card,
    carousel,
    upload_files_dialog,
  },
};
</script>

<style>
</style>
