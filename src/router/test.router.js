const Router = require('koa-router')
const testRouter = new Router()
const { cityList } = require('../controller/test.controller')
testRouter.post('/city', cityList)
module.exports = testRouter
