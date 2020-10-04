<template>
	<v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
       Exam By Pass
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
        <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
	export default {
		name: 'Simulator'
	}
</script>

<style>
img {
  max-width: 100%;
    width: auto;
    height: auto;
}
</style>