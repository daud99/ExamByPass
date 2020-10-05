<template>
  <div>
    <FirstPage />
    <br />
    <br />
    <abovePrice/>
    <br><br>
    <PricingPage />
  </div>
</template>
<script>
import FirstPage from "./components/First_page";
import PricingPage from './components/Pricing';
import abovePrice from './components/priceAbove';


export default {
  name: "landing",
  components: {
    FirstPage,
    PricingPage,
    abovePrice
  }
};
</script>
