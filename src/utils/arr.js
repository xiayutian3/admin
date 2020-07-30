/* eslint-disable no-sequences */
/**
 * 菜单以为数组转换为树状数组
 * @param {*} list
 */
function convert (list) {
  const res = []
  // eslint-disable-next-line no-return-assign
  const map = list.reduce((res, v) => (res[v.id] = v, res), {})
  for (const item of list) {
    if (item.type == 1) {
      res.push(item)
      continue
    }
    if (item.pid in map) {
      const parent = map[item.pid]
      parent.children = parent.children || []
      parent.children.push(item)
    }
  }
  return res
}
/**
 * 获取第一级菜单数组
 * @param {*} list
 */
const getOneLevelMenu = list => {
  const newArr = list.filter(item => item.type == 1)
  return newArr
}

/**
 * 与e-chart相关，返回xAxis数组，{xArr:[]}，只要其中一个字段的值
 * 如：[{value:12,name:aa},{...}]
 */
const getEchartxArr = (arr, name) => {
  const xArr = []
  arr.forEach(item => {
    xArr.push(item[name])
  })
  return xArr
}

// 一位数组转换为多为数组的function,[1,2,3,4,5]转为[[1,2],[3,4],[5]]
/**
 *
 * @param {*} arr 传入的一维数组
 * @param {*} num 每个2维数组包含几个数据
 * @param {*} d 返回的数组
 */
const oneToTwo = (arr, num, d = []) => {
  var c = []
  if (arr.length != 0) {
    num = arr.length > num ? num : arr.length
    for (var i = 0; i < num; i++) {
      c.push(arr.shift())
    }
    d.push(c)
    c = []
    oneToTwo(arr, num, d)
  }
  return d
}

export {
  convert,
  getOneLevelMenu,
  getEchartxArr,
  oneToTwo
}
