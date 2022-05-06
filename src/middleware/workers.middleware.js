const { checkParameters, checkForPresence } = require('../utils/check')
const {
  ErrorInPassingField,
  InformationAlreadyExists,
  DepartmentNotFound,
} = require('../config/errorConfig')
const { returnError } = require('../utils/util')
const service = require('../service/workers.service')
const addCheck = async (ctx, next) => {
  for (let key in ctx.request.body) {
    ctx.request.body[key] = ctx.request.body[key].replace(/\s*/g, '')
  }
  const parametersFlag = checkParameters(
    ctx.request.body.area,
    ctx.request.body.city,
    ctx.request.body.name,
    ctx.request.body.province,
    ctx.request.body.remuneration,
    ctx.request.body.telephone,
    ctx.request.body.type
  )
  if (!parametersFlag) {
    return returnError(ctx, ErrorInPassingField)
  }
  await next()
}
const editCheck = async (ctx, next) => {
  const id = ctx.request.params.id
  for (let key in ctx.request.body) {
    ctx.request.body[key] = ctx.request.body[key].replace(/\s*/g, '')
  }
  const parametersFlag = checkParameters(
    ctx.request.body.area,
    ctx.request.body.city,
    ctx.request.body.name,
    ctx.request.body.province,
    ctx.request.body.remuneration,
    ctx.request.body.telephone,
    ctx.request.body.type,
    id
  )
  if (!parametersFlag) {
    return returnError(ctx, ErrorInPassingField)
  }
  const iddbCheck = await checkForPresence(service.idCheck, [id])
  if (!iddbCheck) {
    return returnError(ctx, DepartmentNotFound)
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
