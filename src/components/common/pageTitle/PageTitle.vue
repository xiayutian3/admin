<template>
  <div class='page-title'>
    {{name}}
  </div>
</template>

<script>
export default {
  name: 'page-title',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style lang='scss'>
  .page-title{
    padding-left: 14px;
    margin-bottom: 10px;
    height: 40px;
    line-height: 40px;
    color: #333;
    background-color: #fff;
    border-left: 4px solid #797979;
  }
</style>
