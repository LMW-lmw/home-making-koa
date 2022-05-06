const { checkParameters, checkForPresence } = require('../utils/check')
const {
  ErrorInPassingField,
  InformationAlreadyExists,
  DepartmentNotFound,
} = require('../config/errorConfig')
const { returnError } = require('../utils/util')
const service = require('../service/department.service')
const addCheck = async (ctx, next) => {
  if (ctx.request.body.name) {
    ctx.request.body.name = ctx.request.body.name.replace(/\s*/g, '')
  }
  if (ctx.request.body.leader) {
    ctx.request.body.leader = ctx.request.body.leader?.replace(/\s*/g, '')
  }
  const parametersFlag = checkParameters(
    ctx.request.body.name,
    ctx.request.body.leader
  )
  if (!parametersFlag) {
    return returnError(ctx, ErrorInPassingField)
  }
  const namedbCheck = await checkForPresence(service.nameCheck, [
    ctx.request.body.name,
  ])
  if (namedbCheck) {
    return returnError(ctx, InformationAlreadyExists)
  }
  await next()
}
const editCheck = async (ctx, next) => {
  const id = ctx.request.params.id
  if (ctx.request.body.name) {
    ctx.request.body.name = ctx.request.body.name.replace(/\s*/g, '')
  }
  if (ctx.request.body.leader) {
    ctx.request.body.leader = ctx.request.body.leader?.replace(/\s*/g, '')
  }

  const parametersFlag = checkParameters(
    ctx.request.body.name,
    ctx.request.body.leader
  )
  if (!parametersFlag) {
    return returnError(ctx, ErrorInPassingField)
  }
  const iddbCheck = await checkForPresence(service.idCheck, [id])
  if (!iddbCheck) {
    return returnError(ctx, DepartmentNotFound)
  }
  const namedbCheck = await checkForPresence(service.nameCheck, [
    ctx.request.body.name,
  ])
  if (namedbCheck && namedbCheck.id != id) {
    return returnError(ctx, InformationAlreadyExists)
  }
  await next()
}

const deleteCheck = async (ctx, next) => {
  const id = ctx.request.params.id
  const iddbCheck = await checkForPresence(service.idCheck, [id])
  if (!iddbCheck) {
    return returnError(ctx, DepartmentNotFound)
  }
  await next()
}
module.exports = {
  addCheck,
  editCheck,
  deleteCheck,
}
