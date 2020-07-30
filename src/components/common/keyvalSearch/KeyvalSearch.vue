<template>
  <div class='key-search' :style="`margin-left:${marginL}px`">
    <span class="key">{{name}} </span><Input v-model="value" :placeholder="placeholder" :style="`width:${inputW}px`" />
  </div>
</template>

<script>
export default {
  name: 'key-val-search',
  props: {
    name: {
      type: String,
      default: '角色名称'
    },
    placeholder: {
      type: String,
      default: ''
    },
    inputW: {
      type: Number,
      default: 300
    },
    marginL: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {
    value: {
      get () {
        return this.$store.state.module1.searchInp
      },
      set (value) {
        this.$store.commit('SETSEARCHINP', value)
      }
    }
  },
  watch: {},
  methods: {

  }
}
</script>

<style lang='scss' scoped>
  .key-search{
    display: flex;
    align-items: center;
    .key{
      margin-right: 5px;
      color: #999;
    }
  }
</style>
