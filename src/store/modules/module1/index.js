const module1 = {
  state: {
    isLogin: false,
    token: '',
    user: {
      username: ''
    },
    // isLogin: false,
    // token: '',
    // user: '',
    editmenuShow: false,
    editmenuItem: {
      name: '',
      perms: '',
      url: ''
      // radio: '1' //状态
    },
    editmenuParent: {
      name: '无'
    },
    searchInp: '',
    oneLevelMenu: [],
    // 公共head选取区域的最后一级id
    areaId: '',
    websocketInit: ''
  },
  mutations: {
    SETISLOGIN (state, val) {
      state.isLogin = val
    },
    SETTOKEN (state, val) {
      state.token = val
    },
    SETUSER (state, val) {
      state.user = val
    },
    SETEDITMENUSHOW (state, val) {
      state.editmenuShow = val
    },
    SETEDITMENUITEM (state, val) {
      state.editmenuItem = val
    },
    SETEDITMENUPARENT (state, val) {
      state.editmenuParent = val
    },
    SETSEARCHINP (state, val) {
      state.searchInp = val
    },
    SETONELEVELMENU (state, val) {
      state.oneLevelMenu = val
    },
    SETAREAID (state, val) {
      state.areaId = val
    },
    SETWEBSOCKETINIT (state, val) {
      state.websocketInit = val
    }
  },
  actions: {
    setisLogin ({ commit }, val) {
      commit('SETISLOGIN', val)
    },
    settoken ({ commit }, val) {
      commit('SETTOKEN', val)
    },
    setuser ({ commit }, val) {
      commit('SETUSER', val)
    },
    seteditmenuShow ({ commit }, val) {
      commit('SETEDITMENUSHOW', val)
    },
    seteditmenuItem ({ commit }, val) {
      commit('SETEDITMENUITEM', val)
    },
    setsearchInp ({ commit }, val) {
      commit('SETSEARCHINP', val)
    },
    seteditmenuParent ({ commit }, val) {
      commit('SETEDITMENUPARENT', val)
    },
    setoneLevelMenu ({ commit }, val) {
      commit('SETONELEVELMENU', val)
    },
    setAreaID ({ commit }, val) {
      commit('SETAREAID', val)
    },
    setwebsocketInit ({ commit }, val) {
      commit('SETWEBSOCKETINIT', val)
    }
  },
  getters: {

  }
}
export default module1
