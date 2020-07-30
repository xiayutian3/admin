/* eslint-disable camelcase */
// tHeader:['姓名', '年龄']     filterVal:['name', 'age']  filename = '导出列表名称', res:数据源list
const getExcel = (Header = [], filterval = [], filename = '导出列表名称', res) => {
  require.ensure([], () => {
    const { export_json_to_excel } = require('./Export2Excel')
    const tHeader = Header
    const filterVal = filterval
    const list = res
    const data = formatJson(filterVal, list)
    export_json_to_excel(tHeader, data, filename)
  })
}

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

// ************************************************************************

/// 导入函数
// 1.要上传的文件  2.数据对应的字段，名称   3.上传数据的方法 4重新获取列表的方法   5.列表数据（可以不要，上传成功后，重新请求列表，主要是更新列表数据）
const importfxx = function (obj, keyArr, uploadApi, getList, resArr) {
  // 通过DOM取文件数据
  const fileFile = obj
  var rABS = false // 是否将文件读取为二进制字符串
  var f = fileFile
  var reader = new FileReader()
  // if (!FileReader.prototype.readAsBinaryString) {
  FileReader.prototype.readAsBinaryString = function (f) {
    var binary = ''
    var rABS = false // 是否将文件读取为二进制字符串
    var wb // 读取完成的数据
    var outdata
    var reader = new FileReader()
    reader.onload = function (e) {
      var bytes = new Uint8Array(reader.result)
      var length = bytes.byteLength
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      var XLSX = require('xlsx')
      if (rABS) {
        wb = XLSX.read(btoa(fixdata(binary)), { // 手动转化
          type: 'base64'
        })
      } else {
        wb = XLSX.read(binary, {
          type: 'binary'
        })
      }
      outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])// outdata就是你想要的东西
      // console.log('reader.onload -> outdata', outdata)

      var da = [...outdata]
      // 要上传的数据
      const resData = []
      da.map(v => {
        const obj = {}
        keyArr.forEach((item) => {
          obj[item.key] = v[item.title]
        })
        // resArr.push(obj)
        resData.push(obj)
      })
      // 重新请求列表数据（将数据上传，然后更新列表数据）
      uploadApi(resData).then(({ data: { code } }) => {
        if (code == 0) {
          getList()
        }
      })
    }
    reader.readAsArrayBuffer(f)
  }

  if (rABS) {
    reader.readAsArrayBuffer(f)
  } else {
    reader.readAsBinaryString(f)
  }
}

const fixdata = (data) => { // 文件流转BinaryString
  var o = ''
  var l = 0
  var w = 10240
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}

export {
  importfxx,
  getExcel
}
