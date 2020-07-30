/* eslint-disable vue/no-parsing-error */
<template>
  <div class="device">
    <PageTitle name="设备管理" />
    <div class="operate">
      <div class="left">
        <SelectDe
          name="设备类型"
          :inputW="200"
          :dataList="deviceType"
          ref="ref1"
          @getSelectValue="getSelectValue"
        />
        <CascaderLc
          name="场景"
          :marginL="20"
          ref="ref3"
          :dataList="sceneList"
          @getCascaderValue="getCascaderValue"
        ></CascaderLc>
        <SelectDe
          name="设备状态"
          :inputW="200"
          :dataList="deviceStatus"
          ref="ref2"
          @getSelectValue="getSelectValue2"
        />
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
          <Button @click="addOrEdit('')" type="primary" style="margin-right: 90px" >新增</Button>
          <!-- <Button @click="exportLC">导出</Button> -->
        </div>
      </div>
      <div class="list">
        <Table stripe border :columns="columns1" :data="data1" @on-selection-change="selectIdArr">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="addOrEdit(row,index)"
            >编辑</Button>
            <Button
              type="primary"
              size="small"
              @click="check(row,index)"
              style="margin-right: 5px"
            >查看设备</Button>
            <Button type="error" size="small" @click="deleteFun(row,index)">删除</Button>
          </template>
        </Table>
      </div>
    </div>
    <div class="page-wrap">
      <Page :total="total" show-total @on-change="nextPage" />
    </div>
    <!-- 设备编辑 -->
    <AddModal
      :isShow="isShow"
      :deviceTitle="deviceTitle"
      @closeModal="closeModal"
      @handleSubmit="handleSubmit"
      @handleReset="handleReset"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="设备名称" prop="sbmc">
          <Input v-model="formValidate.sbmc" placeholder="请输入设备名称"></Input>
        </FormItem>
        <FormItem label="设备编号" prop="cjsbxxbz">
          <Input v-model="formValidate.cjsbxxbz" placeholder="请输入设备编号"></Input>
        </FormItem>
        <!-- <FormItem label="所属场景" prop="city">
          <Select v-model="formValidate.city" placeholder="请选择所属场景">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="安装位置" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入安装位置"></Input>
        </FormItem>-->
        <FormItem label="品牌型号" prop="ppxh">
          <Select v-model="formValidate.ppxh" placeholder="请选择品牌型号">
            <Option v-for="(item,index) in ppxhType" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="设备类型" prop="sblx">
          <Select v-model="formValidate.sblx" placeholder="请选择设备类型">
            <Option
              v-for="(item,index) in deviceType"
              :key="index"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="经度" prop="dqjd">
          <Input v-model.number="formValidate.dqjd" placeholder="请输入经度"></Input>
        </FormItem>
        <FormItem label="纬度" prop="dqwd">
          <Input v-model.number="formValidate.dqwd" placeholder="请输入纬度"></Input>
        </FormItem>
        <FormItem label="IP地址" prop="ipdz">
          <Input v-model="formValidate.ipdz" placeholder="请输入IP"></Input>
        </FormItem>
        <FormItem label="网络端口" prop="wldkh">
          <Input v-model.number="formValidate.wldkh" placeholder="请输入网络端口号"></Input>
        </FormItem>
        <FormItem label="小区信息" prop="xqxxbz">
          <Input v-model="formValidate.xqxxbz" placeholder="请输入小区信息标识"></Input>
        </FormItem>
        <FormItem label="是否在线" prop="sfzx_pdbz">
          <Select v-model="formValidate.sfzx_pdbz" placeholder="请选择设备是否在线">
            <Option
              v-for="(item,index) in deviceStatus"
              :key="index"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
    </AddModal>
    <!-- 查看设备 -->
    <Modal class="device-wrap" v-model="modal2" title="设备信息" width="1000" :mask-closable="false">
      <div class="device-list">
        <div class="device-item">设备名称：{{checkItem.sbmc}}</div>
        <div class="device-item">设备编号：{{checkItem.cjsbxxbz}}</div>
        <div class="device-item">安装位置：{{checkItem.dqjd}},{{checkItem.dqwd}}</div>
        <div class="device-item">设备类型：{{checkItem.sblx}}</div>
        <div class="device-item">坐标：{{checkItem.dqjd}},{{checkItem.dqwd}}</div>
        <div class="device-item">设备状态：{{checkItem.sfzx_pdbz}}</div>
      </div>
      <div class="device-table-title">最近通行记录</div>
      <div class="table-wrap">
        <Table border :columns="innerColumns" :data="innerData">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="modalImgShow(row,index)">查看</Button>
          </template>
        </Table>
      </div>
      <div class="page-wrap">
        <Page :total="innerTotal" show-total @on-change="innerNextPage" />
      </div>
    </Modal>
    <ViewImage :imgList="modalImgList" :viewShow="modalViewShow" @viewClose="modalViewClose" />
  </div>
</template>

<script>
import {
  deviceList,
  deviceExport,
  deviceAdd,
  deviceEdit,
  deviceDelete
} from '@/api/deviceManage'
import { module1Mixin } from '@/utils/mixin'
import { carPassList } from '@/api/pass'
import { deepClone } from '@/utils/obj'
export default {
  name: 'device',
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
          title: '安装地点',
          key: 'location'
        },
        {
          title: '坐标',
          key: 'location'
        },
        {
          title: '所属场景',
          key: 'location'
        },
        {
          title: '设备类型',
          key: 'sblx'
        },
        {
          title: '设备状态',
          key: 'sfzx_pdbz'
        },
        {
          title: '离线时间',
          key: 'endTime'
        },
        {
          title: '操作',
          slot: 'action',
          width: 220,
          align: 'center'
        }
      ],
      data1: [],
      total: 0,
      deviceType: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '人脸门禁'
        },
        {
          value: '2',
          label: '车辆道闸'
        },
        {
          value: '3',
          label: '结构化相机'
        },
        {
          value: '4',
          label: '告警设备'
        },
        {
          value: '5',
          label: '视频监控'
        },
        {
          value: '9',
          label: '其他'
        }
      ],
      ppxhType: [
        {
          value: '1',
          label: '德奥科技'
        },
        {
          value: '2',
          label: '其他'
        }
      ],
      deviceStatus: [
        {
          value: '0',
          label: '在线'
        },
        {
          value: '1',
          label: '不在线'
        }
      ],
      typeValue: '',
      sceneList: [],
      statusValue: '',
      idArr: [],
      isShow: false,
      deviceTitle: '设备新增',
      formValidate: {
        sbmc: '',
        cjsbxxbz: '',
        ppxh: '',
        sblx: '',
        dqjd: '',
        dqwd: '',
        wldkh: '',
        ipdz: '',
        xqxxbz: '',
        sfzx_pdbz: ''
      },
      ruleValidate: {
        sbmc: [
          {
            required: true,
            message: '请输入设备名称',
            trigger: 'blur'
          }
        ],
        cjsbxxbz: [
          {
            required: true,
            message: '请输入设备编号',
            trigger: 'blur'
          }
        ],
        ppxh: [
          {
            required: true,
            message: '请选择品牌型号',
            trigger: 'change'
          }
        ],
        sblx: [
          {
            required: true,
            message: '请选择设备类型',
            trigger: 'change'
          }
        ],
        dqjd: [
          {
            required: true,
            type: 'number',
            message: '请输入经度',
            trigger: 'blur'
          }
        ],
        dqwd: [
          {
            required: true,
            type: 'number',
            message: '请输入纬度',
            trigger: 'blur'
          }
        ],
        wldkh: [
          {
            required: true,
            type: 'number',
            message: '请输入网络端口号',
            trigger: 'blur'
          }
        ],
        ipdz: [
          {
            required: true,
            message: '请输入IP',
            trigger: 'blur'
          }
        ],
        xqxxbz: [
          {
            required: true,
            message: '请输入小区信息标识',
            trigger: 'blur'
          }
        ],
        sfzx_pdbz: [
          {
            required: true,
            message: '请选择设备是否在线',
            trigger: 'change'
          }
        ]
      },
      modal2: false,
      innerColumns: [
        {
          title: '姓名',
          key: 'cz_xm'
        },
        {
          title: '身份证号',
          key: 'cz_gmsfzhm'
        },
        {
          title: '手机号码',
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
          key: 'jdccsysdm'
        },
        {
          title: '设备名称',
          key: 'sbmc'
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
          title: '设备编号',
          key: 'cjsbxxbz'
        },
        {
          title: '现场图片',
          slot: 'action',
          width: 100,
          align: 'center'
        }
      ],
      innerData: [
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
      innerTotal: 0,
      checkItem: {}
    }
  },
  created () {
    this.getList({ pageNum: 1 })
    // this.getvillage({ ssxqdm: this.$store.state.module1.areaId })
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
      } = await deviceList(pageNum)
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
    // 反转data中的某一项数据（编辑时候使用）
    reverseItem (item) {
      // 设备类型
      const newItem = deepClone(item)
      switch (newItem.sblx) {
        case '人脸门禁':
          newItem.sblx = '1'
          break
        case '车辆道闸':
          newItem.sblx = '2'
          break
        case '结构化相机':
          newItem.sblx = '3'
          break
        case '告警设备':
          newItem.sblx = '4'
          break
        case '视频监控':
          newItem.sblx = '5'
          break
        case '其他':
          newItem.sblx = '9'
          break
      }
      // 设备在线状态
      switch (newItem.sfzx_pdbz) {
        case '在线':
          newItem.sfzx_pdbz = '0'
          break
        case '不在线':
          newItem.sfzx_pdbz = '1'
          break
      }
      return newItem
    },

    // 下一页
    nextPage (pageNum) {
      this.getList({ pageNum })
    },
    innerNextPage (pageNum) {
      this.getInnerData({ pageNum })
    },
    // 获取下拉值
    getSelectValue (data) {
      this.typeValue = data.val
    },

    // 获取下拉值
    getSelectValue2 (data) {
      this.statusValue = data.val
    },
    // 场景选择
    getCascaderValue (data) {
      console.log('场景选择', data)
    },
    // 搜索
    async searchFun () {
      let searObj
      // 查询全部或者其他类型
      if (this.typeValue == '0') {
        searObj = {
          sfzx_pdbz: this.statusValue ? this.statusValue : '',
          pageNum: 1
        }
      } else {
        searObj = {
          sblx: this.typeValue ? this.typeValue : '',
          sfzx_pdbz: this.statusValue ? this.statusValue : '',
          pageNum: 1
        }
      }
      // const searObj = {
      //   sblx: this.typeValue ? this.typeValue : '',
      //   sfzx_pdbz: this.statusValue ? this.statusValue : '',
      //   pageNum: 1
      // }
      // console.log(searObj)
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.typeValue = ''
      this.statusValue = ''
      this.$refs.ref3.reset()
      this.$refs.ref1.reset()
      this.$refs.ref2.reset()
      this.getList({ pageNum: 1 })
    },
    selectIdArr (list) {
      // 导出相关，选中的项
      this.getSelectIdArr(list, 'cjsbxxbz')
    },
    exportLC () {
      // 导出相关，开始导出
      this.exportExcl(deviceExport)
    },
    closeModal (val) {
      // 关闭新增或编辑
      this.isShow = val
      this.handleReset('formValidate')
    },
    async addOrEdit (item, index) {
      // 设备编辑或新增
      this.isShow = true
      if (item) {
        // 编辑
        this.deviceTitle = '设备编辑'
        const editeItem = this.reverseItem(item)
        this.formValidate = {
          sbmc: editeItem.sbmc,
          cjsbxxbz: editeItem.cjsbxxbz,
          ppxh: editeItem.ppxh,
          sblx: editeItem.sblx,
          dqjd: editeItem.dqjd,
          dqwd: editeItem.dqwd,
          wldkh: editeItem.wldkh,
          ipdz: editeItem.ipdz,
          xqxxbz: editeItem.xqxxbz,
          sfzx_pdbz: editeItem.sfzx_pdbz
        }
      } else {
        // 新增
        this.deviceTitle = '设备新增'
      }
    },
    // 获取设备查看弹出的modal中的通行记录
    getInnerData (params) {
      carPassList(params).then(({ data: { data, code, total } }) => {
        if (data && code == 0) {
          console.log(data)
          this.innerData = data
          this.innerTotal = total
        }
      })
    },
    check (item) {
      // 设备查看
      this.modal2 = true
      this.checkItem = item
      this.getInnerData({ cjsbxxbz: item.cjsbxxbz })
    },
    async deleteFun (item) {
      // 删除
      const params = {
        ids: item.cjsbxxbz
      }
      this.$Modal.confirm({
        title: '删除操作',
        content: '<p>您确认删除吗？</p>',
        onOk: () => {
          deviceDelete(params).then(({ data: { code } }) => {
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
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 判断新增或编辑
          let handleFun
          const obj = {
            sbmc: this.formValidate.sbmc,
            cjsbxxbz: this.formValidate.cjsbxxbz,
            ppxh: this.formValidate.ppxh,
            sblx: this.formValidate.sblx,
            dqjd: this.formValidate.dqjd,
            dqwd: this.formValidate.dqwd,
            wldkh: this.formValidate.wldkh,
            ipdz: this.formValidate.ipdz,
            xqxxbz: this.formValidate.xqxxbz,
            sfzx_pdbz: this.formValidate.sfzx_pdbz
          }
          if (this.deviceTitle === '设备新增') {
            // 新增
            handleFun = deviceAdd
          } else {
            // 编辑
            handleFun = deviceEdit
          }
          handleFun(obj)
            .then(res => {
              if (res.data.code == 0) {
                this.$Message.success('Success!')
                this.handleReset('formValidate')
                this.closeModal()
                this.getList({ pageNum: 1 })
              }
            })
            .catch(() => {
              this.$Message.error('Fail!')
            })
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="scss">
.device {
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
.device-wrap {
  .device-list {
    display: flex;
    flex-wrap: wrap;
    .device-item {
      padding: 5px;
      width: 33.33%;
    }
  }
  .device-table-title {
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 5px 10px;
    border-left: 4px solid #797979;
  }
  .ivu-modal-body {
    overflow: auto;
  }
  .table-wrap {
    padding: 10px 10px 10px 0px;
    width: 1500px;
  }
}
</style>
