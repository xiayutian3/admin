<template>
  <div class='manage-user'>
    <PageTitle name="用户管理"/>
    <div class="operate">
      <div class="left">
        <KeyvalSearch name="输入查询" placeholder="姓名/账号/手机/"/>
        <!-- <SelectDe name="用户类型"/> -->
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">用户列表</div>
        <div class="btns">
          <Button type="primary" @click="$router.push('/home/edituser')">添加</Button>
          <!-- <Button>导入</Button> -->
        </div>
      </div>
      <div class="list">
        <Table stripe border :columns="columns1" :data="data1"></Table>
      </div>
    </div>
    <div class="page-wrap">
        <Page :total="total" show-total @on-change="nextPage"  />
    </div>
  </div>
</template>

<script>
import { userList, userDelete, userUpdate, updatePassword } from '@/api/manage'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'manage-user',
  mixins: [module1Mixin],
  data () {
    return {
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名称',
          key: 'username'
        },
        {
          title: '创建时间',
          key: 'createtime'
        },
        {
          title: '状态',
          key: 'state'
        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: params.row.username == 'admin'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editeFun(params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: params.row.username == 'admin'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.initPwd(params.row)
                  }
                }
              }, '密码初始化'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: params.row.username == 'admin'
                },
                style: {
                  marginRight: '5px'
                },
                attrs: {
                  id: 'freez'
                },
                on: {
                  click: () => {
                    this.freezFun(params)
                  }
                }
              }, params.row.state == '冻结' ? '解冻' : '冻结'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: params.row.username == 'admin'
                },
                on: {
                  click: () => {
                    this.remove(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data1: [],
      total: 0
    }
  },
  created () {
    this.getDataList(0)
  },
  mounted () {
  },
  computed: {},
  watch: {},
  methods: {
    async getDataList (pageNum) {
      // 获取列表
      const { data: { data, code, total } } = await userList(pageNum)
      if (code == 0) {
        if (data) {
          this.data1 = this.dataFaomat(data)
          this.total = total
        } else {
          this.data1 = []
          this.total = 0
        }
      }
    },
    editeFun (params) {
      this.$router.push({ name: 'edituser', params })
    },
    async initPwd (item) {
      // 密码初始化
      const obj = {
        username: item.username,
        password: 111111,
        id: item.id
      }
      const { data: { code } } = await updatePassword(obj)
      if (code == 0) {
        this.$Message.success('密码初始化成功')
        this.getDataList(0)
      }
    },
    async freezFun (item) {
      // console.log('item', item.row)
      const params = {
        id: item.row.id,
        state: item.row.state == '启用' ? 1 : 0,
        username: item.row.username,
        password: item.row.password,
        pageSize: item.row.pageSize,
        pageNum: item.row.pageNum,
        createtime: item.row.createtime
      }
      const { data: { code } } = await userUpdate(params)
      if (code == 0) {
        if (item.row.state == '启用') {
          this.$Message.success('冻结成功')
        } else {
          this.$Message.success('解结成功')
        }
        this.getDataList(0)
      }
    },
    dataFaomat (data) {
      const newData = data.map(item => {
        if (item.state == 0) {
          item.state = '启用'
        } else {
          item.state = '冻结'
        }
        return item
      })
      return newData
    },
    nextPage (pageNum) {
      console.log(pageNum)
      // 下一页
      this.getDataList({ pageNum })
    },
    async searchFun () {
      const searObj = {
        str: this.searchInp
      }
      const { data: { data, code, total } } = await this.getDataList(searObj)
      if (code == 0) {
        this.data1 = data
        this.total = total
      }
    },
    reset () {
      this.setsearchInp('')
    },
    async remove (item) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '<p>请确认是否删除</p>',
        onOk: () => {
          const id = [item.id]
          userDelete(id).then(({ data: { code } }) => {
            if (code == 0) {
              this.$Message.success('删除成功')
              this.getDataList(0)
            }
          })
        },
        onCancel: () => {
          this.$Message.info('已取消删除')
        }
      })
    }
  }
}
</script>

<style lang='scss'>
  .manage-user{
    padding: 10px 20px 0px 20px;
    .operate{
      margin-bottom: 10px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #e9e9e9;
      .left{
        flex: 1;
        display: flex;
        align-items: center;
      }
      .right{
        width: 150px;
        display: flex;
        justify-content: space-between;
      }
    }
    .content{
      padding: 10px;
      display: flex;
      flex-direction: column;
      border: 1px solid #e9e9e9;
      .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name{
          color: #333;
        }
        .btns{
          width: 150px;
          display: flex;
          justify-content: space-between;
        }
      }
      .list{
        margin-top: 5px;
      }
    }
    .page-wrap{
      display: flex;
      justify-content: flex-end;
      color: #333;
    }
  }
</style>
