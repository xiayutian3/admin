<template>
  <div class="de-select" :style="{marginLeft: marginL + 'px' }">
    <div class="name">{{name}}</div>
    <Select v-model="model1" :style="`width:${inputW}px`" @on-change="getValue">
      <Option v-for="item in dataList" :value="String(item.value)" :key="item.value">{{ item.label }}</Option>
    </Select>
  </div>
</template>

<script>
export default {
  name: 'de-select',
  props: {
    name: {
      type: String,
      default: '没写名字'
    },
    inputW: {
      type: Number,
      default: 300
    },
    marginL: {
      type: Number,
      default: 20
    },
    clearable: {
      type: Boolean,
      default: true
    },
    dataList: {
      type: Array,
      default: () => [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ]
    }
  },
  data () {
    return {
      model1: ''
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
      this.$emit('getSelectValue', data)
    },
    reset () {
      this.model1 = ''
    }
  }
}
</script>

<style lang='scss'>
.de-select {
  display: flex;
  align-items: center;
  color: #999;
  .name {
    margin-right: 4px;
  }
}
</style>
