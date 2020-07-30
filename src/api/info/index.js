import request from '@/api/http'

const serverUrl = {
  // 人员信息
  peopleList: '/peopleInfo/list',
  peopleExport: '/peopleInfo/export',
  // 车辆信息
  carList: '/motorVehicle/list',
  carEdit: '/motorVehicle/edit',
  carAdd: '/motorVehicle/add',
  carExport: '/motorVehicle/export',
  // 房屋信息
  houseList: '/houseInfo/list',
  houseExport: '/houseInfo/export',
  // 设备信息
  deviceList: '/device/list',
  deviceExport: '/device/export'
}
// 人员信息
export const peopleList = (params) => {
  return request.get(serverUrl.peopleList, { params })
}
export const peopleExport = (params) => {
  return request.post(serverUrl.peopleExport, params)
}
// 车辆信息
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
// 房屋信息
export const houseList = (params) => {
  return request.get(serverUrl.houseList, { params })
}
export const houseExport = (params) => {
  return request.post(serverUrl.houseExport, params)
}
// 设备信息
export const deviceList = (params) => {
  return request.get(serverUrl.deviceList, { params })
}
export const deviceExport = (params) => {
  return request.post(serverUrl.deviceExport, params)
}
