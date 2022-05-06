const Router = require('koa-router')
const categoryRouter = new Router()
const {
  addCheck,
  editCheck,
  deleteCheck,
} = require('../middleware/category.middleware')
const {
  getCategoryList,
  addCategory,
  editCategory,
  deleteCategory,
} = require('../controller/category.controller')
categoryRouter.post('/category/list', getCategoryList)
categoryRouter.post('/category', addCheck, addCategory)
categoryRouter.patch('/category/:id', editCheck, editCategory)
categoryRouter.delete('/category/:id', deleteCheck, deleteCategory)

module.exports = categoryRouter
