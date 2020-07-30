<template>
  <div class="alarm-car">
    <PageTitle name="车辆告警" />
    <div class="operate">
      <div class="left">
        <!-- <KeyvalSearch name="输入查询" :marginL="20" placeholder="姓名/车牌号" :inputW="200" /> -->
        <SelectDe name="告警类型" :inputW="200" :dataList="carType" ref='ref1' @getSelectValue="getSelectValue"/>
        <DatePickerLc
          name="时段查询"
          type="datetimerange"
          :marginL="20"
          :inputW="300"
          ref="ref2"
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
        <div class="name">告警列表</div>
        <div class="btns">
          <!-- <Button @click="exportLC">导出</Button> -->
        </div>
      </div>
      <div class="list">
        <Table stripe border :columns="columns1" :data="data1">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="modalImgShow(row,index)"
            >查看</Button>
            <Button
              :type="row.sfcl == 0?'error':'primary'"
              style="margin-right: 5px"
              size="small"
              @click="handle(row,index)"
            >{{row.sfcl == 0?'待处置':'已处置'}}</Button>
            <!-- <Button type="error" size="small" @click="deleteFun(row,index)">删除</Button> -->
          </template>
        </Table>
      </div>
    </div>
    <div class="page-wrap">
      <Page :total="total" show-total @on-change="nextPage" />
    </div>
    <Modal v-model="modal1" title="请确认车辆是否已经处理" @on-ok="ok" @on-cancel="cancel" @before-upload="importBef">
      <p>
        车辆：
        <span class="car-num">{{editItem.jdchphm}}</span> 是否已经处置完毕？
      </p>
    </Modal>
    <ViewImage :imgList="modalImgList" :viewShow="modalViewShow" @viewClose="modalViewClose" />
  </div>
</template>

<script>
import { carWarn, carEdit, carDelete } from '@/api/alarm'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'alarm-car',
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
          title: '设备名称',
          key: 'sbmc'
        },
        {
          title: '设备编号',
          key: 'cjsbxxbz'
        },
        {
          title: '车辆号码',
          key: 'jdchphm'
        },
        {
          title: '告警类型',
          key: 'clgjxxlx'
        },
        {
          title: '告警次数',
          key: 'gjcs'
        },
        {
          title: '采集时间',
          key: 'cjsj'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      carType: [
        // {
        //   value: 'null',
        //   label: '全部'
        // },
        {
          value: '1',
          label: '频繁夜出'
        },
        {
          value: '2',
          label: '僵尸车'
        },
        {
          value: '3',
          label: '昼伏夜出'
        },
        {
          value: '4',
          label: '临时车频繁出入'
        },
        {
          value: '5',
          label: '已登记长时间未出现'
        },
        {
          value: '6',
          label: '夜不归宿'
        }
      ],
      carTypeValue: '',
      data1: [],
      total: 0,
      dateValue: [],
      modal1: false,
      editItem: '',
      file: '' // 上传的文件
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
      const {
        data: { data, code, total }
      } = await carWarn(pageNum)
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
    getSelectValue (data) {
      this.carTypeValue = data.val
    },
    // 获取创建时间段
    getDateValue (data) {
      this.dateValue = data.val
    },
    // 搜索
    async searchFun () {
      const searObj = {
        str: this.searchInp,
        clgjxxlx: this.carTypeValue ? this.carTypeValue : '',
        startTime: this.dateValue[0] ? this.dateValue[0] : '',
        endTime: this.dateValue[1] ? this.dateValue[1] : '',
        pageNum: 1
      }
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.setsearchInp('')
      // this.alarmTypeValue = ''
      this.dateValue = []
      this.$refs.ref1.reset()
      this.$refs.ref2.reset()
      this.getList({ pageNum: 1 })
    },
    handle (row, index) {
      // 待处置或已处置
      this.editItem = row
      this.modal1 = !this.modal1
    },
    async ok () {
      // 已处理
      this.editItem.clgjxxlx = this.changeCarType(
        this.editItem.clgjxxlx.clgjxxlx
      )
      this.editItem.sfcl = 1
      const {
        data: { code }
      } = await carEdit(this.editItem)
      if (code == 0) {
        this.$Message.info('处理成功')
        this.getList({ pageNum: 1 })
      }
    },
    async deleteFun (item) {
      // 删除
      const params = {
        ids: item.clgjxxbz
      }
      this.$Modal.confirm({
        title: '删除操作',
        content: '<p>您确认删除吗？</p>',
        onOk: () => {
          carDelete(params).then(({ data: { code } }) => {
            if (code == 0) {
              this.getList({ pageNum: 1 })
              this.$Message.info('删除成功')
            }
          })
        },
        onCancel: () => {
          this.$Message.info('已取消')
        }
      })
    },
    cancel () {
      this.$Message.info('已取消操作')
      this.editItem = ''
    },
    // 处理车辆告警类型转换
    changeCarType (val) {
      let res
      switch (val) {
        case '频繁夜出':
          res = '1'
          break
        case '僵尸车':
          res = '2'
          break
        case '昼伏夜出':
          res = '3'
          break
        case '临时车频繁出入':
          res = '4'
          break
        case '已登记长时间未出现':
          res = '5'
          break
        case '夜不归宿':
          res = '6'
          break
      }
      return res
    }
  }
}
</script>

<style lang="scss">
.alarm-car {
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
.car-num {
  font-size: 16px;
  font-weight: 600;
}
</style>
