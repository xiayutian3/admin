// 请求管理
import request from '@/api/http'

const serverUrl = {
  login: '/login',
  logout: '/logout',
  baseAreaTree: '/baseArea/tree', // 头部获取区域
  aksVehicleChart: '/aks/motorVehicle/chart/type', // 阿克苏车辆管控
  aksChartProvince: '/aks/motorVehicle/chart/province', // 依据省份获取车辆图表
  aksChartVillage: '/aks/motorVehicleEvent/chart/village', // 车辆出入统计
  exportFile: '/export/file', // 阿克苏车辆  所有的导出文件都是这个接口
  aksWarnChart: '/aks/motorVehicleWarning/chart/stats', // 右下角区域（统计）
  mapList: '/aks/motorVehicleEvent/track/list' // 地图预警点
}
export const getLogin = (params) => {
  return request.post(serverUrl.login, params)
}
export const getlogout = () => {
  return request.post(serverUrl.logout)
}
export const baseAreaTree = (params) => {
  return request.post(`${serverUrl.baseAreaTree}/${params}`)
}
export const aksVehicleChart = () => {
  return request.get(serverUrl.aksVehicleChart)
}
export const mapList = (params) => {
  return request.get(serverUrl.mapList, { params })
}
export const aksChartAll = () => {
  return request.get(serverUrl.aksChartAll)
}
export const aksChartProvince = () => {
  return request.get(serverUrl.aksChartProvince)
}
export const aksChartVillage = (params) => {
  return request.get(serverUrl.aksChartVillage, { params })
}
// 文件导出
export const exportFile = (params) => {
  return request.get(serverUrl.exportFile, { params })
}
export const aksWarnChart = (params) => {
  return request.get(serverUrl.aksWarnChart, { params })
}
// let serverUrl = {
//   getList: '/users',
//   createUser: '/users',
//   updateUser: '/users',
//   deleteUser: '/users'
// }

// export const getList = () => {
//   return request.get(serverUrl.getList)
// }
// export const createUser = (params) => {
//   return request.post(serverUrl.createUser, params)
// }
// export const updateUser = (id, params) => {
//   return request.patch(`${serverUrl.updateUser}/${id}`, params)
// }
// export const deleteUser = (id) => {
//   return request.delete(`${serverUrl.deleteUser}/${id}`)
// }
