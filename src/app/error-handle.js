const {
  ErrorInPassingField,
  InformationAlreadyExists,
  DepartmentNotFound,
  RoleNotFound,
  LoginErrorWithUser,
  LoginErrorWithEnable,
  TokenError,
  DoNotHaveLoginRole,
  UserNotFound,
  CategoryNotFound,
} = require('../config/errorConfig')
// 400 参数传递错误
// 409 发生冲突
// 401 权限不够
const errorHandle = (err, ctx) => {
  switch (err.message) {
    case ErrorInPassingField:
      // 参数传递错误
      ctx.status = 400
      ctx.body = {
        data: err.message,
      }
      break
    case InformationAlreadyExists:
      ctx.status = 409
      ctx.body = {
        data: err.message,
      }
      break
    case DepartmentNotFound:
      ctx.status = 409
      ctx.body = {
        data: err.message,
      }
      break
    case RoleNotFound:
      ctx.status = 409
      ctx.body = {
        data: err.message,
      }
      break
    case LoginErrorWithUser:
      ctx.status = 403
      ctx.body = {
        data: err.message,
      }
      break
    case LoginErrorWithEnable:
      ctx.status = 403
      ctx.body = {
        data: err.message,
      }
      break
    case TokenError:
      ctx.status = 401
      ctx.body = {
        data: TokenError,
      }
      break
    case DoNotHaveLoginRole:
      ctx.status = 401
      ctx.body = {
        data: DoNotHaveLoginRole,
      }
      break
    case UserNotFound:
      ctx.status = 409
      ctx.body = {
        data: err.message,
      }
      break
    case CategoryNotFound:
      ctx.status = 409
      ctx.body = {
        data: err.message,
      }
      break
    default:
      ctx.status = 404
      ctx.body = {
        data: 'NOT FOUND',
      }
  }
}
module.exports = errorHandle
