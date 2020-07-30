/* eslint-disable vue/no-parsing-error */
<template>
  <div class="mg-role">
    <Button class="return-btn" type="info" icon="md-return-left" @click="$router.go(-1)">返回上一级</Button>
    <div class="left">
      <Form :model="formItem" :label-width="200">
        <FormItem label="角色名称">
          <Input v-model="formItem.name" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色字符">
          <Input v-model="formItem.roleKey" placeholder="请输入角色字符"></Input>
        </FormItem>
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
        </FormItem> -->
        <div class="tree-wrap">
          <div class="lf">
            <span class="name">菜单权限</span>
             <Tree ref="menuTree" :data="data2" show-checkbox></Tree>
          </div>
          <div class="rt">
            <span class="name">选择权限范围（角色权限多选）</span>
             <Tree ref="roleTree" :data="roleArr" :load-data="loadData" show-checkbox></Tree>
          </div>
        </div>

        <FormItem>
          <Button type="primary" v-if="addorUpdate" @click="addhandle">提交</Button>
          <Button type="primary" v-else @click="editeFun">更新</Button>
          <Button style="margin-left: 8px" @click="clearFun">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="rt"></div>
  </div>
</template>

<script>
import { roleAdd, rolePerm, menuPerm, roleUpdate } from '@/api/manage'
import { convert } from '@/utils/arr'
import { objIsNull } from '@/utils/obj'
// import clonedeep from 'clonedeep'

let initRoleArr = []
let initMenuArr = []
export default {
  name: 'mg-role',
  data () {
    return {
      addorUpdate: true,
      formItem: {
        name: '',
        roleKey: '',
        state: true
        // textarea: ''
      },
      data2: [
        {
          title: 'parent 1',
          children: [
            {
              title: 'parent 1-1',
              // expand: true,
              // checked: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        },
        {
          title: 'parent 2'
        }
      ],
      roleArr: [
        {
          title: 'parent 2'
        },
        {
          title: 'parent 1'
        }
      ]

    }
  },
  created () {},
  mounted () {
    this.getmenuPerm()
    this.getrolePerm(0)
    if (!objIsNull(this.$route.params)) {
      this.addorUpdate = false
      // 编辑
      const item = this.$route.params
      console.log('item', item)
      this.formItem.name = item.name
      this.formItem.roleKey = item.roleKey
      this.formItem.state = (item.state == '启用')
      // 菜单，角色
      this.data2 = []
      this.roleArr = []
    }
  },
  computed: {},
  watch: {},
  methods: {
    async editeFun () {
      // 收集 编辑数据
      const roleRegional = this.getArrId(this.$refs.roleTree.getCheckedNodes())
      const resourcesId = this.getArrId(this.$refs.menuTree.getCheckedNodes())

      const params = {
        id: this.$route.params.id,
        name: this.formItem.name,
        roleKey: this.formItem.roleKey,
        state: this.formItem.state ? 0 : 1,
        roleRegional,
        resourcesId
      }
      console.log('params', params)
      const { data: { code } } = await roleUpdate(params)
      if (code == 0) {
        this.$Message.success('操作成功')
        this.$router.push('/home/role')
      }
    },
    async getmenuPerm () {
      // 获取菜单权限
      const { data: { data, code } } = await menuPerm()
      if (code == 0) {
        if (data) {
          // 添加title
          // console.log(data)
          data.forEach(item => {
            item.title = item.name
          })
          const newdata = convert(data)
          initMenuArr = JSON.stringify(newdata)
          this.data2 = newdata
        }
      }
    },
    async getrolePerm (params) {
      // 获取角色权限
      const { data: { data, code } } = await rolePerm(params)
      if (code == 0) {
        if (data) {
          // console.log(data)
          data.forEach(item => {
            item.title = item.areaName
            item.loading = false
            item.children = []
          })
          initRoleArr = JSON.stringify(data)
          this.roleArr = data
        }
      }
    },
    async loadData (item, callback) {
    // 角色树形新增
      if (item) {
        const { data: { data, code } } = await rolePerm(item.id)
        if (code == 0) {
          if (data) {
            data.forEach(item => {
              item.title = item.areaName
              item.loading = false
              item.children = []
            })
            callback(data)
          }
        }
      }
    },
    async addhandle () {
      // 新增角色请求
      const roleRegional = this.getArrId(this.$refs.roleTree.getCheckedNodes())
      const resourcesId = this.getArrId(this.$refs.menuTree.getCheckedNodes())

      const params = {
        name: this.formItem.name,
        roleKey: this.formItem.roleKey,
        state: this.formItem.state ? 0 : 1,
        roleRegional,
        resourcesId
      }
      const { data: { code } } = await roleAdd(params)
      if (code == 0) {
        this.$Message.success('操作成功')
        this.$router.push('/home/role')
      }
    },
    clearFun () {
      // const roleArr = this.$refs.roleTree.getCheckedAndIndeterminateNodes()
      // const menuArr = this.$refs.menuTree.getCheckedAndIndeterminateNodes()

      this.data2 = JSON.parse(initMenuArr)
      this.roleArr = JSON.parse(initRoleArr)
      // this.getmenuPerm()
      // this.getrolePerm(0)

      this.formItem = {
        name: '',
        roleKey: '',
        state: true
      }
      // console.log(selArr)
      // console.log(this.data2)
    },
    // 清空tree多为数组
    _clearTree (arrTree) {
      arrTree.forEach(item => {
        item.checked = false
        item.expand = false
        if (Array.isArray(item.children)) {
          this._clearTree(item.children)
        }
      })
    },
    getArrId (arr) {
      // 取出数组每一项的id，组成一个新的数组
      const idArr = []
      arr.forEach(item => {
        idArr.push(item.id)
      })
      return idArr
    }
  }
}
</script>

<style lang='scss'>
.mg-role {
  position: relative;
  padding: 10px 20px 0px 20px;
  .return-btn{
    position: absolute;
    left: 30px;
    top: 20px;
  }
  .left{
    padding: 10px;
    background: #fff;
  }
  .tree-wrap{
    padding: 10px;
    margin: 0 auto 50px;
    display: flex;
    width: 1200px;
    height: 350px;
    overflow-y: auto;
    .lf{
      flex: 1;
      display: flex;
      .name{
        padding-top: 8px;
        color: #333;
      }
    }
    .rt{
      flex: 1;
      display: flex;
      .name{
        padding-top: 8px;
        color: #333;
      }
    }
  }
  .ivu-icon-ios-arrow-forward{
    color: #333;
  }
}
</style>
