<template>
  <div class="alarm-people">
    <PageTitle name="人员告警" />
    <div class="operate">
      <div class="left">
        <KeyvalSearch name="输入查询" :marginL="20" placeholder="姓名/车牌号" :inputW="200" />
        <DatePickerLc name="时段查询" type="datetimerange" :marginL="20" :inputW="300" ref='ref2' @getDateValue="getDateValue"></DatePickerLc>
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">告警列表</div>
        <div class="btns">
          <!-- <Button @click="exportLC">导出</Button> -->
        </div>
      </div>
      <div class="list">
        <Table stripe border :columns="columns1" :data="data1"></Table>
      </div>
    </div>
    <div class="page-wrap">
      <Page :total="total" show-total @on-change="nextPage"/>
    </div>
  </div>
</template>

<script>
import { peopleWarn } from '@/api/alarm'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'alarm-people',
  mixins: [module1Mixin],
  data () {
    return {
      columns1: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '姓名',
          // fixed: 'left',
          key: 'sbmc'
        },
        {
          title: '身份证号',
          // fixed: 'left',
          key: 'jdchphm'
        },
        {
          title: '手机号',
          key: 'cjsj'
        },
        {
          title: '车辆性质',
          key: 'cjsj'
        },
        {
          title: '车牌号',
          key: 'cjsj'
        },
        {
          title: '设备名称',
          key: 'cjsj'
        },
        {
          title: '设备编号',
          key: 'cjsj'
        },
        {
          title: '设备状态',
          key: 'cjsj'
        },
        {
          title: '通行地点',
          key: 'cjsj'
        },
        {
          title: '警预类型',
          key: 'cjsj'
        },
        {
          title: '预警时间',
          key: 'cjsj'
        },
        {
          title: '报警推送',
          key: 'cjsj'
        }
      ],
      data1: [],
      total: 0,
      // alarmType: [
      //   {
      //     value: 1,
      //     label: '人员告警'
      //   },
      //   {
      //     value: 2,
      //     label: '车辆告警'
      //   },
      //   {
      //     value: 3,
      //     label: '设备告警'
      //   }
      // ],
      // alarmTypeValue: '',
      xiaoquValue: '',
      dateValue: []
    }
  },
  created () {
    this.getList({ pageNum: 1 })
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
    // 根据页码获取列表信息
    async getList (pageNum) {
      // 获取列表
      const { data: { data, code, total } } = await peopleWarn(pageNum)
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
        // 人员类型
        if (item.peopleType == 0) {
          item.peopleType = '全部'
        } else if (item.peopleType == 1) {
          item.peopleType = '业主'
        } else if (item.peopleType == 2) {
          item.peopleType = '租户'
        } else if (item.peopleType == 3) {
          item.peopleType = '商户'
        } else if (item.peopleType == 4) {
          item.peopleType = '物业'
        } else if (item.peopleType == 5) {
          item.peopleType = '政府部门'
        } else if (item.peopleType == 6) {
          item.peopleType = '快递'
        } else if (item.peopleType == 7) {
          item.peopleType = '重点人员'
        } else {
          item.jcrylx = '其他'
        }

        // 告警类型
        if (item.type == 1) {
          item.type = '人员告警'
        } else if (item.type == 2) {
          item.type = '车辆告警'
        } else if (item.jcrylx == 3) {
          item.type = '设备告警'
        }
        return item
      })
      return newData
    },
    // 下一页
    nextPage (pageNum) {
      console.log(pageNum)
      this.getList({ pageNum })
    },
    // 获取下拉值
    // getSelectValue (data) {
    //   this.alarmTypeValue = data.val
    // },

    // 获取创建时间段
    getDateValue (data) {
      this.dateValue = data.val
    },
    // 搜索
    async searchFun () {
      const searObj = {
        xqxxbz: this.xiaoquValue ? this.xiaoquValue : '',
        str: this.searchInp,
        // type: this.alarmTypeValue ? this.alarmTypeValue : '',
        startTime: this.dateValue[0] ? this.dateValue[0] : '',
        endTime: this.dateValue[1] ? this.dateValue[1] : '',
        pageNum: 1
      }
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.setsearchInp('')
      this.xiaoquValue = ''
      // this.alarmTypeValue = ''
      this.dateValue = []
      // this.$refs.ref1.reset()
      this.$refs.ref2.reset()
      this.getList({ pageNum: 1 })
    }
  }
}
</script>

<style lang="scss">
.alarm-people {
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
