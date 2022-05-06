const { checkParameters, checkForPresence } = require('../utils/check')
const {
  ErrorInPassingField,
  InformationAlreadyExists,
  CategoryNotFound,
} = require('../config/errorConfig')
const { returnError } = require('../utils/util')
const service = require('../service/category.service')
const addCheck = async (ctx, next) => {
  let body = ctx.request.body
  let parameterFlag = checkParameters(body.name.trim())
  if (!parameterFlag) {
    return returnError(ctx, ErrorInPassingField)
  }
  ctx.request.body.name = body.name.replace(/\s*/g, '')
  const dbCheck = await checkForPresence(service.nameCheck, [
    ctx.request.body.name,
  ])
  if (dbCheck) {
    return returnError(ctx, InformationAlreadyExists)
  }
  await next()
}
const editCheck = async (ctx, next) => {
  const id = ctx.request.params.id
  let body = ctx.request.body

  let parameterFlag = checkParameters(body.name.trim(), id)
  if (!parameterFlag) {
    return returnError(ctx, ErrorInPassingField)
  }
  const editdbCheck = await checkForPresence(service.idCheck, [id])
  if (!editdbCheck) {
    return returnError(ctx, CategoryNotFound)
  }
  ctx.request.body.name = body.name.replace(/\s*/g, '')
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

  let parameterFlag = checkParameters(id)
  if (!parameterFlag) {
    return returnError(ctx, ErrorInPassingField)
  }
  const editdbCheck = await checkForPresence(service.idCheck, [id])
  if (!editdbCheck) {
    return returnError(ctx, CategoryNotFound)
  }
  await next()
}
module.exports = {
  addCheck,
  editCheck,
  deleteCheck,
}
