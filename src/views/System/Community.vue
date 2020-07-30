<template>
  <div class='manage-com'>
    <PageTitle name="小区管理"/>
    <div class="operate">
      <div class="left">
        <KeyvalSearch name="输入查询" placeholder="小区名称"/>
        <!-- <SelectDe name="用户类型"/> -->
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">小区列表</div>
        <div class="btns">
          <Button type="primary" @click="$router.push('/home/editcommunity')">添加</Button>
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
import { listVillage, deleteVillage } from '@/api/manage'
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
          title: '小区名称',
          key: 'jlxxqmc'
        },
        {
          title: '小区信息标识',
          key: 'xqxxbz'
        },
        {
          title: '小区地址',
          key: 'dzmc'
        },
        {
          title: '使用状态',
          key: 'syztdm'
        },
        {
          title: '小区启用日期',
          key: 'xqqy_rq'
        },
        {
          title: '物业公司名称',
          key: 'xqwygs_dwmc'
        },
        {
          title: '所属区域名称',
          key: 'ssxqmc'
        },
        {
          title: '所属区域代码',
          key: 'ssxqdm'
        },
        {
          title: '所属警务站名称',
          key: 'zaglxxssjwzrqmc'
        },
        {
          title: '所属警务站代码',
          key: 'zaglxxssjwzrqdm'
        },
        {
          title: '操作',
          key: 'action',
          width: 140,
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
                  type: 'error',
                  size: 'small'
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
      const { data: { data, code, total } } = await listVillage(pageNum)
      if (code == 0) {
        if (data) {
          this.data1 = data.map(item => {
            item.syztdm = item.syztdm == 0 ? '使用中' : '未使用'
            return item
          })
          this.total = total
        } else {
          this.data1 = []
          this.total = 0
        }
      }
    },
    editeFun (params) {
      this.$router.push({ name: 'editcommunity', params })
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
          const id = [item.xqxxbz]
          deleteVillage(id).then(({ data: { code } }) => {
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
  .manage-com{
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
