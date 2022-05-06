const Router = require('koa-router')
const { checkLogin } = require('../middleware/user.middleware')
const loginRouter = new Router({})
const { login } = require('../controller/user.controller')
loginRouter.post('/login', checkLogin, login)
loginRouter.get('/test', (ctx, next) => {
  ctx.body = '111'
})
module.exports = loginRouter
