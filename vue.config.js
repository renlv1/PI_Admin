var path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',

  configureWebpack:(config)=>{
    config.entry.app = './src/main.js' //入口文件
  },

  chainWebpack: config => {
    // 路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@img', resolve('src/assets/img'))

    // 使用全局less变量
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },

  productionSourceMap: false,

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: []
      }
    }
  }
}

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/assets/css/var.less') // 需要全局导入的less
      ],
    })
}
