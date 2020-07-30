// const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  // delete console
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     // 为生产环境修改配置...
  //     config.plugins.push(
  //       // 生产环境自动删除console
  //       new TerserPlugin({
  //         terserOptions: {
  //           // 删除注释
  //           output: {
  //             comments: false
  //           },
  /// / 删除console debugger 删除警告
  //           warnings: false,
  //           compress: {
  //             drop_debugger: true,
  //             drop_console: true,
  //             pure_funcs: ['console.log']
  //           }
  //         },
  //         sourceMap: false,
  //         parallel: true  // 使用多进程并行运行以提高构建速度
  //       })
  //     )
  //   }
  // },
  chainWebpack: config => {
    config.resolve.alias
      .set('@@', resolve('src/components'))
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '德奥科技'
        return args
      })
      // delete console
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('terserPlugin')
        .use('terser-webpack-plugin', [{
          terserOptions: {
            // 使用多进程并行运行以提高构建速度
            parallel: true,
            // 删除注释
            output: {
              comments: false
            },
            // 删除console debugger 删除警告
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          }
        }])
        .end()
    }
  },
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/': {
        target: 'http://192.168.0.137:8085/',
        pathRewrite: { '^/api': '/' },
        xfwd: true,
        ws: false
      }
    }
  }
}
