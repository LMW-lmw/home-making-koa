const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const koaJwt = require('koa-jwt')

const cors = require('koa2-cors')

const { private_key } = require('./config')
const { checkToken } = require('../utils/token')

const useRouters = require('../router')
const err = require('./error-handle')

const app = new Koa()

app.use(cors())

app.use(bodyParser())

app.use(checkToken)
app.use(
  koaJwt({
    secret: private_key,
    algorithms: ['RS256'],
  }).unless({
    path: ['/login'],
  })
)

useRouters(app)

app.on('error', err)
module.exports = app
