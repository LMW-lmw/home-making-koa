const fs = require('fs')
const useRouters = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') {
      return
    } else {
      const route = require(`./${file}`)
      app.use(route.routes())
      // 不同状态码返回不同信息的中间件
      app.use(route.allowedMethods())
    }
  })
}
module.exports = useRouters
