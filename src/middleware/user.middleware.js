const { checkParameters, checkForPresence } = require('../utils/check')
const {
  ErrorInPassingField,
  InformationAlreadyExists,
  DepartmentNotFound,
  RoleNotFound,
  LoginErrorWithUser,
  LoginErrorWithEnable,
  DoNotHaveLoginRole,
  UserNotFound,
} = require('../config/errorConfig')
const { returnError, md5passwrod } = require('../utils/util')
const service = require('../service/user.service')
// 注册时判断用户是否存在以及参数是否正确的中间件
const checkUser = async (ctx, next) => {
  let { name, password, cellphone, department, role, realname } =
    ctx.request.body
  // 判断密码是否为空格或者没传,对密码进行md5加密
  if (!password) {
    ctx.request.body.password = md5passwrod('666')
  }
  if (password) {
    password = password.replace(/\s*/g, '')
    if (password !== '') {
      ctx.request.body.password = md5passwrod(password)
    }
  }
  // 去除用户名空格
  if (name) {
    ctx.request.body.name = name.replace(/\s*/g, '')
  }
  // 检查传入字段是否为空或没传
  const parametersFlag = checkParameters(
    ctx.request.body.name,
    ctx.request.body.password,
    cellphone,
    department,
    role,
    realname
  )
  if (!parametersFlag) {
    const error = new Error(ErrorInPassingField)
    return ctx.app.emit('error', error, ctx)
  }
  // 判断用户是否存在
  let userName = await service.getUserByName(name)
  if (userName.length !== 0) {
    // const error = new Error(InformationAlreadyExists)
    // return ctx.app.emit('error', error, ctx)
    return returnError(ctx, InformationAlreadyExists)
  }
  // 判断传入的department是否存在，如果存在就替换成id的形式
  let departmentFlag = await checkForPresence(service.getDepartmentIdByName, [
    department,
  ])
  if (!departmentFlag) {
    return returnError(ctx, DepartmentNotFound)
  } else {
    ctx.request.body.department = departmentFlag.id
  }

  // 判断传入的role是否存在，如果存在就替换成id的形式
  let roleFlag = await checkForPresence(service.getRoleIdByName, [role])
  if (!roleFlag) {
    return returnError(ctx, RoleNotFound)
  } else {
    ctx.request.body.role = roleFlag.id
  }

  await next()
}

// 登录时判断用户是否存在中间件
const checkLogin = async (ctx, next) => {
  let { name, password } = ctx.request.body
  const parametersFlag = checkParameters(name, password)
  if (!parametersFlag) {
    const error = new Error(ErrorInPassingField)
    return ctx.app.emit('error', error, ctx)
  }
  password = md5passwrod(password)
  let loginFlag = await checkForPresence(service.checkLogin, [name, password])
  if (!loginFlag) {
    return returnError(ctx, LoginErrorWithUser)
  } else {
    if (loginFlag.enable === 0) {
      return returnError(ctx, LoginErrorWithEnable)
    }
    if (loginFlag.roleId === null) {
      return returnError(ctx, DoNotHaveLoginRole)
    }
  }
  ctx.user = loginFlag
  await next()
}

// 删除用户时判断用户是否存在
const deleteCheckUser = async (ctx, next) => {
  const id = ctx.request.params.id
  const paramsFlag = checkParameters(id)
  if (!paramsFlag) {
    const error = new Error(ErrorInPassingField)
    return ctx.app.emit('error', error, ctx)
  }
  let res = await service.deleteCheckUserById(id)
  if (res.length === 0) {
    const error = new Error(UserNotFound)
    return ctx.app.emit('error', error, ctx)
  }
  await next()
}

// 编辑用户时的参数验证
const editCheckUser = async (ctx, next) => {
  const id = ctx.request.params.id
  for (let key in ctx.request.body) {
    if (typeof ctx.request.body[key] == 'string') {
      ctx.request.body[key] = ctx.request.body[key].replace(/\s*/g, '')
    }
  }

  const paramsFlag = checkParameters(id)
  if (!paramsFlag) {
    const error = new Error(ErrorInPassingField)
    return ctx.app.emit('error', error, ctx)
  }

  if (ctx.request.body.department) {
    let departmentFlag = await checkForPresence(service.getDepartmentIdByName, [
      ctx.request.body.department,
    ])
    if (!departmentFlag) {
      return returnError(ctx, DepartmentNotFound)
    } else {
      ctx.request.body.department = departmentFlag.id
    }
  }
  if (ctx.request.body.role) {
    let roleFlag = await checkForPresence(service.getRoleIdByName, [
      ctx.request.body.role,
    ])
    if (!roleFlag) {
      return returnError(ctx, RoleNotFound)
    } else {
      ctx.request.body.role = roleFlag.id
    }
  }
  if (ctx.request.body.name) {
    ctx.request.body.name = ctx.request.body.name.replace(/\s*/g, '')
    const namedbCheck = await checkForPresence(service.nameCheck, [
      ctx.request.body.name,
    ])
    if (namedbCheck && namedbCheck.id != id) {
      return returnError(ctx, InformationAlreadyExists)
    }
  }

  await next()
}
module.exports = {
  checkUser,
  checkLogin,
  deleteCheckUser,
  editCheckUser,
}
