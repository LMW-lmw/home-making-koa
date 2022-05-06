const pool = require('../app/database')

class EchartService {
  async getWorkerTop() {
    let sql = `SELECT id,name,count  from workers ORDER BY count desc LIMIT 0,10`
    try {
      const res = await pool.execute(sql)
      return {
        data: res[0],
      }
    } catch (error) {
      return {
        data: '获取失败',
      }
    }
  }
  async getCataryTop() {
    let sql = `SELECT c.id,c.name, count(*) as count from workers w JOIN category c ON w.type=c.id GROUP BY c.id`
    try {
      const res = await pool.execute(sql)
      return {
        data: res[0],
      }
    } catch (error) {
      return {
        data: '获取失败',
      }
    }
  }
}

module.exports = new EchartService()
