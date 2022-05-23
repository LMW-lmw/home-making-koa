const Router = require('koa-router')
const { checkLogin } = require('../middleware/user.middleware')
const loginRouter = new Router({})
const { login } = require('../controller/user.controller')
loginRouter.post('/login', checkLogin, login)
module.exports = loginRouter
