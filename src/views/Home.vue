<template>
  <div class="home" :class="loginBg?'login-bg':'normal'">
    <Header/>
    <router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
// import axios from '@/api/http'

export default {
  name: 'Home',
  data () {
    return {
      loginBg: false
    }
  },
  created () {
    // 接收服务端的信息
    // console.log(this.$socket)
    // this.$socket.subscribe('people-pass', (data) => {
    //   console.log(data)
    // })
  },
  mounted () {
    if (this.$route.name === 'login') {
      this.loginBg = true
    } else {
      this.loginBg = false
    }
  },
  methods: {

  },
  watch: {
    $route (newVal, oldVal) {
      if (newVal.name === 'login') {
        this.loginBg = true
      } else {
        this.loginBg = false
      }
    }
  }
}
</script>
<style lang="scss">
.home{
  &.login-bg{
     background: url('../assets/img/login-back.png') no-repeat;
     background-size: 100% 100%;
  }
  &.normal{
     background: url('../assets/img/bg.png') no-repeat;
     background-size: 100% 100%;
  }
  display: flex;
  flex-direction:column;
  min-height: 100%;
  .operate{
    background: #fff;
  }
  .content{
     background: #fff;
  }
  .ivu-page-total{
    color: #fff;
  }
}
</style>
