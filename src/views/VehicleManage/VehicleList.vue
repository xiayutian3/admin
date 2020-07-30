<template>
  <div class="vehicle-list">
    <PageTitle name="车辆列表" />
    <div class="operate">
      <div class="left">
        <KeyvalSearch name="输入查询" placeholder :marginL="20" :inputW="200" />
        <!-- <SelectDe name="人员类型" :marginL="20" :inputW="200" ref='ref4' :dataList="peopleType" @getSelectValue="getSelectValue2"/> -->
        <SelectDe
          name="车牌类型"
          :inputW="200"
          :dataList="carType"
          ref="ref1"
          @getSelectValue="getSelectValue"
        />
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
          <Button type="primary" @click="addOrEdit('')" style="margin-right: 30px">新增</Button>
          <!-- <Button @click="exportLC">导出</Button> -->
          <Upload
            action="/"
            multiple
            accept=".xls, .xlsx"
            :on-success="importLC"
            :on-error="importErr"
            :before-upload="importBef"
          >
            <Button>导入</Button>
          </Upload>
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
              style="margin-right: 5px"
              @click="fileFun(row,index)"
            >车辆档案</Button>
            <Button
              type="error"
              size="small"
              style="margin-right: 5px"
              @click="analysisFun(row,index)"
            >车辆分析</Button>
            <Button type="error" size="small" @click="deleteFun(row,index)">删除</Button>
          </template>
        </Table>
      </div>
    </div>
    <div class="page-wrap">
      <Page :total="total" show-total @on-change="nextPage" />
    </div>
    <!-- 新增编辑modal -->
    <AddModal
      :isShow="isShow"
      :deviceTitle="deviceTitle"
      @closeModal="closeModal"
      @handleSubmit="handleSubmit"
      @handleReset="handleReset"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="车辆标识" prop="jdcxxbz">
          <Input v-model="formValidate.jdcxxbz" placeholder="请输入车辆标识"></Input>
        </FormItem>
        <FormItem label="姓名" prop="cz_xm">
          <Input v-model="formValidate.cz_xm" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="身份证号" prop="cz_gmsfzhm">
          <Input v-model="formValidate.cz_gmsfzhm" placeholder="请输入身份证号"></Input>
        </FormItem>
        <FormItem label="手机号码" prop="cz_lxdh">
          <Input v-model="formValidate.cz_lxdh" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="车牌号码" prop="jdchphm">
          <Input v-model="formValidate.jdchphm" placeholder="请输入车牌号"></Input>
        </FormItem>
        <!-- <FormItem label="车辆性质" prop="city">
          <Select v-model="formValidate.city" placeholder="Select your city">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>-->
        <FormItem label="车辆颜色" prop="jdchpysdm">
          <Select v-model="formValidate.jdchpysdm" placeholder="请选择车辆颜色">
            <Option v-for="(item,idx) in carColor" :key="idx" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="车牌类型" prop="jdchpzldm">
          <Input v-model="formValidate.jdchpzldm" placeholder="请输入车牌类型"></Input>
        </FormItem>
        <!-- <FormItem label="所属场景" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入设备编号"></Input>
        </FormItem>-->
        <FormItem label="小区信息" prop="xqxxbz">
          <Select v-model="formValidate.xqxxbz" placeholder="请选择小区">
            <Option v-for="(item,idx) in xiaoqu" :key="idx" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
    </AddModal>
  </div>
</template>

<script>
import {
  carList,
  carExport,
  carAdd,
  carEdit,
  carDelete,
  carAddList
} from '@/api/vehicleManage'
import { module1Mixin } from '@/utils/mixin'
import { importfxx } from '@/export/index'
export default {
  name: 'vehicle-list',
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
          title: '身份证号',
          key: 'cz_gmsfzhm'
        },
        {
          title: '车牌号',
          key: 'jdchphm'
        },
        {
          title: '车辆颜色',
          key: 'jdchpysdm'
        },
        {
          title: '车牌类型',
          key: 'jdchpzldm'
        },
        {
          title: '操作',
          slot: 'action',
          width: 300,
          align: 'center'
        }
      ],
      data1: [],
      total: 0,
      carType: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 1,
          label: '业主车'
        },
        {
          value: 2,
          label: '临时车'
        }
      ],
      // 人员类型
      // peopleType: [
      //   {
      //     value: 0,
      //     label: '全部'
      //   },
      //   {
      //     value: 1,
      //     label: '业主'
      //   },
      //   {
      //     value: 2,
      //     label: '租户'
      //   },
      //   {
      //     value: 3,
      //     label: '商户'
      //   },
      //   {
      //     value: 4,
      //     label: '物业'
      //   },
      //   {
      //     value: 5,
      //     label: '政府部门'
      //   },
      //   {
      //     value: 6,
      //     label: '快递'
      //   },
      //   {
      //     value: 7,
      //     label: '重点人员'
      //   },
      //   {
      //     value: 9,
      //     label: '其他'
      //   }
      // ],
      carTypeValue: '',
      // peopleTypeValue: '',
      idArr: [],
      isShow: false,
      deviceTitle: '',
      formValidate: {
        jdcxxbz: '',
        cz_xm: '',
        cz_gmsfzhm: '',
        cz_lxdh: '',
        jdchphm: '',
        jdchpysdm: '',
        jdchpzldm: '',
        xqxxbz: ''
      },
      ruleValidate: {
        jdcxxbz: [
          {
            required: true,
            message: '请输入车辆标识',
            trigger: 'blur'
          }
        ],
        cz_xm: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        cz_gmsfzhm: [
          {
            required: true,
            message: '请输入身份证号',
            trigger: 'blur'
          }
        ],
        cz_lxdh: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ],
        jdchphm: [
          {
            required: true,
            message: '请输入车牌号',
            trigger: 'blur'
          }
        ],
        jdchpysdm: [
          {
            required: true,
            message: '请输入车辆颜色',
            trigger: 'change'
          }
        ],
        jdchpzldm: [
          {
            required: true,
            message: '请输入车牌类型',
            trigger: 'blur'
          }
        ],
        xqxxbz: [
          {
            required: true,
            message: '请选择小区',
            trigger: 'change'
          }
        ]
      },
      carColor: [
        {
          value: '1',
          label: '白色'
        },
        {
          value: '2',
          label: '银色'
        },
        {
          value: '3',
          label: '黄色'
        },
        {
          value: '4',
          label: '红色'
        },
        {
          value: '5',
          label: '蓝色'
        },
        {
          value: '6',
          label: '绿色'
        },
        {
          value: '7',
          label: '黑色'
        },
        {
          value: '9',
          label: '其他'
        }
      ]
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
      } = await carList(pageNum)
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
      const newData = data.map((item) => {
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
    // 人员类型
    // getSelectValue2 (data) {
    //   this.peopleTypeValue = data.val
    // },
    getSelectValueXq (data) {
      this.formValidate.xiaoquValue = data.val
    },
    // 搜索
    async searchFun () {
      // 查询全部的时候
      if (this.carTypeValue === 'null') {
        this.getList()
        return
      }
      const searObj = {
        jdccllxdm: this.carTypeValue ? this.carTypeValue : '',
        // 人员类型字段
        // xqxxbz: this.peopleTypeValue ? this.peopleTypeValue : '',
        str: this.searchInp,
        pageNum: 1
      }
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.carTypeValue = ''
      // this.peopleTypeValue = ''
      this.xiaoquValue = ''
      this.$refs.ref1.reset()
      this.setsearchInp('')
      // 人员类型
      // this.$refs.ref4.reset()
      this.getList({ pageNum: 1 })
    },
    selectIdArr (list) {
      // 导出相关，选中的项
      this.getSelectIdArr(list, 'jdcxxbz')
    },
    exportLC () {
      // 导出相关，开始导出
      this.exportExcl(carExport)
    },
    closeModal (val) {
      // 关闭新增或编辑
      this.isShow = val
      // 重置表单
      this.handleReset('formValidate')
    },
    // 匹配颜色代码
    checkColor (color) {
      let colorCode
      switch (color) {
        case '白色':
          colorCode = '1'
          break
        case '银色':
          colorCode = '2'
          break
        case '黄色':
          colorCode = '3'
          break
        case '红色':
          colorCode = '4'
          break
        case '蓝色':
          colorCode = '5'
          break
        case '绿色':
          colorCode = '6'
          break
        case '黑色':
          colorCode = '7'
          break
        default:
          colorCode = '9'
          break
      }
      return colorCode
    },
    addOrEdit (item) {
      // 新增或编辑
      this.isShow = true
      if (item) {
        this.deviceTitle = '车辆编辑'
        this.formValidate = {
          jdcxxbz: item.jdcxxbz,
          cz_xm: item.cz_xm,
          cz_gmsfzhm: item.cz_gmsfzhm,
          cz_lxdh: item.cz_lxdh,
          jdchphm: item.jdchphm,
          jdchpysdm: this.checkColor(item.jdchpysdm),
          jdchpzldm: item.jdchpzldm,
          xqxxbz: item.xqxxbz
        }
      } else {
        this.deviceTitle = '车辆新增'
      }
    },
    fileFun (item) {
      // 档案
      this.$router.push({
        path: '/home/vehiclefile',
        query: { jdcxxbz: item.jdcxxbz, tabpaneName: 'name1' }
      })
    },
    analysisFun (item) {
      console.log(item)
      // 分析(通行记录)
      this.$router.push({
        path: '/home/vehiclefile',
        query: { jdchphm: item.jdchphm, tabpaneName: 'name2' }
      })
    },
    async deleteFun (item) {
      // 删除
      const params = {
        ids: item.jdcxxbz
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
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 判断新增或编辑
          let handleFun
          const obj = {
            jdcxxbz: this.formValidate.jdcxxbz,
            cz_xm: this.formValidate.cz_xm,
            cz_gmsfzhm: this.formValidate.cz_gmsfzhm,
            cz_lxdh: this.formValidate.cz_lxdh,
            jdchphm: this.formValidate.jdchphm,
            jdchpysdm: this.formValidate.jdchpysdm,
            jdchpzldm: this.formValidate.jdchpzldm,
            xqxxbz: this.formValidate.xqxxbz
          }
          if (this.deviceTitle === '车辆新增') {
            // 新增
            handleFun = carAdd
          } else {
            // 编辑
            handleFun = carEdit
          }
          handleFun(obj)
            .then((res) => {
              if (res.data.code == 0) {
                this.$Message.success('Success!')
                this.handleReset('formValidate')
                this.closeModal(false)
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
    },
    // 上传execel成功
    importLC () {
      console.log(123)
      importfxx()
    },
    // 上传execel失败
    importErr () {
      console.log(456)
    },
    // 判断文件类型是否正确
    doBegin () {
      if (
        this.file.type ==
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        this.file.type == 'application/vnd.ms-excel'
      ) {
        // 1.要上传的文件  2.数据对应的字段，名称   3.上传数据的方法（没写）  4重新获取列表的方法   5.列表数据（可以不要，上传成功后，重新请求列表，主要是更新列表数据）
        const keyArr = [
        //   {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
          {
            title: '车辆标识',
            key: 'jdcxxbz'
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
            title: '身份证号',
            key: 'cz_gmsfzhm'
          },
          {
            title: '车牌号',
            key: 'jdchphm'
          },
          {
            title: '车辆颜色',
            key: 'jdchpysdm'
          },
          {
            title: '车牌类型',
            key: 'jdchpzldm'
          },
          {
            title: '小区信息',
            key: 'xqxxbz'
          }
        ]
        importfxx(this.file, keyArr, carAddList, this.getList, this.data1)

        this.$Message.info('文件上传成功')
      } else {
        this.$Message.error('附件格式错误，请删除后重新上传！')
      }
    },
    // 上传前
    importBef (file) {
      // console.log(file)
      this.file = file
      this.doBegin()
      return false
    }
  }
}
</script>

<style lang="scss">
.vehicle-list {
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
      .btns{
        display: flex;
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
