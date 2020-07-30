<template>
  <!-- 车辆汇聚（特有）新增或编辑modal -->
  <Modal v-model="isShowModal" :title="deviceTitle">
    <slot></slot>
    <div slot="footer">
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'vehicle-add-modal',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    deviceTitle: {
      type: String,
      default: '没有标题'
    }
  },
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {
    isShowModal: {
      get () {
        return this.isShow
      },
      set (val) {
        // console.log(val)
        this.$emit('closeModal', val)
      }
    }
  },
  watch: {},
  methods: {
    handleSubmit () {
      this.$emit('handleSubmit', 'formValidate')
    },
    handleReset () {
      this.$emit('handleReset', 'formValidate')
    }
  }
}
</script>

<style lang='scss'>
</style>
