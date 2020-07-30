<template>
  <div class="vehicle-file">
    <PageTitle name="车辆档案" />
    <div class="operate">
      <div class="left">
        <KeyvalSearch name="关键字查询" placeholder="车牌号/姓名/手机号/身份证" :marginL="20" :inputW="300" />
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">车辆检索</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <Tabs :value="tabPane">
        <TabPane label="车辆档案" name="name1">
          <h3 style="margin-bottom:10px">车辆基本信息</h3>
          <div class="tabPane1">
            <div class="list">
              <div class="cont ">车牌号码</div>
              <div class="cont"></div>
              <div class="cont ">车辆类型</div>
              <div class="cont"></div>
              <div class="cont ">使用性质</div>
              <div class="cont"></div>
              <div class="cont ">车辆所有人</div>
              <div class="cont"></div>
            </div>
            <div class="list">
              <div class="cont ">购车时间</div>
              <div class="cont"></div>
              <div class="cont ">购车价格(万元)</div>
              <div class="cont"></div>
              <div class="cont ">发动机排量</div>
              <div class="cont"></div>
              <div class="cont ">油箱容积(升)</div>
              <div class="cont"></div>
            </div>
             <div class="list">
              <div class="cont ">品牌型号</div>
              <div class="cont"></div>
              <div class="cont">卖车单位</div>
              <div class="cont"></div>
            </div>
             <div class="list">
              <div class="cont ">整备质量</div>
              <div class="cont"></div>
              <div class="cont ">总质量</div>
              <div class="cont"></div>
              <div class="cont ">核定载人数</div>
              <div class="cont"></div>
              <div class="cont ">车体颜色</div>
              <div class="cont"></div>
            </div>
            <div class="list">
              <div class="cont ">变速器形式</div>
              <div class="cont"></div>
              <div class="cont ">是否涡轮增压</div>
              <div class="cont"></div>
              <div class="cont ">发动机号码</div>
              <div class="cont"></div>
              <div class="cont ">保养周期</div>
              <div class="cont"></div>
            </div>
            <div class="list">
              <div class="cont ">车辆识别代号</div>
              <div class="cont"></div>
              <div class="cont">年检时间</div>
              <div class="cont"></div>
            </div>
            <div class="list">
              <div class="cont ">注册登记日期</div>
              <div class="cont"></div>
              <div class="cont">发证日期</div>
              <div class="cont"></div>
            </div>
          </div>
          <h3 style="margin-bottom:10px;margin-top:20px">车辆所有人信息</h3>
          <Table border :columns="columnsPen" :data="dataPen"></Table>
          <h3 style="margin-bottom:10px;margin-top:20px">车辆档案图片</h3>
          <div class="pics">
            <div class="pic"><img src="../../assets/logo.png" alt="" srcset=""></div>
            <div class="pic"></div>
            <div class="pic"></div>
            <div class="pic"></div>
            <div class="pic"></div>
          </div>
        </TabPane>
        <TabPane label="车辆通行记录" name="name2">
          <h3 style="margin-bottom:10px">车辆通行轨迹</h3>
          <div class="title">
          <DatePickerLc
            name="时段查询"
            type="datetimerange"
            :marginL="20"
            :inputW="300"
            ref="ref3"
            @getDateValue="getDateValue"
          ></DatePickerLc>
            <div class="btns">
              <Button @click="checkFun">查询</Button>
            </div>
          </div>
          <div class="list">
            <Table
              border
              :columns="columnsCar"
              :data="dataCar"
            >
            </Table>
          </div>
          <div class="page-wrap">
            <Page :total="total" show-total @on-change="nextPage" />
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>

import { objIsNull } from '@/utils/obj'
import { carPassList } from '@/api/pass'
export default {
  name: 'vehicle-file',
  data () {
    return {
      tabPane: '',
      columnsPen: [
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '身份证号',
          key: 'age'
        },
        {
          title: '手机号',
          key: 'address'
        },
        {
          title: '户籍',
          key: 'address'
        },
        {
          title: '家庭住址',
          key: 'address'
        },
        {
          title: '是否业主',
          key: 'address'
        },
        {
          title: '备注',
          key: 'address'
        }
      ],
      dataPen: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ],
      columnsCar: [
        {
          title: '车牌号',
          key: 'jdchphm'
        },
        {
          title: '通行时间',
          key: 'cjsj'
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
          title: '设备名称',
          key: 'dzmc'
        }
        // {
        //   title: '停留时长',
        //   key: 'age'
        // },
        // {
        //   title: '备注',
        //   key: 'address'
        // }
      ],
      dataCar: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        }
      ],
      total: 0,
      dateValue: []
    }
  },
  created () {
    if (!objIsNull(this.$route.query)) {
      this.tabPane = this.$route.query.tabpaneName
      const jdchphm = this.$route.query.jdchphm
      this.getList({ pageNum: 1, jdchphm: jdchphm })
    }
  },
  mounted () {
    // this.getList({ pageNum: 1 })
  },
  computed: {},
  watch: {},
  methods: {
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
          this.dataCar = this.dataFit(data)
          this.total = total
        } else {
          this.dataCar = []
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
    checkFun () {
      // 车辆通行记录查询（时间）
      const searObj = {
        startTime: this.dateValue[0] ? this.dateValue[0] : '',
        endTime: this.dateValue[1] ? this.dateValue[1] : '',
        pageNum: 1
      }
      this.getList(searObj)
    },
    searchFun () {
      // 查询(车辆检索按钮)
      const searObj = {
        str: this.$store.state.module1.searchInp
      }
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.$store.dispatch('setsearchInp', '')
      this.getList({ pageNum: 1 })
    },
    // 获取创建时间段
    getDateValue (data) {
      this.dateValue = data.val
    },
    // 下一页
    nextPage (pageNum) {
      this.getList({ pageNum })
    }

  }
}
</script>

<style lang='scss'>
.vehicle-file {
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
      width: 180px;
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
      }
      .btns {
        width: 60px;
        display: flex;
        justify-content: space-between;
      }
    }
    .list {
      margin-top: 30px;
    }
  }
  .page-wrap {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
    color: #333;
  }
  .tabPane1{
    border: 1px solid #dcdee2;
    .list{
      &:first-child{
        border-top: 0px;
      }
      margin-top:0;
      display: flex;
      border-top: 1px solid #dcdee2;
      .cont{
        &:first-child{
          border-left: 0px;
        }
        width: 0;
        flex: 1;
        border-left: 1px solid #dcdee2;
        text-align: center;
        height: 48px;
        line-height: 48px;
      }
    }
  }
  .pics{
    display: flex;
    flex-wrap: wrap;
    .pic{
      box-sizing: border-box;
      padding: 10px;
      width: 20%;
      height: 136px;
      background: burlywood;
    }
  }
}
</style>
