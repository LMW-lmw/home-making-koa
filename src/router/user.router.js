const Router = require('koa-router')
const {
  checkUser,
  deleteCheckUser,
  editCheckUser,
} = require('../middleware/user.middleware')
const userRouter = new Router()
const {
  create,
  getUserInfoById,
  getUserList,
  deleteUserById,
  editUserById,
} = require('../controller/user.controller')

userRouter.post('/users', checkUser, create)
userRouter.get('/users/:id', getUserInfoById)
userRouter.post('/users/list', getUserList)
userRouter.delete('/users/:id', deleteCheckUser, deleteUserById)
userRouter.patch('/users/:id', editCheckUser, editUserById)
module.exports = userRouter
