<template>
  <div class="lc-datepicker" :style="{marginLeft: marginL + 'px' }">
    <div class="name">{{name}}</div>
    <!-- <Cascader :data="dataCascader" trigger="hover" :model="value1" :style="`width:${inputW}px`"></Cascader> -->
    <DatePicker v-model="value1" :type="type" format="yyyy-MM-dd HH:mm" :style="`width:${inputW}px`" @on-change="getValue"></DatePicker>
  </div>
</template>

<script>
export default {
  name: 'lc-datepicker',
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
      default: 20
    },
    type: {
      type: String,
      default: 'datetime'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd HH:mm'
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
      console.log('time', value)
      const data = {
        val: value
      }
      this.$emit('getDateValue', data)
    },
    reset () {
      this.value1 = []
    }
  }
}
</script>

<style lang='scss'>
.lc-datepicker {
  display: flex;
  align-items: center;
  color: #999;
  .name {
    margin-right: 4px;
  }
}
</style>
