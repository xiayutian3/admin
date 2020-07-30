import request from '@/api/http'

const serverUrl = {
  // 角色管理
  roleList: '/system/role/list',
  roleAdd: '/system/role/add',
  rolePerm: '/baseArea/tree',
  menuPerm: '/system/resources/findResourcesByResources',
  roleDelete: '/system/role/delete',
  roleUpdate: '/system/role/update',
  updatePassword: '/system/user/updatePassword',
  // 用户管理
  userList: '/system/user/list',
  userAdd: '/system/user/add',
  userCheck: '/system/user/findUserByUser',
  userDelete: '/system/user/delete',
  userUpdate: '/system/user/update',
  selectByPrimaryKey: '/system/user/selectByPrimaryKey',
  // 菜单管理
  resourcesList: '/system/resources/list',
  resourcesDelete: '/system/resources/delete',
  resourcesAdd: '/system/resources/add',
  resourcesUpdate: '/system/resources/update',
  resourcesPidGetId: '/system/resources/selectByPidGetId',
  // 小区管理
  addVillage: '/villageInfo/add',
  deleteVillage: '/villageInfo/delete',
  editVillage: '/villageInfo/edit',
  listVillage: '/villageInfo/list'

}
// 角色管理
export const roleList = (params) => {
  return request.get(serverUrl.roleList, { params })
}
export const roleAdd = (params) => {
  return request.post(serverUrl.roleAdd, params)
}
export const rolePerm = (params) => {
  return request.get(`${serverUrl.rolePerm}/${params}`)
}
export const menuPerm = () => {
  return request.post(serverUrl.menuPerm)
}
export const roleDelete = (params) => {
  return request.post(serverUrl.roleDelete, params)
}
export const roleUpdate = (params) => {
  return request.put(serverUrl.roleUpdate, params)
}
export const updatePassword = (params) => {
  return request.post(serverUrl.updatePassword, params)
}
// 用户管理
export const userList = (params) => {
  return request.get(serverUrl.userList, { params })
}
export const userAdd = (params) => {
  return request.post(serverUrl.userAdd, params)
}
export const userCheck = (params) => {
  return request.get(serverUrl.userCheck, { params })
}
export const userDelete = (params) => {
  return request.post(serverUrl.userDelete, params)
}
export const userUpdate = (params) => {
  return request.put(serverUrl.userUpdate, params)
}

export const selectByPrimaryKey = (params) => {
  return request.get(serverUrl.selectByPrimaryKey, { params })
}
// 菜单管理
export const resourcesList = (params) => {
  return request.get(serverUrl.resourcesList, { params })
}

export const resourcesDelete = (params) => {
  return request.post(serverUrl.resourcesDelete, params)
}
export const resourcesAdd = (params) => {
  return request.post(serverUrl.resourcesAdd, params)
}

export const resourcesUpdate = (params) => {
  return request.post(serverUrl.resourcesUpdate, params)
}

export const resourcesPidGetId = (params) => {
  return request.get(serverUrl.resourcesPidGetId, { params })
}

// 小区管理
export const addVillage = (params) => {
  return request.post(serverUrl.addVillage, params)
}
export const deleteVillage = (params) => {
  return request.post(serverUrl.deleteVillage, params)
}

export const editVillage = (params) => {
  return request.post(serverUrl.editVillage, params)
}

export const listVillage = (params) => {
  return request.get(serverUrl.listVillage, { params })
}

// request.get('/read/struct/list').then(res => {
//   console.log('/read/struct/list', res)
// })
