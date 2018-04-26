<template>
  <div id="app">
   
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  body{
  	margin:0;
  	background-color: #050605;
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
  }
</style>
