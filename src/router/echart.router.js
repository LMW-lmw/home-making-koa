const Router = require('koa-router')
const echartRouter = new Router()
const {
  getWorkerTop,
  getCataryTop,
} = require('../controller/echart.controller')
echartRouter.get('/echart/worker/top', getWorkerTop)
echartRouter.get('/echart/catary/top', getCataryTop)
module.exports = echartRouter
