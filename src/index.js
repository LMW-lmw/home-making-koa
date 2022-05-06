const app = require('./app/index')
const envConfig = require('./app/config')
require('./app/database')

app.listen(envConfig.APP_PORT, () => {
  console.log(`服务器启动，端口号${envConfig.APP_PORT}`)
})
