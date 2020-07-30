/* eslint-disable vue/no-parsing-error */
<template>
  <Modal class="de-module" v-model="editmenuShow" title="添加菜单" @on-ok="ok" @on-cancel="cancel">
    <Form :label-width="80">
      <FormItem label="上级菜单">
        <Input class="disinput" v-model="editmenuParent.name" disabled  placeholder="请选择上级菜单"></Input>
        <Button type="success" class="reselect" @click="editmenuShow2=true">重新选择</Button>
      </FormItem>
      <!-- <FormItem label="菜单类型">
        <RadioGroup v-model="formItem.radio">
          <Radio label="1">目录</Radio>
          <Radio label="2">菜单</Radio>
          <Radio label="3">按钮</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem label="菜单名称">
        <Input v-model="editmenuItem.name" placeholder="请输入菜单名称"></Input>
      </FormItem>
      <FormItem label="权限标识">
        <Input v-model="editmenuItem.perms" placeholder="请输入权限标识"></Input>
      </FormItem>
      <FormItem label="请求地址">
        <Input v-model="editmenuItem.url" placeholder="请输入请求地址"></Input>
      </FormItem>

      <!-- <FormItem label="显示排序">
        <Input v-model="formItem.input" placeholder="Enter something..."></Input>
      </FormItem> -->
      <!-- <FormItem label="菜单状态">
        <RadioGroup v-model="formItem.radio">
          <Radio label="1">显示</Radio>
          <Radio label="2">隐藏</Radio>
        </RadioGroup>
      </FormItem> -->
    </Form>
    <!-- module中的菜单选择 -->
    <Modal class="de-module" v-model="editmenuShow2" title="选择菜单" @on-ok="ok2" @on-cancel="cancel2">
        <Form :model="formItem" :label-width="80">
          <!-- <FormItem label="关键字">
              <Input class="disinput"  v-model="formItem.input" placeholder="请输入关键字..."></Input>
              <Button type="primary" class="reselect" @click="searchFun">搜索</Button>
          </FormItem> -->
          <!-- <div class="oprate" @click="toggle"> 展开/收起</div> -->
           <FormItem label="菜单选择">
             <div class="tree-list">
              <RadioGroup  v-model="selectMenus">
                <div v-for="(item,index) in oneLevelMenu" :key="index">
                  <Radio :label="item.id">
                      <span>{{item.name}}</span>
                  </Radio>
                </div>
              </RadioGroup>
             </div>

           </FormItem>
        </Form>
    </Modal>
  </Modal>
</template>

<script>
import { resourcesAdd, resourcesUpdate } from '@/api/manage'
export default {
  name: 'mg-menu',
  props: {
    addOrUpdate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      formItem: {
        input: ''
      },
      flag: false,
      editmenuShow2: false,
      selectMenus: ''
    }
  },
  created () {},
  mounted () {},
  computed: {
    editmenuShow: {
      get () {
        return this.$store.state.module1.editmenuShow
      },
      set (val) {
        this.$store.commit('SETEDITMENUSHOW', val)
      }
    },
    editmenuItem: {
      get () {
        return this.$store.state.module1.editmenuItem
      },
      set (val) {
        this.$store.commit('SETEDITMENUITEM', val)
      }
    },
    editmenuParent: {
      get () {
        return this.$store.state.module1.editmenuParent
      },
      set (val) {
        this.$store.commit('SETEDITMENUPARENT', val)
      }
    },
    oneLevelMenu: {
      get () {
        return this.$store.state.module1.oneLevelMenu
      },
      set (val) {
        this.$store.commit('SETONELEVELMENU', val)
      }
    }
  },
  watch: {
    selectMenus (newVal, oldVal) {
      console.log(newVal)
    }
  },
  methods: {
    async ok (name) {
      if (!this.editmenuItem.name || !this.editmenuItem.perms || !this.editmenuItem.url) {
        this.$Message.info('没有输入任何内容，已取消')
        return
      }
      if (this.addOrUpdate) {
        // 新增的情况
        const newItem = {
          pid: this.editmenuParent.id ? this.editmenuParent.id : '',
          name: this.editmenuItem.name,
          perms: this.editmenuItem.perms,
          sort: null,
          type: this.editmenuParent.id ? 2 : 1,
          url: this.editmenuItem.url
        }

        const { data: { code } } = await resourcesAdd(newItem)
        if (code === 0) {
          this.$emit('getListAgain')
          this.resetAll()
          this.$Message.info('添加成功')
        }
      } else {
        // 编辑的情况
        const newItem = {
          pid: this.editmenuItem.pid,
          id: this.editmenuItem.id,
          name: this.editmenuItem.name,
          perms: this.editmenuItem.perms,
          sort: null,
          type: this.editmenuItem.type,
          url: this.editmenuItem.url
        }
        const { data: { code } } = await resourcesUpdate(newItem)
        if (code === 0) {
          this.$emit('getListAgain')
          this.resetAll()
          this.$Message.info('修改成功')
        }
      }
    },
    resetAll () {
      // 重置所有的数据（关闭，或确定后）
      this.$store.commit('SETEDITMENUITEM', {
        name: '',
        perms: '',
        url: ''
      })
      this.$store.commit('SETEDITMENUPARENT', { name: '无' })
      this.$store.commit('SETONELEVELMENU', [])
    },
    cancel () {
      this.$Message.info('已取消')
      this.resetAll()
    },
    ok2 () {
      this.$Message.info('选择成功')
      const selcetItem = this.oneLevelMenu.filter(item => item.id == this.selectMenus)[0]
      this.editmenuParent = selcetItem
    },
    cancel2 () {
      this.$Message.info('已取消')
    },
    searchFun () {

    },
    toggle () {
      this.flag = !this.flag
      this._toggleTree(this.data1, this.flag)
    },
    // 展开/收起tree多为数组
    _toggleTree (arrTree, flag) {
      arrTree.forEach(item => {
        if (Array.isArray(item.children)) {
          item.expand = flag
          this._toggleTree(item.children, flag)
        }
      })
    }

  }
}
</script>

<style lang='scss'>
.de-module{
  position: relative;
  .disinput{
    width: 70%;
  }
  .reselect{
    margin-left: 5px;
  }
  .tree-list{
    position: relative;
    min-height: 400px;
    overflow-y: auto;
  }
  .oprate{
    position: absolute;
    left: 26px;
    top: 140px;
    cursor: pointer;
  }
}

</style>
