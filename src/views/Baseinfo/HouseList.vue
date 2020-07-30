<template>
  <div class="info-house">
    <PageTitle name="房屋信息" />
    <div class="operate">
      <div class="left">
        <SelectDe name="小区" :marginL="0" :inputW="200" ref='ref4' :dataList="xiaoqu" @getSelectValue="getSelectValue2"/>
        <KeyvalSearch name="输入查询"  placeholder="模糊查询" :marginL="20" :inputW="200"/>
        <CascaderLc name="门牌号" :marginL="20" ref='ref2' :dataList="doorNumber" @getCascaderValue="getCascaderValue"></CascaderLc>
      </div>
      <div class="right">
        <Button type="primary" @click="searchFun">查询</Button>
        <Button @click="reset">重置</Button>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">房屋列表</div>
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
import { houseList } from '@/api/info'
import { structList, unitList } from '@/api/building'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'info-house',
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
          title: '房屋名称',
          key: 'house_name'
        },
        {
          title: '地址',
          key: 'dzmc'
        },
        {
          title: '房屋类型',
          key: 'fwlbdm'
        },
        {
          title: '房屋面积',
          key: 'jz_mjpfm'
        },
        {
          title: '入住人数',
          key: 'jz_rs'
        },
        {
          title: '业主姓名',
          key: 'fz_xm'
        },
        {
          title: '业主手机号',
          key: 'fz_lxdh'
        }
      ],
      data1: [],
      total: 0,
      doorNumber: [],
      xiaoquValue: '',
      doorValue: []
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
    async getList (pageNum) {
      // 获取列表
      const { data: { data, code, total } } = await houseList(pageNum)
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
        if (item.fwlbdm == 1) {
          item.fwlbdm = '商品房'
        } else if (item.fwlbdm == 2) {
          item.fwlbdm = '房改房'
        } else if (item.fwlbdm == 3) {
          item.fwlbdm = '集资房'
        } else if (item.fwlbdm == 4) {
          item.fwlbdm = '经济适用房'
        } else if (item.fwlbdm == 5) {
          item.fwlbdm = '廉租房'
        } else if (item.fwlbdm == 6) {
          item.fwlbdm = '公租房'
        } else if (item.fwlbdm == 7) {
          item.fwlbdm = '安置房'
        } else if (item.fwlbdm == 8) {
          item.fwlbdm = '小产权房'
        } else {
          item.fwlbdm = '其他'
        }
        return item
      })
      return newData
    },
    // 下一页
    nextPage (pageNum) {
      console.log(pageNum)
      this.getList({ pageNum: pageNum })
    },

    // 获取门牌号
    getCascaderValue (data) {
      this.doorValue = data.val
    },
    getSelectValue2 (data) {
      this.xiaoquValue = data.val
    },

    // 搜索
    async searchFun () {
      const searObj = {
        xqxxbz: this.xiaoquValue ? this.xiaoquValue : '',
        ldxxbz: this.doorValue[0] ? this.doorValue[0] : '',
        dyxxbz: this.doorValue[1] ? this.doorValue[1] : '',
        fwxxbz: this.doorValue[2] ? this.doorValue[2] : '',
        str: this.searchInp,
        pageNum: 1
      }
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.doorValue = []
      this.xiaoquValue = ''
      this.$refs.ref2.reset()
      this.setsearchInp('')
      this.$refs.ref4.reset()
      this.getList({ pageNum: 1 })
    }
    // selectIdArr (list) {
    //   // 导出相关，选中的项
    //   this.getSelectIdArr(list, 'fwxxbz')
    // },
    // exportLC () {
    //   // 导出相关，开始导出
    //   this.exportExcl(houseExport)
    // }
  }
}
</script>

<style lang="scss">
.info-house {
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
