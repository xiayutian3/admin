
import { mapState, mapActions } from 'vuex'
import { getLocalStorage, clearLocalStorage } from '@/utils/localStorage'
import { getlogout, exportFile } from '@/api/home'
import { getEchartxArr } from '@/utils/arr'
import { villageList } from '@/api/village'
import { getExcel } from '@/export/index'

// module1 mixin
export const module1Mixin = {
  data () {
    return {
      // 查看图片模态框的变量数据
      modalViewShow: false,
      modalImgList: [],
      // 小区
      xiaoqu: []
    }
  },
  created () {
    // 用户刷新的时候(用户数据)
    if (this.user.username === '' || this.user.username === 'undefined ') {
      if (JSON.parse(getLocalStorage('user'))) {
        const user = JSON.parse(getLocalStorage('user'))
        this.setuser(user)
      }
    }
    if (getLocalStorage('isLogin')) {
      // 同步vuex
      this.setisLogin(getLocalStorage('isLogin'))
    }
    if (getLocalStorage('token')) {
      // 同步vuex
      this.settoken(getLocalStorage('token'))
    }
  },
  computed: {
    ...mapState({
      // isLogin: state => state.module1.isLogin || getLocalStorage('isLogin'),  //这样获得的数据不具有效应，比如用户登录刷新后，isLogin 的值为恒为ture，除非用户再次刷新界面，值才正常
      isLogin: state => state.module1.isLogin,
      token: state => state.module1.token,
      user: state => state.module1.user,
      editmenuShow: state => state.module1.editmenuShow,
      editmenuItem: state => state.module1.editmenuItem,
      editmenuParent: state => state.module1.editmenuParent,
      searchInp: state => state.module1.searchInp,
      oneLevelMenu: state => state.module1.oneLevelMenu,
      areaId: state => state.module1.areaId,
      websocketInit: state => state.module1.websocketInit
    })
  },
  methods: {
    ...mapActions([
      'setisLogin',
      'settoken',
      'setuser',
      'seteditmenuShow',
      'seteditmenuItem',
      'setsearchInp',
      'seteditmenuParent',
      'setoneLevelMenu',
      'setAreaID',
      'setwebsocketInit'
    ]),
    async exit () {
      const { data: { code } } = await getlogout()
      if (code === 0) {
        // 本地
        clearLocalStorage()
        // vuex
        this.settoken('')
        this.setisLogin(false)
        // 设置用户
        this.setuser('')
        this.$router.push('/home/login')
      }
    },
    modalImgShow (row, index) {
      // 查看图片弹框
      this.modalImgList = row.photosUrlList
      this.modalViewShow = true
    },
    modalViewClose (val) {
      // 关闭查看图片弹框
      this.modalViewShow = val
    },
    getSelectIdArr (list, property) {
      // 选中的的文件列表（id数组）
      const idArr = getEchartxArr(list, property)
      this.idArr = idArr
    },
    async exportExcl (requestName) {
      // 文件导出(后端导出功能)
      const { data: { code, data } } = await requestName({ idArray: this.idArr })
      if (code == 0) {
        // window.location.href = data
        await exportFile({ fileName: data })
      }
    },
    // 前端导出功能
    frontGetExcel (Header, filterval, filename, res) {
      getExcel(Header, filterval, filename, res)
    },
    websocketSend () {
      // 刚开始地址选择为空,随后发送选中的地址
      // const targetArea = this.$store.state.module1.areaId
      this.websocketInit.send(this.$store.state.module1.areaId)
    },
    // 获取小区信息
    async getvillage (params) {
      const {
        data: { data, code }
      } = await villageList(params)
      if (code == 0) {
        if (data) {
          const newArr = []
          for (var i = 0; i < data.length; i++) {
            newArr.push({
              value: data[i].xqxxbz,
              label: data[i].jlxxqmc
            })
          }
          this.xiaoqu = newArr
        } else {
          this.xiaoqu = []
        }
      }
    }
  }
}

// module2 mixin
