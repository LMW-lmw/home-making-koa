const mysql = require('mysql2')
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = require('./config')
const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  queueLimit: 20,
})
const pool2 = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  queueLimit: 20,
  multipleStatements: true,
})
pool.getConnection((err, conn) => {
  conn.connect((err) => {
    if (err) {
      console.log('数据库连接失败')
    } else {
      console.log('数据库连接成功')
    }
  })
})
pool2.getConnection((err, conn) => {
  conn.connect((err) => {
    if (err) {
      console.log('数据库连接失败')
    } else {
      console.log('数据库连接成功')
    }
  })
})
module.exports = pool.promise()
module.exports.pool2 = pool2.promise()
