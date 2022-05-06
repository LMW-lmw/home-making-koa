const crypto = require('crypto')
function returnError(ctx, errorMessage) {
  const error = new Error(errorMessage)
  return ctx.app.emit('error', error, ctx)
}
function md5passwrod(password) {
  const md5 = crypto.createHash('md5')
  const res = md5.update(password).digest('hex')
  return res
}
module.exports = {
  returnError,
  md5passwrod,
}
