<template>
  <div class='manage-m'>
    <PageTitle name="菜单管理"/>
    <div class="operate">
      <div class="left">
        <KeyvalSearch name="菜单名称"/>
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">菜单列表</div>
        <div class="btns">
          <Button type="primary" @click="handleClick">添加</Button>
          <!-- <Button>导入</Button> -->
        </div>
      </div>
      <div class="list">
         <Table row-key="id" :columns="columns16" :data="data12" border></Table>
      </div>
    </div>
    <!-- <div class="page-wrap">
        <Page :total="100" show-total />
    </div> -->
    <EditMenu :addOrUpdate="addOrUpdate" @getListAgain="getListAgain" />
  </div>
</template>

<script>
import EditMenu from './EditMenu'
import { resourcesList, resourcesDelete, resourcesPidGetId } from '@/api/manage'
import { convert, getOneLevelMenu } from '@/utils/arr'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'manage-m',
  mixins: [module1Mixin],
  data () {
    return {
      columns16: [
        {
          title: '菜单名称',
          key: 'name',
          tree: true
        },
        {
          title: '权限标识',
          key: 'perms'
        },
        {
          title: '请求地址',
          key: 'url'
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
                    this.editeFun(params.row)
                  }
                }
              }, '编辑'),
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
                    this.addFun(params.row)
                  }
                }
              }, '新增'),
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
      data12: [],
      addOrUpdate: true // true-》新增，false->跟新
    }
  },
  created () {
    this.getList()
  },
  mounted () {},
  computed: {},
  watch: {},
  methods: {
    async getList (params = '') {
      const { data: { code, data } } = await resourcesList(params)
      if (code == 0) {
        if (data) {
          // 获取一级菜单
          const oneLevelMenu = getOneLevelMenu(data)
          this.setoneLevelMenu(oneLevelMenu)
          // 将菜单改成树状结构
          this.data12 = convert(data)
        } else {
          this.data12 = []
        }
      }
    },
    searchFun () {
      this.getList({ name: this.searchInp })
    },
    reset () {
      this.setsearchInp('')
      this.getList()
    },
    getListAgain () {
      this.addOrUpdate = true
      this.getList()
    },
    async addFun (item) {
      // 新增按钮
      this.seteditmenuShow(true)
      const { data: { code, data } } = await resourcesPidGetId({ pid: item.id })
      if (code === 0) {
        if (data) {
          this.seteditmenuParent(data)
        }
      }
    },
    async editeFun (item) {
      // 查找上级菜单 请求
      this.addOrUpdate = false
      const { data: { code, data } } = await resourcesPidGetId({ pid: item.pid })
      if (code === 0) {
        if (data) {
          this.seteditmenuParent(data)
        }
      }

      this.seteditmenuShow(true)
      this.seteditmenuItem(item)
      // this.$Modal.info({
      //   title: 'User Info',
      //   content: `Name：${this.data12[index].name}<br>Age：${this.data12[index].age}<br>Address：${this.data12[index].address}`
      // })
    },
    async remove (id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '<p>请确认是否删除</p>',
        onOk: () => {
          resourcesDelete([id]).then(({ data: { code } }) => {
            if (code == 0) {
              this.$Message.success('删除成功')
              this.getList()
            }
          })
        },
        onCancel: () => {
          this.$Message.info('已取消删除')
        }
      })
    },
    handleClick () {
      this.seteditmenuShow(true)
    }
  },
  components: {
    EditMenu
  }
}
</script>

<style lang='scss'>
  .manage-m{
    position: relative;
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
