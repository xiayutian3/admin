<template>
  <div class="pass-car">
    <PageTitle name="通行信息" />
    <div class="operate">
      <div class="left">
        <KeyvalSearch style="margin-bottom:10px" :marginL="20" name="输入查询" placeholder="姓名/身份证号/车牌号/手机号" :inputW="200"/>
        <SelectDe
        style="margin-bottom:10px"
          name="车辆类型"
          :inputW="200"
          :dataList="carType"
          ref="ref1"
          @getSelectValue="getSelectValue"
        />
        <SelectDe
        style="margin-bottom:10px"
          name="通行方向"
          :inputW="200"
          :dataList="direction"
          ref="ref2"
          @getSelectValue="getSelectValue2"
        />
        <DatePickerLc
        style="margin-bottom:10px"
          name="时段查询"
          type="datetimerange"
          :marginL="20"
          :inputW="300"
          ref="ref3"
          @getDateValue="getDateValue"
        ></DatePickerLc>
        <!-- <div class="pass-area">
          <span class="area">通行地点</span>
          <Cascader placeholder="请选择区域" :data="dataCascader" @on-change="hangdleCascader" :load-data="loadDataArea"></Cascader>
        </div> -->

      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">车辆通行列表</div>
        <div class="btns">
          <!-- <Button @click="exportLC" style="margin-right: 0px">导出</Button> -->
        </div>
      </div>
      <div class="list">
        <Table stripe border :columns="columns1" :data="data1" @on-selection-change="selectIdArr">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="modalImgShow(row,index)"
            >查看</Button>
          </template>
        </Table>
      </div>
    </div>
    <div class="page-wrap">
      <Page :total="total" show-total @on-change="nextPage" />
    </div>
    <ViewImage :imgList="modalImgList" :viewShow="modalViewShow" @viewClose="modalViewClose" />
  </div>
</template>

<script>
// import { carPassList, carPassExport } from '@/api/pass'
import { carPassList, carPassExport } from '@/api/pass'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'pass-car',
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
          title: '身份证号',
          key: 'cz_gmsfzhm'
        },
        {
          title: '手机号',
          key: 'cz_lxdh'
        },
        {
          title: '车辆性质',
          key: 'jdccllxdm'
        },
        {
          title: '车牌号',
          key: 'jdchphm'
        },
        {
          title: '通行地点',
          key: 'dzmc'
        },
        {
          title: '通行方向',
          key: 'gcfx'
        },
        {
          title: '通行时间',
          key: 'cjsj'
        },
        {
          title: '现场照片',
          slot: 'action',
          align: 'center'
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
      direction: [
        {
          value: 0,
          label: '出'
        },
        {
          value: 1,
          label: '进'
        },
        {
          value: -1,
          label: '未知'
        }
      ],
      peopleTypeValue: '',
      directionValue: '',
      // dataCascader: [],   //通行地点选择
      dateValue: [],
      idArr: [],
      selectList: []
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

    // async initDataArea (params) {
    // 头部地区选择框
    // const { data: { code, data } } = await baseAreaTree(params)
    // if (code == 0) {
    //   data.forEach(item => {
    //     item.label = item.areaName
    //     item.value = item.id
    //     item.loading = false
    //     item.children = []
    //   })
    //   this.dataCascader = data
    // }
    // },
    // 通行地点异步数据
    // async loadDataArea (item, callback) {
    // item.loading = false

    // const { data: { code, data } } = await baseAreaTree(item.id)
    // if (code == 0) {
    //   item.loading = false
    //   data.forEach(item => {
    //     item.label = item.areaName
    //     item.value = item.id
    //     if (item.childCount !== 0) {
    //       item.loading = false
    //       item.children = []
    //     }
    //   })
    //   item.children = data
    //   callback()
    // }
    // },

    // 根据页码获取列表信息
    async getList (pageNum) {
      // 重置选中的导出项为空
      this.idArr = []
      // 获取列表
      const {
        data: { data, code, total }
      } = await carPassList(pageNum)
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
        if (item.jdccsysdm == 1) {
          item.jdccsysdm = '白色'
        } else if (item.jdccsysdm == 2) {
          item.jdccsysdm = '银色'
        } else if (item.jdccsysdm == 3) {
          item.jdccsysdm = '黄色'
        } else if (item.jdccsysdm == 4) {
          item.jdccsysdm = '红色'
        } else if (item.jdccsysdm == 5) {
          item.jdccsysdm = '蓝色'
        } else if (item.jdccsysdm == 6) {
          item.jdchpysdm = '绿色'
        } else if (item.jdccsysdm == 7) {
          item.jdccsysdm = '黑色'
        } else {
          item.jdccsysdm = '其他'
        }

        // 通行方向
        if (item.gcfx == 0) {
          item.gcfx = '出'
        } else if (item.gcfx == 1) {
          item.gcfx = '进'
        } else if (item.gcfx == -1) {
          item.gcfx = '未知'
        }

        // 通行方式
        if (item.jsfs == 1) {
          item.jsfs = '车辆识别'
        } else if (item.jsfs == 2) {
          item.jsfs = '人工'
        } else {
          item.kmfsdm = '其他'
        }
        return item
      })
      return newData
    },

    // 下一页
    nextPage (pageNum) {
      this.getList({ pageNum })
    },

    // 获取下拉值
    getSelectValue (data) {
      this.peopleTypeValue = data.val
    },

    // 获取下拉值
    getSelectValue2 (data) {
      this.directionValue = data.val
    },

    // 获取创建时间段
    getDateValue (data) {
      this.dateValue = data.val
    },
    // 搜索
    async searchFun () {
      const searObj = {
        str: this.searchInp,
        jdccllxdm: this.peopleTypeValue ? this.peopleTypeValue : '',
        gcfx: this.directionValue ? this.directionValue : '',
        startTime: this.dateValue[0] ? this.dateValue[0] : '',
        endTime: this.dateValue[1] ? this.dateValue[1] : '',
        pageNum: 1
      }
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.peopleTypeValue = ''
      this.directionValue = ''
      this.dateValue = []
      this.setsearchInp('')
      this.$refs.ref1.reset()
      this.$refs.ref2.reset()
      this.$refs.ref3.reset()
      this.getList({ pageNum: 1 })
    },
    selectIdArr (list) {
      // 导出相关，选中的项(后台导出功能)
      this.getSelectIdArr(list, 'jdcgcxxbz')

      // 改为前端导出
      // this.selectList = list
    },
    exportLC () {
      // 导出相关，开始导出(后台导出功能)
      this.exportExcl(carPassExport)

      // 改为前端到处功能
      // if (this.selectList.length === 0) {
      //   return this.$Message.info('请选择数据导出')
      // }
      // const header = ['姓名', '身份证', '手机号', '车辆性质', '车牌号', '通行地点', '通行方向', '通行时间']
      // const filterval = ['cz_xm', 'cz_gmsfzhm', 'cz_lxdh', 'jdccllxdm', 'jdchphm', 'sbmc', 'gcfx', 'cjsj']
      // const filename = '导出文件'
      // const res = this.selectList
      // this.frontGetExcel(header, filterval, filename, res)
    }
    // hangdleCascader (selectArr) {
    // 通行地点选择
    // const lastId = selectArr.pop()
    //
    // }
  }
}
</script>

<style lang="scss">
.pass-car {
  padding: 10px 20px 0px 20px;
  .operate {
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    // align-items: center;
    border: 1px solid #e9e9e9;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .pass-area{
        margin-bottom: 10px;
        margin-left: 20px;
        display: flex;
        align-items: center;
        .area{
          margin-right: 5px;
          color: #999;
        }
      }
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
