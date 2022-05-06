const Router = require('koa-router')
const workerRouter = new Router()
const {
  addCheck,
  editCheck,
  deleteCheck,
} = require('../middleware/workers.middleware')
const {
  getWorkersList,
  addWorker,
  editWorker,
  deleteWorker,
} = require('../controller/workers.controller')
workerRouter.post('/worker/list', getWorkersList)
workerRouter.post('/worker', addCheck, addWorker)
workerRouter.patch('/worker/:id', editCheck, editWorker)
workerRouter.delete('/worker/:id', deleteCheck, deleteWorker)
module.exports = workerRouter
