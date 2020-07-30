// 判断对象是否为空
const objIsNull = object => {
  var arr = Object.keys(object)
  return (arr.length == 0)
}
// 深拷贝，数组对象symbol,环引用
const deepClone = (val, map = new WeakMap()) => {
  if (val === null || typeof val !== 'object') return val
  // 循环引用
  if (map.has(val)) return map.get(val)
  const clone = Array.isArray(val) ? [] : {}
  map.set(val, clone)
  const keys = Reflect.ownKeys(val)
  let len = keys.length
  while (len--) {
    clone[keys[len]] = deepClone(val[keys[len]], map)
  }
  return clone
}

export {
  objIsNull,
  deepClone
}
