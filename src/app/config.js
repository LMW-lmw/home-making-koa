const env = require('dotenv')
const fs = require('fs')
const path = require('path')
env.config()
const private_key = fs.readFileSync(
  path.resolve(__dirname, './keys/private.key')
)
const public_key = fs.readFileSync(path.resolve(__dirname, './keys/public.key'))
module.exports = {
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = process.env
module.exports.private_key = private_key
module.exports.public_key = public_key
