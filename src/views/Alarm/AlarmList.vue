<template>
  <div class="alarm-list">
    <PageTitle name="告警管理" />
    <div class="operate">
      <div class="left">
        <SelectDe name="小区" :marginL="0" :inputW="200" ref='ref4' :dataList="xiaoqu" @getSelectValue="getSelectValue2"/>
        <KeyvalSearch name="输入查询" :marginL="20" placeholder="模糊查询" :inputW="200" />
        <SelectDe name="告警类型" :inputW="200" :dataList="alarmType" ref='ref1' @getSelectValue="getSelectValue"/>
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
import { alarmList } from '@/api/alarm'
import { villageList } from '@/api/village'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'alarm-list',
  mixins: [module1Mixin],
  data () {
    return {
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '人员类型',
          key: 'peopleType'
        },
        {
          title: '车牌',
          key: 'carid'
        },
        {
          title: '告警类型',
          key: 'type'
        },
        {
          title: '设备名称',
          key: 'devicename'
        },
        {
          title: '预警时间',
          key: 'createDate'
        }
      ],
      data1: [],
      total: 0,
      alarmType: [
        {
          value: 1,
          label: '人员告警'
        },
        {
          value: 2,
          label: '车辆告警'
        },
        {
          value: 3,
          label: '设备告警'
        }
      ],
      // 小区
      xiaoqu: [],
      alarmTypeValue: '',
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
    // 获取小区信息
    async getvillage (params) {
      const { data: { data, code } } = await villageList(params)
      if (code == 0) {
        const newArr = []
        for (var i = 0; i < data.length; i++) {
          newArr.push({
            value: data[i].xqxxbz,
            label: data[i].jlxxqmc
          })
        }
        this.xiaoqu = newArr
      }
    },
    // 根据页码获取列表信息
    async getList (pageNum) {
      // 获取列表
      const { data: { data, code, total } } = await alarmList(pageNum)
      if (code == 0) {
        this.data1 = this.dataFit(data)
        this.total = total
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
    getSelectValue (data) {
      this.alarmTypeValue = data.val
    },
    getSelectValue2 (data) {
      this.xiaoquValue = data.val
    },

    // 获取创建时间段
    getDateValue (data) {
      this.dateValue = data.val
    },
    // 搜索
    async searchFun () {
      const searObj = {
        xqxxbz: this.xiaoquValue ? this.xiaoquValue : '',
        str: this.searchInp,
        type: this.alarmTypeValue ? this.alarmTypeValue : '',
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
      this.alarmTypeValue = ''
      this.dateValue = []
      this.$refs.ref1.reset()
      this.$refs.ref2.reset()
      this.$refs.ref4.reset()
      this.getList({ pageNum: 1 })
    }
  }
}
</script>

<style lang="scss">
.alarm-list {
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
