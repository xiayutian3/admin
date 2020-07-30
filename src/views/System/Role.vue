<template>
  <div class='manage-r'>
    <PageTitle name="角色管理"/>
    <div class="operate">
      <div class="left">
        <KeyvalSearch name="角色名称"/>
      </div>
      <div class="right">
        <Button type="primary" @click="searchHandle">查询</Button>
        <Button @click="resetHandle">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">角色列表</div>
        <div class="btns">
          <Button type="primary" @click="$router.push('/home/editrole')">添加</Button>
          <!-- <Button>导入</Button> -->
        </div>
      </div>
      <div class="list">
        <Table stripe border :columns="columns1" :data="data1"></Table>
      </div>
    </div>
    <div class="page-wrap">
        <Page :total="pageTotal" show-total  @on-change="nextPage" />
    </div>
  </div>
</template>

<script>
import { roleList, roleDelete, roleUpdate } from '@/api/manage'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'manage-r',
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
          title: '角色名称',
          key: 'name'
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
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edite(params)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
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
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data1: [
      ],
      pageTotal: 0
    }
  },
  created () {},
  mounted () {
    this.initData()
  },
  computed: {},
  watch: {},
  methods: {
    async initData (params = '') {
      const { data: { data, code, total } } = await roleList(params)
      if (code === 0) {
        if (data) {
          const newData = this.dataFaomat(data)
          this.data1 = newData
          this.pageTotal = total
        } else {
          this.data1 = []
          this.pageTotal = 0
        }
      }
    },
    nextPage (pageNum) {
      console.log(pageNum)
      // 下一页
      this.initData({ pageNum })
    },
    resetHandle () {
      this.setsearchInp('')
      this.initData()
    },
    async searchHandle () {
      const searchParams = {
        name: this.searchInp
      }
      this.initData(searchParams)
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
    edite (item) {
      console.log(this.$route)
      this.$router.push({ name: 'editrole', params: item.row })
      // this.$Modal.info({
      // title: 'User Info',
      // content: `Name：${this.data1[index].name}<br>Age：${this.data1[index].age}<br>Address：${this.data1[index].address}`
      // })
    },
    async freezFun (item) {
      // console.log('item', item.row)
      const params = {
        id: item.row.id,
        state: item.row.state == '启用' ? 1 : 0,
        name: item.row.name,
        roleKey: item.row.roleKey,
        roleRegional: item.row.roleRegional,
        resourcesId: item.row.resourcesId
      }
      const { data: { code } } = await roleUpdate(params)
      if (code == 0) {
        if (item.row.state == '启用') {
          this.$Message.success('冻结成功')
        } else {
          this.$Message.success('解结成功')
        }
        this.initData()
      }
    },
    remove (id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '<p>请确认是否删除</p>',
        onOk: () => {
          roleDelete([id]).then(({ data: { code } }) => {
            if (code == 0) {
              this.$Message.success('删除成功')
              this.initData()
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
  .manage-r{
    padding: 10px 20px 0px 20px;
    .operate{
      margin-bottom: 10px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #e9e9e9;
      .left{

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
