/* eslint-disable vue/no-parsing-error */
<template>
  <div class="mg-person">
    <div class="mg-person-in">
      <div class="left">
        <Form :model="formItem" :label-width="200">
          <FormItem label="用户名">
            <Input v-model="formItem.username" disabled placeholder="请填写用户名"></Input>
          </FormItem>
          <FormItem label="修改密码">
            <Input v-model="formItem.password" type="password" password placeholder="请填写新密码"></Input>
          </FormItem>
          <FormItem label="确认密码">
            <Input v-model="formItem.repassword" type="password" password placeholder="请再次输入密码"></Input>
          </FormItem>
          <!-- <FormItem label="姓名">
          <Input v-model="formItem.input" placeholder="请填写用户姓名"></Input>
        </FormItem>
        <FormItem label="手机号码">
          <Input v-model="formItem.input" placeholder="请填写手机号码"></Input>
          </FormItem>-->

          <FormItem>
            <Button type="primary" @click="submit">提交</Button>
            <Button style="margin-left: 8px" @click="resetall">重置</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { module1Mixin } from '@/utils/mixin'
import { updatePassword } from '@/api/manage'
export default {
  name: 'mg-person',
  mixins: [module1Mixin],
  data () {
    return {
      formItem: {
        username: '',
        password: '',
        repassword: ''
      }
    }
  },
  created () {},
  mounted () {
    this.formItem.username = this.user.username
  },
  computed: {},
  watch: {},
  methods: {
    async submit () {
      const obj = {
        ...this.formItem,
        id: this.user.id
      }

      const {
        data: { code }
      } = await updatePassword(obj)
      if (code === 0) {
        this.$Message.success('修改成功')
        this.exit()
      }
    },
    resetall (val) {
      //
      for (const key in this.formItem) {
        this.formItem[key] = ''
      }
    }
  }
}
</script>

<style lang='scss'>
.mg-person {
  flex: 1;
  padding: 10px 20px 0px 20px;
  display: flex;
  .mg-person-in {
    flex: 1;
    background: #fff;
  }
  .left {
    margin: 150px auto 0;
    padding: 10px;
    width: 800px;
  }
  .ivu-icon-ios-arrow-forward {
    color: #333;
  }
  .list {
    height: 220px;
    color: #333;
    overflow-y: auto;
  }
}
</style>
