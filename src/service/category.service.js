const pool = require('../app/database')
class CategoryServer {
  // 获取行业信息
  async getCategoryList(body) {
    let sql = `SELECT * from category where 1 = 1`
    let sql2 = ``
    if (body.name && body.name !== '') {
      sql2 += ` and name like '%${body.name}%'`
    }
    if (body.createAt && body.createAt !== '') {
      let begin = body.createAt[0]
      let end = body.createAt[1]
      sql2 += ` and createAt between '${begin}' and '${end}'`
    }
    if (!body.offset) {
      body.offset = 0
    }
    if (!body.size) {
      body.size = 10
    }
    sql += sql2
    sql += ` LIMIT ${body.offset},${body.size}`
    let res = await pool.execute(sql)
    let count = `SELECT count(*) as totalCount from category where 1=1`
    let totalCount = await pool.execute(count)
    return {
      data: { list: res[0], ...totalCount[0][0] },
    }
  }
  // 添加行业信息
  async addCategory(body) {
    let date = new Date()
    let sql = `INSERT into category(name,createAt,updateAt) VALUES (?,'${date.toISOString()}','${date.toISOString()}')`
    try {
      await pool.execute(sql, [body.name])
      return {
        data: '添加行业成功',
      }
    } catch (error) {
      return {
        data: '添加行业失败',
      }
    }
  }
  // 修改行业信息
  async editCategory(body, id) {
    console.log(333)
    let date = new Date()
    let sql = `update category set updateAt = '${date.toISOString()}', name = ? where id = ?`
    console.log(body.name, id)
    try {
      await pool.execute(sql, [body.name, id])
      return {
        data: '修改行业成功',
      }
    } catch (error) {
      return {
        data: '修改行业失败',
      }
    }
  }
  // 删除行业
  async deleteCategory(id) {
    let sql = `delete from category where id = ?`
    try {
      await pool.execute(sql, [id])
      return {
        data: '删除行业成功',
      }
    } catch (error) {
      return {
        data: '删除行业失败',
      }
    }
  }
  async nameCheck(name) {
    let sql = `select name,id from category where name = ?`
    let res = await pool.execute(sql, [name])
    return res[0]
  }
  async idCheck(id) {
    let sql = `select name from category where id = ?`
    let res = await pool.execute(sql, [id])
    return res[0]
  }
}

module.exports = new CategoryServer()
