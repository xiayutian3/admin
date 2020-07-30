<template>
  <div class="lc-cascader" :style="{marginLeft: marginL + 'px' ,marginTop: marginT+'px'}">
    <div class="name">{{name}}</div>
    <Cascader v-model="value1" :data="dataList" trigger="hover"  :style="`width:${inputW}px`" change-on-select @on-change="getValue"></Cascader>
  </div>
</template>

<script>
export default {
  name: 'lc-cascader',
  props: {
    name: {
      type: String,
      default: '没写名字'
    },
    inputW: {
      type: Number,
      default: 200
    },
    marginL: {
      type: Number,
      default: 0
    },
    marginT: {
      type: Number,
      default: 0
    },
    dataList: {
      type: Array,
      default: () => [
        {
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
              label: '王府井'
            }
          ]
        },
        {
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
        }
      ]
    }
  },
  data () {
    return {
      value1: []
    }
  },
  created () {},
  mounted () {},
  computed: {},
  watch: {},
  methods: {
    getValue (value) {
      const data = {
        val: value
      }
      this.$emit('getCascaderValue', data)
    },
    reset () {
      this.value1 = []
    }
  }
}
</script>

<style lang='scss'>
.lc-cascader {
  display: flex;
  align-items: center;
  color: #999;
  .name {
    margin-right: 4px;
  }
}
</style>
