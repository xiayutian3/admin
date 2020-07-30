
// 环境的切换
let baseURL = ''
let publicPath
let mapServer
if (process.env.NODE_ENV == 'development') {
  baseURL = '/'
  mapServer = 'http://192.168.0.101:6080/arcgis/rest/services/myserver/MyGeoMapService/MapServer'
  // publicPath = 'ws://192.168.0.137:8085/websocket/chart'
} else if (process.env.NODE_ENV == 'production') {
  baseURL = 'http://22.160.35.7:8085/'
  publicPath = 'ws://22.160.35.7:8085/websocket/chart'
  mapServer = 'http://192.168.0.101:6080/arcgis/rest/services/myserver/MyGeoMapService/MapServer'
}

export {
  publicPath,
  baseURL,
  mapServer
}
