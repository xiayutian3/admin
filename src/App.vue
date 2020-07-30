<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
*{
  padding: 0;
  margin: 0;
}
html,body{
  width: 100%;
  height: 100%;
}
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family:de-Bold,de-Medium,de-Regular;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #fff;
  width: 100%;
  min-width: 1440px;
  height: 100%;
  background-color: #fff;
}

</style>
