const Router = require('koa-router')
const departmentRouter = new Router()
const {
  addCheck,
  editCheck,
  deleteCheck,
} = require('../middleware/department.middleware')
const {
  getDepartmentList,
  addDepartment,
  editDepartment,
  deleteDepartment,
} = require('../controller/department.controller')
departmentRouter.post('/department/list', getDepartmentList)
departmentRouter.post('/department', addCheck, addDepartment)
departmentRouter.patch('/department/:id', editCheck, editDepartment)
departmentRouter.delete('/department/:id', deleteCheck, deleteDepartment)

module.exports = departmentRouter
