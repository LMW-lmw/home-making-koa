const pool = require('../app/database')

class TestService {
  async cityList(body) {
    let sql = ''
    if (body.city) {
      sql = `SELECT city from cities where city like '%${body.city}%'`
    } else {
      sql = 'SELECT city from cities'
    }
    let res = await pool.execute(sql)
    return {
      data: res[0],
    }
  }
}
module.exports = new TestService()
