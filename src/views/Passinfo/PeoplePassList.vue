<template>
  <div class="pass-people">
    <PageTitle name="通行信息" />
    <div class="operate">
      <div class="left">
        <SelectDe
          name="小区"
          :marginL="0"
          :inputW="200"
          ref="ref4"
          :dataList="xiaoqu"
          @getSelectValue="getSelectValue3"
        />
        <SelectDe
          name="人员类型"
          :inputW="200"
          :dataList="peopleType"
          ref="ref1"
          @getSelectValue="getSelectValue"
        />
        <SelectDe
          name="通行方向"
          :inputW="200"
          :dataList="direction"
          ref="ref2"
          @getSelectValue="getSelectValue2"
        />
        <DatePickerLc
          name="时段查询"
          type="datetimerange"
          :marginL="20"
          :inputW="300"
          ref="ref3"
          @getDateValue="getDateValue"
        ></DatePickerLc>
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">人员通行记录</div>
        <div class="btns">
          <Button @click="exportLC">导出</Button>
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
            <!-- <Button type="primary" size="small" v-for="idx in row.ldzpcjt.split(',')" style="margin-right: 5px" @click="show(row,index)" :key="idx">View</Button> -->
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
import { peoplePassList, peoplePassExport } from '@/api/pass'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'pass-people',
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
          key: 'xm'
        },
        {
          title: '身份证号',
          key: 'gmsfzhm',
          width: 200
        },
        {
          title: '手机号',
          key: 'lxdh'
        },
        {
          title: '人员类型',
          key: 'jcrylx'
        },
        {
          title: '设备名称',
          key: 'sbmc'
        },
        {
          title: '通行方向',
          key: 'jcfx'
        },
        {
          title: '通行时间',
          key: 'cjsj'
        },
        {
          title: '通行方式',
          key: 'kmfsdm'
        },
        {
          title: '设备编号',
          key: 'gldmj_cjsbxxbz'
        },
        {
          title: '现场照片',
          slot: 'action',
          align: 'center'
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
      xiaoquValue: '',
      dateValue: [],
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
      const {
        data: { data, code, total }
      } = await peoplePassList(pageNum)
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
        if (item.jcrylx == 0) {
          item.jcrylx = '全部'
        } else if (item.jcrylx == 1) {
          item.jcrylx = '业主'
        } else if (item.jcrylx == 2) {
          item.jcrylx = '租户'
        } else if (item.jcrylx == 3) {
          item.jcrylx = '商户'
        } else if (item.jcrylx == 4) {
          item.jcrylx = '物业'
        } else if (item.jcrylx == 5) {
          item.jcrylx = '政府部门'
        } else if (item.jcrylx == 6) {
          item.jcrylx = '快递'
        } else if (item.jcrylx == 7) {
          item.jcrylx = '重点人员'
        } else {
          item.jcrylx = '其他'
        }

        // 通行方向
        if (item.jcfx == 0) {
          item.jcfx = '出'
        } else if (item.jcfx == 1) {
          item.jcfx = '进'
        } else if (item.jcfx == -1) {
          item.jcfx = '未知'
        }

        // 通行方式
        if (item.kmfsdm == 1) {
          item.kmfsdm = '人脸'
        } else if (item.kmfsdm == 2) {
          item.kmfsdm = 'IC卡'
        } else if (item.kmfsdm == 3) {
          item.kmfsdm = 'app'
        } else if (item.kmfsdm == 4) {
          item.kmfsdm = '尾随'
        } else if (item.kmfsdm == 5) {
          item.kmfsdm = '跟随'
        } else if (item.kmfsdm == 6) {
          item.kmfsdm = '人工'
        } else {
          item.kmfsdm = '其他'
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

    // 获取下拉值
    getSelectValue2 (data) {
      this.directionValue = data.val
    },
    getSelectValue3 (data) {
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
        jcrylx: this.peopleTypeValue ? this.peopleTypeValue : '',
        jcfx: this.directionValue ? this.directionValue : '',
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
      this.directionValue = ''
      this.dateValue = []
      this.$refs.ref1.reset()
      this.$refs.ref2.reset()
      this.$refs.ref3.reset()
      this.$refs.ref4.reset()
      this.getList({ pageNum: 1 })
    },
    selectIdArr (list) {
      // 导出相关，选中的项
      this.getSelectIdArr(list, 'mjjcjlxxbz')
    },
    exportLC () {
      // 导出相关，开始导出
      this.exportExcl(peoplePassExport)
    }
  }
}
</script>

<style lang="scss">
.pass-people {
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
