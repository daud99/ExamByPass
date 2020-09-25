<template>
  <div>
    <FirstPage />
    <br />
    <br />
    <PricingPage />
  </div>
</template>
<script>
import FirstPage from "./components/First_page";
import PricingPage from './components/Pricing'

export default {
  name: "landing",
  components: {
    FirstPage,
    PricingPage
  }
};
</script>
