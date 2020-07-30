/* eslint-disable vue/no-parsing-error */
<template>
  <div class="mg-user">
    <Button class="return-btn" type="info" icon="md-return-left" @click="$router.go(-1)">返回上一级</Button>
    <div class="left">
      <Form :model="formItem" ref="formValidate" :rules="ruleValidate" :label-width="200">
        <FormItem label="用户名" prop="username">
          <Input v-model="formItem.username" placeholder="请填写用户名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password" v-if="!isEdite">
          <Input v-model="formItem.password" placeholder="请输入密码"></Input>
        </FormItem>
        <!-- <FormItem label="姓名">
          <Input v-model="formItem.input" placeholder="请填写用户姓名"></Input>
        </FormItem>
        <FormItem label="手机号码">
          <Input v-model="formItem.input" placeholder="请填写手机号码"></Input>
        </FormItem>-->
        <FormItem label="状态">
          <i-switch v-model="formItem.state" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <!-- <FormItem label="备注信息">
          <Input
            v-model="formItem.textarea"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="Enter something..."
          ></Input>
        </FormItem>-->

        <FormItem label="角色权限（多选）">
          <Input v-model="str" search placeholder="关键字查询筛选" @on-search="searchFun" />
          <div class="list">
            <CheckboxGroup v-model="selectRole">
              <div v-for="(item,idx) in roleArr" :key="idx">
                <Checkbox :label="item.id">
                  <span>{{item.name}}</span>
                </Checkbox>
              </div>
            </CheckboxGroup>
          </div>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="addUser">提交</Button>
          <Button style="margin-left: 8px" @click="resetall">重置</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import {
  userAdd,
  userUpdate,
  roleList,
  selectByPrimaryKey,
  userCheck
} from '@/api/manage'
import { objIsNull } from '@/utils/obj'
// 检验用户名是否存在的接口
const validateUser = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请填写用户名'))
  }
  // 模拟异步验证效果
  userCheck({ username: value }).then(({ data: { code } }) => {
    console.log(code)
    if (code == 4) {
      // 用户名不存在
      callback()
    } else {
      callback(new Error('用户名已存在,请重新输入'))
    }
  })
}
export default {
  name: 'mg-user',
  data () {
    return {
      formItem: {
        username: '',
        state: true,
        password: ''
      },
      ruleValidate: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          {
            validator: this.validateUserFun,
            trigger: 'blur'
          }
        ],
        password: { required: true, message: '请填写密码', trigger: 'blur' }
      },
      str: '',
      selectRole: [],
      roleArr: [],
      isEdite: false,
      editUserId: ''
    }
  },
  async created () {
    const {
      data: { data, code }
    } = await roleList()
    if (code == 0) {
      this.roleArr = data
    }
    const hasRouterParams = objIsNull(this.$route.params)
    if (!hasRouterParams) {
      this.isEdite = true
      const {
        data: {
          code,
          data: { username, userRoleList, state, password, id }
        }
      } = await selectByPrimaryKey({ id: this.$route.params.id })
      // console.log('da', code, username, userRoleList, state)
      console.log(id)
      if (code == 0) {
        this.editUserId = id
        this.formItem = {
          username: username,
          state: state == 0,
          password: password
        }
        const selcetRole = []
        userRoleList.forEach(item => {
          selcetRole.push(item.roleId)
        })
        this.selectRole = selcetRole
      }
    } else {
      // const { data: { data, code } } = await roleList()
      // if (code == 0) {
      //   this.roleArr = data
      // }
    }
  },
  mounted () {},
  computed: {
    validateUserFun () {
      return this.isEdite ? '' : validateUser
    }
  },
  watch: {},
  methods: {
    async addUser () {
      // 编辑方法的名字，或者新增方法名字
      let addOrEditFun = ''
      if (this.isEdite) {
        addOrEditFun = userUpdate
      } else {
        addOrEditFun = userAdd
      }
      this.$refs.formValidate.validate(async valid => {
        if (valid) {
          const params = {
            username: this.formItem.username,
            state: this.formItem.state ? 0 : 1,
            password: this.formItem.password,
            roleId: this.selectRole,
            id: this.editUserId
          }
          const {
            data: { code }
          } = await addOrEditFun(params)
          if (code == 0) {
            this.$Message.success('操作成功')
            this.$router.push('/home/user')
          }
        } else {
          console.log('fail')
          this.$Message.error('Fail!')
        }
      })
    },
    async searchFun () {
      const searchRole = {
        str: this.str
      }
      const {
        data: { data, code }
      } = await roleList(searchRole)
      if (code == 0) {
        this.roleArr = data
      }
    },
    resetall () {
      this.formItem = {
        username: '',
        state: true,
        password: ''
      }
      this.str = ''
      this.selectRole = []
    }
  }
}
</script>

<style lang='scss'>
.mg-user {
  position: relative;
  padding: 10px 20px 0px 20px;
  .return-btn{
    position: absolute;
    left: 30px;
    top: 20px;
  }
  .left {
    padding: 10px;
    background: #fff;
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
