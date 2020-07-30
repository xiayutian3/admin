import request from '@/api/http'

const serverUrl = {
  // 阿克苏车辆信息
  carList: '/aks/motorVehicle/list',
  carEdit: '/aks/motorVehicle/edit',
  carAdd: '/aks/motorVehicle/add',
  carExport: '/aks/motorVehicle/export',
  carDelete: '/aks/motorVehicle/delete',
  carAddList: '/aks/motorVehicle/add/list'

}

// 阿克苏车辆信息
export const carList = (params) => {
  return request.get(serverUrl.carList, { params })
}
export const carExport = (params) => {
  return request.post(serverUrl.carExport, params)
}
export const carEdit = (params) => {
  return request.post(serverUrl.carEdit, params)
}
export const carAdd = (params) => {
  return request.post(serverUrl.carAdd, params)
}
export const carDelete = (params) => {
  return request.post(serverUrl.carDelete, params)
}
export const carAddList = (params) => {
  return request.post(serverUrl.carAddList, params)
}

// import request from '@/api/http'
// const serverUrl = {
// 设备管理
// structList: '/read/struct/list',
// structTree: '/read/struct/tree',
// unitList: '/read/struct/unitlist'
// }
// 设备管理
// export const structList = (params) => {
//   return request.get(serverUrl.structList, { params })
// }
