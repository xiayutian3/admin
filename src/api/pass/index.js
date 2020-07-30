import request from '@/api/http'

const serverUrl = {
  // 人员通行记录
  peoplePassList: '/doorEvent/list',
  peoplePassExport: '/doorEvent/export',
  // 车辆通行记录
  carPassList: '/aks/motorVehicleEvent/list',
  carPassExport: '/aks/motorVehicleEvent/export'
}
// 人员通行记录
export const peoplePassList = (params) => {
  return request.get(serverUrl.peoplePassList, { params })
}
export const peoplePassExport = (params) => {
  return request.post(serverUrl.peoplePassExport, params)
}
// 车辆通行记录
export const carPassList = (params) => {
  return request.get(serverUrl.carPassList, { params })
}
export const carPassExport = (params) => {
  return request.post(serverUrl.carPassExport, params)
}
