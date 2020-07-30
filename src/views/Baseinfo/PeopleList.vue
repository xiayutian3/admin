<template>
  <div class="info-people">
    <PageTitle name="人员信息" />
    <div class="operate">
      <div class="left">
        <SelectDe name="小区" :marginL="0" :inputW="200" ref='ref4' :dataList="xiaoqu" @getSelectValue="getSelectValue2"/>
        <SelectDe name="人员类型" :marginL="20" :inputW="200" ref='ref1' :dataList="peopleType" @getSelectValue="getSelectValue"/>
        <CascaderLc name="门牌号" :marginL="20" ref='ref2' :dataList="doorNumber" @getCascaderValue="getCascaderValue"></CascaderLc>
        <DatePickerLc name="创建时间" type="datetimerange" ref='ref3' :marginL="20" :inputW="300" @getDateValue="getDateValue"></DatePickerLc>
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">人员列表</div>
        <div class="btns">
          <Button @click="exportLC">导出</Button>
        </div>
      </div>
      <div class="list">
        <Table stripe border :columns="columns1" :data="data1" @on-selection-change="selectIdArr"></Table>
      </div>
    </div>
    <div class="page-wrap">
      <Page :total="total" show-total @on-change="nextPage"/>
    </div>
  </div>
</template>

<script>
import { peopleList, peopleExport } from '@/api/info'
import { structList, unitList } from '@/api/building'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'info-people',
  mixins: [module1Mixin],
  data () {
    return {
      // 表头
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'xm'
        },
        {
          title: '手机号',
          key: 'lxdh'
        },
        {
          title: '身份证号',
          key: 'zjhm'
        },
        {
          title: '人员类型',
          key: 'rydjlx'
        },
        {
          title: '居住地址',
          key: 'dzmc'
        },
        {
          title: '车牌号',
          key: 'jdchphm'
        },
        {
          title: '创建时间',
          key: 'gxsj'
        }
      ],
      data1: [],
      total: 0,
      // 人员类型
      peopleType: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '业主'
        },
        {
          value: 2,
          label: '租户'
        },
        {
          value: 3,
          label: '商户'
        },
        {
          value: 4,
          label: '物业'
        },
        {
          value: 5,
          label: '政府部门'
        },
        {
          value: 6,
          label: '快递'
        },
        {
          value: 7,
          label: '重点人员'
        },
        {
          value: 9,
          label: '其他'
        }
      ],
      // 门牌号
      doorNumber: [],
      peopleTypeValue: '',
      xiaoquValue: '',
      doorValue: [],
      dateValue: [],
      idArr: []
    }
  },
  created () {
    this.getList({ pageNum: 1 })
    this.getHouse1()
    this.getvillage({ ssxqdm: this.$store.state.module1.areaId })
  },
  mounted () {},
  computed: {
    getshowIndex () {
      return this.$store.state.module1.areaId
    }
  },
  watch: {
    getshowIndex: function (newval, oldval) {
      console.log(newval)
      this.reset()
      this.getvillage({ ssxqdm: this.$store.state.module1.areaId })
    }
  },
  methods: {
    // 获取楼栋信息
    async getHouse1 () {
      const { data: { data, code } } = await structList()
      if (code == 0) {
        for (var i = 0; i < data.length; i++) {
          this.doorNumber.push({
            value: data[i].structId,
            label: data[i].structName
          })
          this.getHouse3({ structParentId: data[i].structId }, this.doorNumber[i])
        }
      }
    },
    // 获取具体单元，门牌
    async getHouse3 (parm, arr) {
      const { data: { data, code, total } } = await unitList(parm)
      if (code == 0 && total > 0) {
        arr.children = []
        for (var i = 0; i < data.length; i++) {
          arr.children.push({
            value: data[i].structId,
            label: data[i].structName
          })
          if (data[i].depth < 2) {
            this.getHouse3({ structParentId: data[i].structId }, arr.children[i])
          }
        }
      } else {
        return false
      }
    },

    // 根据页码获取列表信息
    async getList (parm) {
      // 重置选中的导出项为空
      this.idArr = []
      // 获取列表
      const { data: { data, code, total } } = await peopleList(parm)
      if (code == 0) {
        if (data) {
          this.data1 = this.dataFit(data)
          this.total = total
        } else {
          this.data1 = []
          this.total = 0
        }
      }
    },

    // 修改data数据
    dataFit (data) {
      const newData = data.map(item => {
        if (item.rydjlx == 0) {
          item.rydjlx = '全部'
        } else if (item.rydjlx == 1) {
          item.rydjlx = '业主'
        } else if (item.rydjlx == 2) {
          item.rydjlx = '租户'
        } else if (item.rydjlx == 3) {
          item.rydjlx = '商户'
        } else if (item.rydjlx == 4) {
          item.rydjlx = '物业'
        } else if (item.rydjlx == 5) {
          item.rydjlx = '政府部门'
        } else if (item.rydjlx == 6) {
          item.rydjlx = '快递'
        } else if (item.rydjlx == 7) {
          item.rydjlx = '重点人员'
        } else {
          item.rydjlx = '其他'
        }
        return item
      })
      return newData
    },

    // 下一页
    nextPage (pageNum) {
      this.getList({ pageNum: pageNum })
    },

    // 获取下拉值
    getSelectValue (data) {
      this.peopleTypeValue = data.val
    },

    getSelectValue2 (data) {
      this.xiaoquValue = data.val
    },

    // 获取门牌号
    getCascaderValue (data) {
      this.doorValue = data.val
    },

    // 获取创建时间段
    getDateValue (data) {
      this.dateValue = data.val
    },

    // 搜索
    async searchFun () {
      const searObj = {
        rydjlx: this.peopleTypeValue ? this.peopleTypeValue : '',
        xqxxbz: this.xiaoquValue ? this.xiaoquValue : '',
        ldxxbz: this.doorValue[0] ? this.doorValue[0] : '',
        dyxxbz: this.doorValue[1] ? this.doorValue[1] : '',
        fwxxbz: this.doorValue[2] ? this.doorValue[2] : '',
        startTime: this.dateValue[0] ? this.dateValue[0] : '',
        endTime: this.dateValue[1] ? this.dateValue[1] : '',
        pageNum: 1
      }
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.peopleTypeValue = ''
      this.xiaoquValue = ''
      this.doorValue = []
      this.dateValue = []
      this.$refs.ref1.reset()
      this.$refs.ref2.reset()
      this.$refs.ref3.reset()
      this.$refs.ref4.reset()
      this.getList({ pageNum: 1 })
    },
    selectIdArr (list) {
      // 导出相关，选中的项
      this.getSelectIdArr(list, 'ryxxbz')
    },
    exportLC () {
      // 导出相关，开始导出
      this.exportExcl(peopleExport)
    }
  }
}
</script>

<style lang="scss">
.info-people {
  padding: 10px 20px 0px 20px;
  .operate {
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e9e9e9;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .right {
      width: 150px;
      display: flex;
      justify-content: space-between;
    }
  }
  .content {
    padding: 10px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e9e9e9;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        color: #333;
      }
      .btns {
        width: 60px;
        display: flex;
        justify-content: space-between;
      }
    }
    .list {
      margin-top: 5px;
    }
  }
  .page-wrap {
    display: flex;
    justify-content: flex-end;
    color: #333;
  }
}
</style>
