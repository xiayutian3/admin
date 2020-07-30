import request from '@/api/http'

const serverUrl = {
  // 告警记录
  structList: '/read/struct/list',
  structTree: '/read/struct/tree',
  unitList: '/read/struct/unitlist'
}
// 人员通行记录
export const structList = (params) => {
  return request.get(serverUrl.structList, { params })
}
export const structTree = (params) => {
  return request.get(serverUrl.structTree, { params })
}
export const unitList = (params) => {
  return request.get(serverUrl.unitList, { params })
}
