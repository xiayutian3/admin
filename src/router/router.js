const routes = [
  {
    path: '/', redirect: '/home/index'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import(/* webpackChunkName: "index" */ '../views/Index.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
      },
      {
        path: 'role',
        name: 'role',
        component: () => import(/* webpackChunkName: "role" */ '../views/System/Role.vue')
      },
      {
        path: 'editrole',
        name: 'editrole',
        component: () => import(/* webpackChunkName: "editrole" */ '../views/System/EditRole.vue')
      },
      {
        path: 'user',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ '../views/System/User.vue')
      },
      {
        path: 'edituser',
        name: 'edituser',
        component: () => import(/* webpackChunkName: "edituser" */ '../views/System/EditUser.vue')
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: "menu" */ '../views/System/Menu.vue')
      },
      {
        path: 'community',
        name: 'community',
        component: () => import(/* webpackChunkName: "community" */ '../views/System/Community.vue')
      },
      {
        path: 'editcommunity',
        name: 'editcommunity',
        component: () => import(/* webpackChunkName: "editcommunity" */ '../views/System/EditCommunity.vue')
      },
      {
        path: 'editperson',
        name: 'editperson',
        component: () => import(/* webpackChunkName: "editperson" */ '../views/System/EditPerson.vue')
      },
      {
        path: 'peoplepasslist',
        name: 'peoplepasslist',
        component: () => import(/* webpackChunkName: "peoplepasslist" */ '../views/Passinfo/PeoplePassList.vue')
      },
      {
        path: 'carpasslist',
        name: 'carpasslist',
        component: () => import(/* webpackChunkName: "carpasslist" */ '../views/Passinfo/CarPassList.vue')
      },
      {
        path: 'carwarn',
        name: 'carwarn',
        component: () => import(/* webpackChunkName: "carwarn" */ '../views/Alarm/CarWarn.vue')
      },
      {
        path: 'warnset',
        name: 'warnset',
        component: () => import(/* webpackChunkName: "warnset" */ '../views/Alarm/WarnSet.vue')
      },
      {
        path: 'device',
        name: 'device',
        component: () => import(/* webpackChunkName: "device" */ '../views/DeviceManage/Device.vue')
      },
      {
        path: 'vehiclefile',
        name: 'vehiclefile',
        component: () => import(/* webpackChunkName: "vehiclefile" */ '../views/VehicleManage/VehicleFile.vue')
      },
      {
        path: 'vehiclelist',
        name: 'vehiclelist',
        component: () => import(/* webpackChunkName: "vehiclelist" */ '../views/VehicleManage/VehicleList.vue')
      }
    ]
  }
]
export default routes
