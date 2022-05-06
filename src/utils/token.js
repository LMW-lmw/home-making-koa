const jwt = require('jsonwebtoken')
const { public_key } = require('../app/config')
const { TokenError } = require('../config/errorConfig')
// token中间件
const verifyAuth = async (ctx, next) => {
  try {
    const auth = ctx.header.authorization
    const token = auth.replace('Bearer ', '')
    ctx.user = jwt.verify(token, public_key, {
      algorithms: ['RS256'],
    })
    await next()
  } catch (err) {
    const error = new Error(TokenError)
    ctx.app.emit('error', error, ctx)
  }
}
// token捕获
const checkToken = (ctx, next) => {
  return next()
    .then(() => {
      if (ctx.header.authorization) {
        const auth = ctx.header.authorization
        const token = auth.replace('Bearer ', '')
        const user = jwt.verify(token, public_key, {
          algorithms: ['RS256'],
        })
        ctx.user = user
      }
    })
    .catch((err) => {
      if (err.message == 'Authentication Error') {
        const error = new Error(TokenError)
        ctx.app.emit('error', error, ctx)
      } else {
        ctx.app.emit('error', err, ctx)
      }
    })
}
module.exports = {
  verifyAuth,
  checkToken,
}
