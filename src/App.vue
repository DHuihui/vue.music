<template>
  <div id="app">
   
    <router-view/>
    <MiniPlayer></MiniPlayer>
  </div>
</template>

<script>
import MiniPlayer from "@/components/MiniPlayer.vue";
export default {
    name: 'App',
    components:{
        MiniPlayer
    }
}
</script>

<style lang="scss">
  body{
  	margin:0;
  	background-color: #050605;
    overflow-x: hidden;
  }
  h1,h2,h3{
    margin:0;
  }
  ul{
    list-style: none;
    margin:0px;
    padding:0px;
  }
  a{
    text-decoration: none;
    color:#fff;
    -webkit-tap-highlight-color: transparent;
  }
</style>
