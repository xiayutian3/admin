import request from '@/api/http'

const serverUrl = {
  // 小区列表
  villageList: '/villageInfo/list'
}
// 小区列表
export const villageList = (params) => {
  return request.get(serverUrl.villageList, { params })
}
