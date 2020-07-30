/* eslint-disable vue/no-parsing-error */
<template>
  <div class="login">
    <div class="content">
      <div class="title">登陆</div>
      <div class="form-content">
        <Form ref="formInline" :model="formInline" :rules="ruleInline" label-position="top">
          <FormItem prop="username" label="用户名">
            <Input type="text" v-model="formInline.username" placeholder="请输入用户名">
              <!-- <Icon type="md-person" slot="prepend" color="#0980a3"></Icon> -->
            </Input>
            <img class="lock-user" src="../assets/img/user.png" alt="">
          </FormItem>
          <FormItem prop="password" label="密码">
            <Input type="password" v-model="formInline.password" placeholder="请输入密码" @keyup.enter.exact.native="handleSubmit('formInline')">
              <!-- <Icon type="md-lock" slot="prepend" color="#0980a3"></Icon> -->
            </Input>
            <img class="lock-psw" src="../assets/img/psw.png" alt="">
          </FormItem>
          <FormItem class="login-btn">
            <Button type="primary" class="btn" long :loading="loading" @click="handleSubmit('formInline')">
              <span v-if="!loading">登陆</span>
              <span v-else>Loading...</span>
            </Button>
            <!-- <router-link class="forget" to="/foget">忘记密码？</router-link> -->
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { getLogin } from '@/api/home'
import { setLocalStorage } from '@/utils/localStorage'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'login',
  mixins: [module1Mixin],
  data () {
    return {
      formInline: {
        username: '',
        password: ''
      },
      ruleInline: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  watch: {},
  methods: {
    async handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this._login()
        } else {
          this.loading = false
        }
      })
    },
    async _login () {
      this.loading = true
      const { data: { code, token, user } } = await getLogin(this.formInline)
      if (code === 0) {
        this.$Message.success('欢迎登录')
        // 本地
        setLocalStorage('token', token)
        setLocalStorage('user', JSON.stringify(user))
        setLocalStorage('isLogin', true)
        // vuex
        this.settoken(token)
        this.setisLogin(true)
        // 设置用户
        this.setuser(user)
        this.loading = false
        // this.$router.push('/home/index')
        this.$router.replace('/home/index')
      } else {
        this.$Message.error('登录失败,用户名或密码错误')
        this.loading = false
      }
    }
  }
}
</script>

<style lang='scss'>
.login {
  position: relative;
  flex: 1;
  // background: url('../assets/img/login-back.png') no-repeat;
  // background-size: 100% 100%;
  .content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 502px;
    height: 498px;
    transform: translate3d(-50%, -50%, 0);
    background: url('../assets/img/login-box.png') no-repeat;
    .title {
      margin-top: 50px;
      text-align: center;
      font-size: 32px;
      color: #09aad9;
    }
    .form-content {
      position: relative;
      margin: 60px auto 0px;
      width: 260px;
      height: 240;
      .lock-user{
        position: absolute;
        top: 5px;
        right: 5px;
      }
      .lock-psw{
        position: absolute;
        top: 5px;
        right: 5px;
      }
      .ivu-input{
        background-color: #06315c;
        color: #fff;
        border: 1px solid #06315c;
        &::placeholder{
          color:#0980a3;
        }
      }
      .ivu-form-item-error .ivu-input{
        border: 1px solid #ed4014;
      }
      .ivu-form-item-label{
        font-size: 18px;
        color: #fff;
      }
      .ivu-form-item-required .ivu-form-item-label:before{
        display: none;
      }
      .login-btn {
        position: relative;
        margin-top: 45px;
        .btn{
          border-radius: 16px;
          background-color: #09aad9;
        }
        .forget {
          position: absolute;
          top: -42px;
          right: 2px;
          color: #fff;
        }
      }
    }
  }
}
</style>
