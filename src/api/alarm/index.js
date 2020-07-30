import request from '@/api/http'

const serverUrl = {
  // 告警记录
  alarmList: '/warning/list',
  alarmExport: '/warning/export',
  // 车辆告警信息列表
  carWarn: '/aks/motorVehicleWarning/list',
  carWarnExport: '/aks/motorVehicleWarning/export',
  carEdit: '/aks/motorVehicleWarning/edit',
  carDelete: '/aks/motorVehicleWarning/delete',

  // 导出人员告警信息
  peopleWarn: '/peopleWarning/list',
  peopleWarnExport: '/peopleWarning/export',
  // 设备告警信息列表
  deviceWarn: '/deviceWarning/list',
  deviceWarnExport: '/deviceWarning/export',

  // 阿克苏车辆布控信息管理
  askCarList: '/aks/motorVehicleControl/list',
  askCarAdd: '/aks/motorVehicleControl/add',
  askCarAuto: '/aks/motorVehicleControl/auto',
  askCarEdit: '/aks/motorVehicleControl/edit',
  askCarDelete: '/aks/motorVehicleControl/delete'

}
// 告警记录
export const alarmList = (params) => {
  return request.get(serverUrl.alarmList, { params })
}
export const alarmExport = (params) => {
  return request.post(serverUrl.alarmExport, params)
}
// 车辆告警信息
export const carWarn = (params) => {
  return request.get(serverUrl.carWarn, { params })
}
export const carWarnExport = (params) => {
  return request.post(serverUrl.carWarnExport, params)
}
export const carEdit = (params) => {
  return request.post(serverUrl.carEdit, params)
}
export const carDelete = (params) => {
  return request.post(serverUrl.carDelete, params)
}
// 人员告警信息
export const peopleWarn = (params) => {
  return request.get(serverUrl.peopleWarn, { params })
}
export const peopleWarnExport = (params) => {
  return request.post(serverUrl.peopleWarnExport, params)
}
// 设备告警信息
export const deviceWarn = (params) => {
  return request.get(serverUrl.deviceWarn, { params })
}
export const deviceWarnExport = (params) => {
  return request.post(serverUrl.deviceWarnExport, params)
}

// 阿克苏车辆布控信息管理
export const askCarList = (params) => {
  return request.get(serverUrl.askCarList, { params })
}
export const askCarAdd = (params) => {
  return request.post(serverUrl.askCarAdd, params)
}
export const askCarAuto = (params) => {
  return request.post(`${serverUrl.askCarAuto}/${params}`)
}
export const askCarEdit = (params) => {
  return request.post(serverUrl.askCarEdit, params)
}
export const askCarDelete = (params) => {
  return request.post(serverUrl.askCarDelete, params)
}
