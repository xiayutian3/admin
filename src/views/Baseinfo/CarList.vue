<template>
  <div class="info-car">
    <PageTitle name="车辆信息" />
    <div class="operate">
      <div class="left">
        <SelectDe name="小区" :marginL="0" :inputW="200" ref='ref4' :dataList="xiaoqu" @getSelectValue="getSelectValue2"/>
        <KeyvalSearch name="车牌号" placeholder="" :marginL="20" :inputW="200"/>
        <SelectDe name="车牌类型" :inputW="200" :dataList="carType" ref='ref1' @getSelectValue="getSelectValue"/>
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">车辆列表</div>
        <div class="btns">
          <Button @click="exportLC">导出</Button>
        </div>
      </div>
      <div class="list">
        <Table stripe border :columns="columns1" :data="data1" @on-selection-change="selectIdArr"></Table>
      </div>
    </div>
    <div class="page-wrap">
      <Page :total="total" show-total @on-change="nextPage" />
    </div>
  </div>
</template>

<script>
import { carList, carExport } from '@/api/info'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'info-car',
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
          key: 'cz_xm'
        },
        {
          title: '手机号',
          key: 'cz_lxdh'
        },
        {
          title: '车牌号',
          key: 'jdchphm'
        },
        {
          title: '车辆类型',
          key: 'jdccllxdm'
        },
        {
          title: '号牌种类',
          key: 'jdchpzldm'
        },
        {
          title: '车辆颜色',
          key: 'jdchpysdm'
        },
        {
          title: '创建时间',
          key: 'gxsj'
        }
      ],
      data1: [],
      total: 0,
      carType: [
        {
          value: 1,
          label: '内部车辆'
        },
        {
          value: 2,
          label: '外部车辆'
        },
        {
          value: 3,
          label: '政企车辆'
        },
        {
          value: 9,
          label: '其他'
        }
      ],
      carTypeValue: '',
      xiaoquValue: '',
      idArr: []
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
      // 重置选中的导出项为空
      this.idArr = []
      // 获取列表
      const { data: { data, code, total } } = await carList(pageNum)
      // console.log(data)
      // console.log(code)
      // console.log(total)
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
        // 车辆类型
        if (item.jdccllxdm == 1) {
          item.jdccllxdm = '内部车辆'
        } else if (item.jdccllxdm == 2) {
          item.jdccllxdm = '外部车辆'
        } else if (item.jdccllxdm == 3) {
          item.jdccllxdm = '政企车辆'
        } else {
          item.jdccllxdm = '其他'
        }
        // 号牌种类
        if (item.jdchpzldm == 1) {
          item.jdchpzldm = '蓝牌'
        } else if (item.jdchpzldm == 2) {
          item.jdchpzldm = '绿牌'
        } else if (item.jdchpzldm == 3) {
          item.jdchpzldm = '黄牌'
        } else if (item.jdchpzldm == 4) {
          item.jdchpzldm = '黑牌'
        } else if (item.jdchpzldm == 5) {
          item.jdchpzldm = '白牌'
        } else if (item.jdchpzldm == 6) {
          item.jdchpzldm = '警车'
        } else if (item.jdchpzldm == 7) {
          item.jdchpzldm = '军车'
        }
        // 车辆颜色
        if (item.jdchpysdm == 1) {
          item.jdchpysdm = '白色'
        } else if (item.jdchpysdm == 2) {
          item.jdchpysdm = '银色'
        } else if (item.jdchpysdm == 3) {
          item.jdchpysdm = '黄色'
        } else if (item.jdchpysdm == 4) {
          item.jdchpysdm = '红色'
        } else if (item.jdchpysdm == 5) {
          item.jdchpysdm = '蓝色'
        } else if (item.jdchpysdm == 6) {
          item.jdchpysdm = '绿色'
        } else if (item.jdchpysdm == 7) {
          item.jdchpysdm = '黑色'
        } else {
          item.jdchpysdm = '其他'
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
      this.carTypeValue = data.val
    },
    getSelectValue2 (data) {
      this.xiaoquValue = data.val
    },
    // 搜索
    async searchFun () {
      const searObj = {
        jdccllxdm: this.carTypeValue ? this.carTypeValue : '',
        xqxxbz: this.xiaoquValue ? this.xiaoquValue : '',
        jdchphm: this.searchInp,
        pageNum: 1
      }
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.carTypeValue = ''
      this.xiaoquValue = ''
      this.$refs.ref1.reset()
      this.setsearchInp('')
      this.$refs.ref4.reset()
      this.getList({ pageNum: 1 })
    },
    selectIdArr (list) {
      // 导出相关，选中的项
      this.getSelectIdArr(list, 'jdcxxbz')
    },
    exportLC () {
      // 导出相关，开始导出
      this.exportExcl(carExport)
    }

  }
}
</script>

<style lang="scss">
.info-car {
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
