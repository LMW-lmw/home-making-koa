const Router = require('koa-router')
const roleRouter = new Router()
const {
  deleteCheck,
  addCheck,
  editCheck,
} = require('../middleware/role.middleware')
const {
  getUserMenuById,
  getMenuList,
  getRoleList,
  deleteRole,
  addRole,
  editRole,
} = require('../controller/role.controller')
roleRouter.get('/role/:id/menu', getUserMenuById)
roleRouter.post('/menu/list', getMenuList)
roleRouter.post('/role/list', getRoleList)
roleRouter.delete('/role/:id', deleteCheck, deleteRole)
roleRouter.post('/role', addCheck, addRole)
roleRouter.patch('/role/:id', editCheck, editRole)
module.exports = roleRouter
