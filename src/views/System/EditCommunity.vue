/* eslint-disable vue/no-parsing-error */
<template>
  <div class="mg-community">
    <Button class="return-btn" type="info" icon="md-return-left" @click="$router.go(-1)">返回上一级</Button>
    <div class="left">
      <Form :model="formItem" ref="formValidate" :rules="ruleValidate" :label-width="200">
        <FormItem label="小区名称" prop="jlxxqmc" >
          <Input v-model="formItem.jlxxqmc" placeholder="请填写小区名称"></Input>
        </FormItem>
        <FormItem label="小区地址" prop="dzmc" >
          <Input v-model="formItem.dzmc" placeholder="请填写小区地址"></Input>
        </FormItem>
        <FormItem label="小区信息标识" prop="xqxxbz" >
          <!-- v-if="!isEdite" -->
          <Input v-model="formItem.xqxxbz" placeholder="请填写小区信息标识"></Input>
        </FormItem>
        <FormItem label="小区启用日期" prop="xqqy_rq" >
          <DatePicker type="date" placeholder="请选择小区启用日期" v-model="formItem.xqqy_rq"></DatePicker>
        </FormItem>
        <FormItem label="物业公司名称" prop="xqwygs_dwmc" >
          <Input v-model="formItem.xqwygs_dwmc" placeholder="请填写物业公司名称"></Input>
        </FormItem>
        <FormItem label="使用状态">
          <i-switch v-model="formItem.syztdm" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <FormItem label="所属区域名称" prop="areaArr">
          <Cascader placeholder="请选择区域" v-model="formItem.areaArr" :data="dataCascader" @on-change="hangdleCascader" :load-data="loadDataArea"></Cascader>
        </FormItem>
        <FormItem label="所属区域代码" prop="ssxqdm">
          <Input v-model="formItem.ssxqdm" placeholder="区域代码"></Input>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="addCommunity">提交</Button>
          <Button style="margin-left: 8px" @click="resetall">重置</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { addVillage, editVillage } from '@/api/manage'
import { objIsNull, deepClone } from '@/utils/obj'
import { baseAreaTree } from '@/api/home'
export default {
  name: 'mg-user',
  data () {
    // // 检验用小区名称是否存在的接口
    // const validateUser = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('请填写用户名'))
    //   }
    //   // 模拟异步验证效果
    //   userCheck({ username: value }).then(({ data: { code } }) => {
    //     console.log(code)
    //     if (code == 4) {
    //       // 用户名不存在
    //       callback()
    //     } else {
    //       callback(new Error('用户名已存在,请重新输入'))
    //     }
    //   })
    // }
    return {
      dataCascader: [{
        value: 'beijing',
        label: '北京',
        children: [
          {
            value: 'gugong',
            label: '故宫'
          },
          {
            value: 'tiantan',
            label: '天坛'
          },
          {
            value: 'wangfujing',
            label: '王府井',
            children: [
              {
                value: 'gugong',
                label: '故宫'
              },
              {
                value: 'tiantan',
                label: '天坛'
              },
              {
                value: 'wangfujing',
                label: '王府井王府井王府井王府井'

              }]
          }
        ]
      }, {
        value: 'jiangsu',
        label: '江苏',
        children: [
          {
            value: 'nanjing',
            label: '南京',
            children: [
              {
                value: 'fuzimiao',
                label: '夫子庙'
              }
            ]
          },
          {
            value: 'suzhou',
            label: '苏州',
            children: [
              {
                value: 'zhuozhengyuan',
                label: '拙政园'
              },
              {
                value: 'shizilin',
                label: '狮子林'
              }
            ]
          }
        ]
      }],
      formItem: {
        jlxxqmc: '', // 小区名称
        xqxxbz: '', // 小区信息标识
        syztdm: true, // 使用状态 syztdm
        xqqy_rq: '', // 小区启用日期
        xqwygs_dwmc: '', // 物业公司名称
        areaArr: [], // 选中的区域id数组
        ssxqdm: '', // 所属区域代码
        dzmc: ''
      },
      ssxqmc: '', // 所属区域名称
      ruleValidate: {
        jlxxqmc: { required: true, message: '请填写小区名称', trigger: 'blur' },
        xqxxbz: { required: true, message: '请填写小区信息标识', trigger: 'blur' },
        xqqy_rq: { required: true, type: 'date', message: '请填写小区启用日期', trigger: 'change' },
        xqwygs_dwmc: { required: true, message: '请填写物业公司名称', trigger: 'blur' },
        areaArr: { required: true, type: 'array', min: 1, message: '请选择所属区域', trigger: 'change' },
        ssxqdm: { required: true, message: '请选择区域代码', trigger: 'blur' },
        dzmc: { required: true, message: '请填写小区地址', trigger: 'blur' }
      },
      areaList: [],
      handleNameFun: addVillage
    }
  },
  async created () {
    // 区域地质选择
    this.initDataArea(0)

    // 判断是新增还是编辑（默认是新增）
    const hasRouterParams = objIsNull(this.$route.params)
    if (!hasRouterParams) {
      this.formItem = {
        jlxxqmc: this.$route.params.jlxxqmc,
        xqxxbz: this.$route.params.xqxxbz,
        syztdm: this.$route.params.syztdm == 0,
        xqqy_rq: this.$route.params.xqqy_rq,
        xqwygs_dwmc: this.$route.params.xqwygs_dwmc,
        dzmc: this.$route.params.dzmc
      }
      this.handleNameFun = editVillage
    } else {
      this.handleNameFun = addVillage
    }
  },
  mounted () {},
  computed: {},
  watch: {},
  methods: {
    async initDataArea (params) {
      // 头部地区选择框
      const { data: { code, data } } = await baseAreaTree(params)
      if (code == 0) {
        data.forEach(item => {
          item.label = item.areaName
          item.value = item.id
          item.loading = false
          item.children = []
        })
        // 做成数组结构数组为了组件显示用
        this.dataCascader = data
        // 添加成一维数组，为了查找选中的名字传给后端
        this.areaList = deepClone(data)
      }
    },
    async loadDataArea (item, callback) {
      item.loading = false

      const { data: { code, data } } = await baseAreaTree(item.id)
      if (code == 0) {
        // 添加成一维数组，为了查找选中的名字传给后端
        this.areaList.push(...deepClone(data))

        item.loading = false
        data.forEach(item => {
          // 做成数组结构数组为了组件显示用
          item.label = item.areaName
          item.value = item.id
          if (item.childCount !== 0) {
            item.loading = false
            item.children = []
          }
        })
        item.children = data
        callback()
      }
    },
    hangdleCascader (selectArr) {
      const lastId = selectArr.pop()
      this.formItem.ssxqdm = lastId
      // 为了拿到item的name传给后端
      const result = this.areaList.find(item => item.id == lastId)
      this.ssxqmc = result.areaName
    },
    async addCommunity () {
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          const params = {
            jlxxqmc: this.formItem.jlxxqmc,
            xqxxbz: this.formItem.xqxxbz,
            syztdm: this.formItem.syztdm ? 0 : 1,
            xqqy_rq: moment(this.formItem.xqqy_rq).format('YYYY-MM-DD'),
            xqwygs_dwmc: this.formItem.xqwygs_dwmc,
            ssxqdm: this.formItem.ssxqdm,
            ssxqmc: this.ssxqmc,
            dzmc: this.formItem.dzmc
          }
          // 判断是新增还是编辑的操作
          const { data: { code } } = await this.handleNameFun(params)
          if (code == 0) {
            this.$Message.success('操作成功')
            this.$router.push('/home/community')
          }
        } else {
          console.log('fail')
          this.$Message.error('Fail!')
        }
      })
    },
    resetall () {
      this.$refs.formValidate.resetFields()
    }
  }
}
</script>

<style lang='scss'>
.mg-community {
  position: relative;
  padding: 10px 20px 0px 20px;
  .return-btn{
    position: absolute;
    left: 30px;
    top: 20px;
  }
  .left{
    padding: 10px;
    background: #fff;
  }
  .ivu-icon-ios-arrow-forward {
    color: #333;
  }
  .ivu-date-picker-header-label{
    color: #515a6e;
  }
  .ivu-date-picker-cells-cell{
    color: #515a6e;
  }
  .list{
    height: 220px;
    color: #333;
    overflow-y: auto;
  }
}
</style>
