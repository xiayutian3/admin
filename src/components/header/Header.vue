<template>
  <div class="de-head">
    <div class="title">
      <span class="inner">车辆汇聚平台</span>
    </div>
    <div class="logo">
      <img class="logo_img" :src="logo" alt="德奥" />
      <span>德奥技术</span>
    </div>
    <div class="user" v-if="isLogin">
      <div class="name">
        <img style="margin-right:5px" src="../../assets/img/user2.png" alt />
        <span>{{user.username}}</span>
      </div>
      <img class="set" src="../../assets/img/set.png" alt @click="$router.push('/home/editperson')" />
      <img src="../../assets/img/exit.png" alt @click="exit" />
    </div>
    <div class="de-head-down" v-if="isLogin">
      <div class="menus-wrrap">
        <div class="menus">
          <div class="menus-btn" v-for="(item,idx) in menus" :key="idx">
            <Button
              class="menus-item"
              :class="{act:`index${idx}` === routerName}"
              v-if="item.path"
              @click="pushUrl(item)"
            >{{item.name}}</Button>
            <Dropdown v-else @on-click="pushUrl">
              <Button class="menus-item" :class="{act:`index${idx}` === routerName}">
                {{item.name}}
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="(subItem,idx) in item.children"
                  :key="idx"
                  :name="JSON.stringify(subItem)"
                >{{subItem.name}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div class="info"></div>
      </div>
      <div class="choose-wrap">
        <div class="choose">
          <Cascader
            placeholder="请选择阿克苏相关区域"
            :data="dataCascader"
            @on-change="hangdleCascader"
            :load-data="loadDataArea"
          ></Cascader>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { module1Mixin } from '@/utils/mixin'
import { baseAreaTree } from '@/api/home'
export default {
  name: 'de-head',
  mixins: [module1Mixin],
  props: {},
  data () {
    return {
      menus: [
        { name: '首页', path: '/' },
        { name: '设备管理', path: '/home/device' },
        {
          name: '车辆管理',
          children: [
            { name: '车辆列表', path: '/home/vehiclelist' },
            { name: '车辆档案', path: '/home/vehiclefile' }
          ]
        },
        {
          name: '通行记录',
          children: [
            // { name: '人员通行', path: '/home/peoplepasslist' },
            { name: '车辆通行', path: '/home/carpasslist' }
          ]
        },
        {
          name: '告警管理',
          children: [
            { name: '车辆告警', path: '/home/carwarn' },
            // { name: '设备告警', path: '/home/devicewarn' },
            // { name: '人员告警', path: '/home/peoplewarn' },
            { name: '告警设置', path: '/home/warnset' }
          ]
        },
        {
          name: '系统管理',
          children: [
            { name: '角色管理', path: '/home/role' },
            { name: '用户管理', path: '/home/user' },
            { name: '菜单管理', path: '/home/menu' },
            { name: '小区管理', path: '/home/community' }
          ]
        }
      ],
      logo: require('../../assets/img/img_logo.png'),
      dataCascader: [
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
                }
              ]
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
      ],
      routerName: 'index0'
    }
  },
  created () {
    // 请求全部地区
    // this.initDataArea(0)
    // 只请求阿克苏
    this.initDataArea(652900)
    const routerName = this.$route.name
    this.routerAddress(routerName)
  },
  computed: {},
  methods: {
    async initDataArea (params) {
      // 头部地区选择框
      const {
        data: { code, data }
      } = await baseAreaTree(params)
      if (code == 0) {
        data.forEach(item => {
          item.label = item.areaName
          item.value = item.id
          // 因为阿克苏只到县，下面这两行暂时不要
          // item.loading = false
          // item.children = []
        })
        this.dataCascader = data
      }
    },
    async loadDataArea (item, callback) {
      item.loading = false

      const {
        data: { code, data }
      } = await baseAreaTree(item.id)
      if (code == 0) {
        item.loading = false
        data.forEach(item => {
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
    // header路由跳转
    pushUrl (item) {
      let newItem = ''
      if (typeof item === 'string') {
        newItem = JSON.parse(item)
      } else {
        newItem = item
      }

      // 路由跳转

      this.$router.push(newItem.path, () => {})
    },
    hangdleCascader (selectArr) {
      const lastId = selectArr.pop()
      //
      // console.log(lastId)
      // 修改areaId
      this.$store.commit('SETAREAID', lastId)

      // 发送id给后端 获取 areaId的首页，相关数据
      // 不需要 websocket 推送了，改成请求接口 10s一次
      // this.websocketSend()
    },
    // 判断路由地址，点亮导航
    routerAddress (name) {
      switch (name) {
        case 'index':
          this.routerName = 'index0'
          break
        case 'device':
          this.routerName = 'index1'
          break
        case 'vehiclelist':
        case 'vehiclefile':
          this.routerName = 'index2'
          break
        case 'carwarn':
        case 'devicewarn':
        case 'peoplewarn':
        case 'warnset':
          this.routerName = 'index4'
          break
        case 'community':
        case 'menu':
        case 'user':
        case 'role':
          this.routerName = 'index5'
          break
        case 'peoplepasslist':
        case 'carpasslist':
          this.routerName = 'index3'
          break
      }
    }
  },
  components: {},
  watch: {
    $route (newVal, oldVal) {
      // console.log(newVal.name)
      this.routerAddress(newVal.name)
    }
  }
}
</script>
<style lang="scss">
.de-head {
  position: relative;
  // background-color: #09233d;
  .title {
    padding-top: 12px;
    height: 92px;
    font-size: 42px;
    text-align: center;
    background: url("../../assets/img/top-div.png");
    background-size: 100% 100%;
    .inner {
      background: linear-gradient(to bottom, #fff, #6baaff);
      background-clip: text;
      color: transparent;
    }
  }
  .logo {
    position: absolute;
    left: 20px;
    top: 6px;
    display: flex;
    align-items: center;
    font-size: 22px;
    .logo_img {
      width: 30px;
      height: 30px;
      margin-right: 5px;
    }
  }
  .user {
    position: absolute;
    top: 100px;
    right: 20px;
    display: flex;
    cursor: pointer;
    .name {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #2d86fe;
    }
    .set {
      margin-left: 20px;
      margin-right: 20px;
    }
  }
  .menus-wrrap {
    display: flex;
    padding-left: 20px;
    justify-content: space-between;
    align-items: flex-end;
    .menus {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 690px;
      height: 32px;
      .menus-btn {
        // flex: 1;
        display: flex;
        text-align: center;
        line-height: 30px;
        .menus-item {
          &.act {
            background: url("../../assets/img/select-box.png") no-repeat;
            background-size: 100% 100%;
            color: #fff;
          }
          &:hover {
            background: #cae1ff;
            color: #fff;
          }
          // flex: 1;
          width: 106px;
          background: #14346d;
          border: 1px solid #104f6e;
          color: #2d86fe;
        }
      }
    }
    .info {
      display: flex;
      // width: 450px;
      // height: 40px;
      .partc {
        flex: 1;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      .part1 {
        display: flex;
        justify-content: center;
        align-items: center;
        .name {
          margin-left: 2px;
        }
      }
    }
  }
  .choose-wrap {
    display: flex;
    align-items: center;
    height: 45px;
    // background-color: #0a233c;
    .ivu-input {
      &::placeholder {
        color: #fff;
      }
      color: #fff;
      background-color: #1a3d8f;
      border: 1px solid #2d6bff;
    }
    .ivu-cascader-arrow {
      color: #fff;
    }
    .choose {
      display: flex;
      justify-content: space-between;
      margin-left: 20px;
      padding-top: 7px;
      padding-bottom: 7px;
      width: 250px;
      .sel-name {
        position: relative;
        display: block;
        width: 250px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        color: #999;
        .sel-iocn {
          position: absolute;
          right: 5px;
          top: 5px;
        }
      }
    }
  }
  .de-head-other {
    height: 40px;
    // background-color: #09233d;
  }
}
</style>
