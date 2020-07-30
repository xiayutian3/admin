<template>
  <div class="info-device">
    <PageTitle name="设备信息" />
    <div class="operate">
      <div class="left">
        <SelectDe name="小区" :marginL="0" :inputW="200" ref='ref4' :dataList="xiaoqu" @getSelectValue="getSelectValue3"/>
        <SelectDe name="设备类型" :inputW="200" :dataList="deviceType" ref='ref1' @getSelectValue="getSelectValue"/>
        <SelectDe name="设备状态" :inputW="200" :dataList="deviceStatus" ref='ref2' @getSelectValue="getSelectValue2"/>
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">设备列表</div>
        <div class="btns">
          <Button @click="exportLC">导出</Button>
        </div>
      </div>
      <div class="list">
        <Table stripe border :columns="columns1" :data="data1" @on-selection-change="selectIdArr"></Table>
      </div>
    </div>
    <div class="page-wrap">
      <Page :total="total" show-total  @on-change="nextPage"/>
    </div>
  </div>
</template>

<script>
import { deviceList, deviceExport } from '@/api/info'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'info-device',
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
          title: '设备名称',
          key: 'sbmc'
        },
        {
          title: '设备编号',
          key: 'cjsbxxbz'
        },
        {
          title: '设备类型',
          key: 'sblx'
        },
        {
          title: '坐标',
          key: 'location'
        },
        {
          title: '设备状态',
          key: 'sfzx_pdbz'
        }
      ],
      data1: [],
      total: 0,
      deviceType: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '人脸门禁'
        },
        {
          value: 2,
          label: '车辆道闸'
        },
        {
          value: 3,
          label: '结构化相机'
        },
        {
          value: 4,
          label: '告警设备'
        },
        {
          value: 5,
          label: '视频监控'
        },
        {
          value: 9,
          label: '其他'
        }
      ],
      deviceStatus: [
        {
          value: 0,
          label: '在线'
        },
        {
          value: 1,
          label: '不在线'
        }
      ],
      typeValue: '',
      xiaoquValue: '',
      statusValue: '',
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
      const { data: { data, code, total } } = await deviceList(pageNum)
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
        // 设别类型
        if (item.sblx == 1) {
          item.sblx = '人脸门禁'
        } else if (item.sblx == 2) {
          item.sblx = '车辆道闸'
        } else if (item.sblx == 3) {
          item.sblx = '结构化相机'
        } else if (item.sblx == 4) {
          item.sblx = '告警设备'
        } else if (item.sblx == 5) {
          item.sblx = '视频监控'
        } else {
          item.sblx = '其他'
        }

        // 坐标
        item.location = item.dqjd + ',' + item.dqwd

        // 设备状态
        if (item.sfzx_pdbz == 0) {
          item.sfzx_pdbz = '在线'
        } else if (item.sfzx_pdbz == 1) {
          item.sfzx_pdbz = '不在线'
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
      this.typeValue = data.val
    },

    // 获取下拉值
    getSelectValue2 (data) {
      this.statusValue = data.val
    },
    getSelectValue3 (data) {
      this.xiaoquValue = data.val
    },

    // 搜索
    async searchFun () {
      const searObj = {
        xqxxbz: this.xiaoquValue ? this.xiaoquValue : '',
        sblx: this.typeValue ? this.typeValue : '',
        sfzx_pdbz: this.statusValue ? this.statusValue : '',
        pageNum: 1
      }
      console.log(searObj)
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.typeValue = ''
      this.xiaoquValue = ''
      this.statusValue = ''
      this.$refs.ref1.reset()
      this.$refs.ref2.reset()
      this.$refs.ref4.reset()
      this.getList({ pageNum: 1 })
    },
    selectIdArr (list) {
      // 导出相关，选中的项
      this.getSelectIdArr(list, 'cjsbxxbz')
    },
    exportLC () {
      // 导出相关，开始导出
      this.exportExcl(deviceExport)
    }
  }
}
</script>

<style lang="scss">
.info-device {
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
