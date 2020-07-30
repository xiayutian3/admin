import request from '@/api/http'

const serverUrl = {
// 设备管理
  deviceList: '/device/list',
  deviceAdd: '/device/add',
  deviceDelete: '/device/delete',
  deviceEdit: '/device/edit',
  deviceExport: '/device/export'
}
// 设备管理
export const deviceList = (params) => {
  return request.get(serverUrl.deviceList, { params })
}
export const deviceAdd = (params) => {
  return request.post(serverUrl.deviceAdd, params)
}
export const deviceEdit = (params) => {
  return request.post(serverUrl.deviceEdit, params)
}
export const deviceExport = (params) => {
  return request.post(serverUrl.deviceExport, params)
}
export const deviceDelete = (params) => {
  return request.post(serverUrl.deviceDelete, params)
}
