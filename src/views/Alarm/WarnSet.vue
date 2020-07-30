/* eslint-disable vue/no-parsing-error */
<template>
  <div class="alarm-set">
    <PageTitle name="告警设置" />
    <div class="operate">
      <div class="left">
        <SelectDe
          name="告警类型"
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
        <div class="name">告警列表信息</div>
        <div class="btns">
          <Button @click="addOrEdit('')" type="primary" style="margin-right: 90px">新增</Button>
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
              @click="addOrEdit(row,index)"
              :disabled="row.bklx === '一键布控'"
            >编辑</Button>
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
      <Select
        v-model="titleSelect"
        placeholder="选择布控类型"
        style="margin-bottom:20px"
        @on-change="selectFun"
      >
        <Option value="1">一键布控</Option>
        <Option value="2">手动布控</Option>
      </Select>
      <Form
        v-if="titleSelect === '1'"
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem label="布控开启">
          <i-switch v-model="formValidate.switch" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
      </Form>

      <Form
        v-if="titleSelect === '2'"
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem v-if="false"></FormItem>
        <!-- <FormItem label="布控区域" prop="deploySelArea">
          <Cascader
            :data="deployArea"
            v-model="formValidate.deploySelArea"
            change-on-select
            :load-data="loadData"
          ></Cascader>
        </FormItem>-->
        <FormItem label="布控人员姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入布控人员姓名" />
        </FormItem>
        <FormItem label="布控周期" prop="days">
          <Input v-model="formValidate.days" placeholder="请输入天数" />
        </FormItem>
        <FormItem label="出现频次" prop="offen">
          <Input v-model="formValidate.offen" placeholder="请输入次数" />
        </FormItem>
        <FormItem label="告警类型" prop="deployType">
          <Select v-model="formValidate.deployType" placeholder="请输入告警类型">
            <Option value="1">频繁夜出</Option>
            <Option value="2">僵尸车</Option>
            <Option value="3">昼伏夜出</Option>
            <Option value="4">临时车频繁出入</Option>
            <Option value="5">已登记长时间未出现</Option>
            <Option value="6">夜不归宿</Option>
          </Select>
        </FormItem>
        <FormItem label="布控时间段" prop="date">
          <TimePicker type="timerange" placeholder="请选择时间段" v-model="formValidate.date"></TimePicker>
        </FormItem>
        <FormItem label="布控开启">
          <i-switch v-model="formValidate.switch" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
      </Form>
    </AddModal>
  </div>
</template>

<script>
import {
  askCarList,
  askCarAdd,
  askCarAuto,
  askCarEdit,
  askCarDelete
} from '@/api/alarm'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'alarm-set',
  mixins: [module1Mixin],
  data () {
    // 自定义校验日期范围选择
    const validateDateArr = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        return callback(new Error('请输入日期'))
      }
      callback()
    }

    // 校验布控地区选择 validateDeployArea
    const validateDeployArea = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请选择地区'))
      }
      callback()
    }

    return {
      columns1: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '布控类型',
          key: 'bklx'
        },
        {
          title: '告警类型',
          key: 'gjlx'
        },
        {
          title: '布控周期(天)',
          key: 'bkts'
        },
        {
          title: '布控时间(起)',
          key: 'kssj'
        },
        {
          title: '布控时间(止)',
          key: 'jssj'
        },
        {
          title: '周期内出现频次',
          key: 'gjcfcsx'
        },
        {
          title: '布控人员姓名',
          key: 'bkr'
        },
        {
          title: '布控时间',
          key: 'cjsj'
        },
        {
          title: '布控状态',
          key: 'bkzt'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data1: [],
      total: 0,
      isShow: false,
      deviceTitle: '布控设置',
      formValidate: {
        deploySelArea: [],
        switch: true,
        deployType: '',
        days: '',
        offen: '',
        name: '',
        date: [],
        clbkxxbz: '' // 编辑必传
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入布控人员姓名',
            trigger: 'blur'
          }
        ],
        days: [
          {
            required: true,
            message: '请输入天数',
            trigger: 'blur'
          }
        ],
        offen: [
          {
            required: true,
            message: '请输入次数',
            trigger: 'blur'
          }
        ],
        deployType: [
          {
            required: true,
            message: '请输入布控类型',
            trigger: 'change'
          }
        ],
        date: [
          {
            required: true,
            type: 'array',
            validator: validateDateArr,
            trigger: 'change'
          }
        ],
        deploySelArea: [
          {
            required: true,
            type: 'array',
            validator: validateDeployArea,
            trigger: 'change'
          }
        ]
      },
      titleSelect: '1',
      deployArea: [
        {
          value: 'beijing',
          label: '北京',
          children: [],
          loading: false
        },
        {
          value: 'hangzhou',
          label: '杭州',
          children: [],
          loading: false
        }
      ],
      carType: [
        {
          value: 'null',
          label: '全部'
        },
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
      isEdit: false,
      carTypeValue: ''
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
      } = await askCarList(pageNum)
      if (code == 0) {
        if (data) {
          this.data1 = data.map(item => {
            item.bkzt = item.bkzt == 1 ? '开启' : '关闭'
            return item
          })
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
    // 搜索
    async searchFun () {
      let searObj
      if (this.carTypeValue === 'null') {
        searObj = {
          pageNum: 1
        }
      } else {
        searObj = {
          gjlx: this.carTypeValue,
          pageNum: 1
        }
      }
      this.getList(searObj)
    },
    // 重置
    reset () {
      this.$refs.ref1.reset()
      this.getList({ pageNum: 1 })
    },
    // 重置formValidate data
    initFormData () {
      this.formValidate = {
        deploySelArea: [],
        switch: true,
        deployType: '',
        days: '',
        offen: '',
        name: '',
        date: [],
        clbkxxbz: '' // 编辑必传
      }
    },
    closeModal (val) {
      // 关闭新增或编辑
      this.isShow = val
      // 清空输入,重置编辑
      this.handleReset('formValidate')
      this.initFormData()
      this.isEdit = false
    },
    // 处理编辑的时候告警类型对应的数字
    warnType (val) {
      let res = '0'
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
    },
    addOrEdit (item) {
      this.isShow = true
      if (item) {
        this.isEdit = true
        // 编辑
        // 1=一键布控，2=手动布控
        if (item.bklx === '一键布控') {
          this.titleSelect = '1'
          this.formValidate = {
            switch: item.bkzt == '开启'
          }
        } else if (item.bklx === '手动布控') {
          this.titleSelect = '2'
          this.formValidate = {
            name: item.bkr,
            days: item.bkts + '',
            offen: item.gjcfcsx + '',
            deployType: this.warnType(item.gjlx),
            date: [item.kssj, item.jssj],
            switch: item.bkzt == '开启',
            clbkxxbz: item.clbkxxbz // 主键
          }
        }
      } else {
        // 新增
      }
    },
    async deleteFun (item) {
      // 删除
      const params = {
        ids: item.clbkxxbz
      }
      this.$Modal.confirm({
        title: '删除操作',
        content: '<p>您确认删除吗？</p>',
        onOk: () => {
          askCarDelete(params).then(({ data: { code } }) => {
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
      if (this.titleSelect === '1') {
        // 开关
        let params
        if (this.isEdit) {
          params = this.formValidate.switch ? 1 : 0
        }
        params = {
          flag: this.formValidate.switch ? 1 : 0
        }
        // 一键布控方法(编辑或新增)
        const handleFun = this.isEdit ? askCarEdit : askCarAuto
        handleFun(params).then(({ data: { code } }) => {
          if (code == 0) {
            this.$Message.success('操作成功')
            this.closeModal(false)
            // 重新请求列表
            this.getList({ pageNum: 1 })
          } else {
            this.$Message.error('操作失败')
            this.closeModal(false)
          }
        })
      } else {
        // 手动布控
        this.$refs[name].validate(valid => {
          if (valid) {
            const params = {
              bkr: this.formValidate.name,
              bkts: this.formValidate.days,
              gjcfcsx: this.formValidate.offen,
              gjlx: this.formValidate.deployType,
              kssj: this.formValidate.date[0],
              jssj: this.formValidate.date[1],
              bkzt: this.formValidate.switch ? 1 : 0,
              clbkxxbz: this.formValidate.clbkxxbz
            }
            // 手动布控方法(编辑或新增)
            const handleFun = this.isEdit ? askCarEdit : askCarAdd
            handleFun(params).then(({ data: { code } }) => {
              if (code == 0) {
                this.$Message.success('操作成功')
                this.closeModal(false)
                // 重新请求列表
                this.getList({ pageNum: 1 })
                // 清空输入
                this.handleReset('formValidate')
              } else {
                this.$Message.error('操作失败')
                this.closeModal(false)
              }
            })
          }
        })
      }
    },
    handleReset (name) {
      this.initFormData()
      this.$refs[name].resetFields()
    },
    selectFun () {
      // 下拉框选择重置表单
      this.handleReset('formValidate')
    },
    loadData (item, callback) {
      // 编辑 新增 ，动态加载布控区域的地址
      item.loading = true
      setTimeout(() => {
        if (item.value === 'beijing') {
          item.children = [
            {
              value: 'talkingdata',
              label: 'TalkingData'
            },
            {
              value: 'baidu',
              label: '百度'
            },
            {
              value: 'sina',
              label: '新浪'
            }
          ]
        } else if (item.value === 'hangzhou') {
          item.children = [
            {
              value: 'ali',
              label: '阿里巴巴'
            },
            {
              value: '163',
              label: '网易'
            }
          ]
        }
        item.loading = false
        callback()
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.alarm-set {
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
