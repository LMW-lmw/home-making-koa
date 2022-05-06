const pool = require('../app/database')
class DepartmentServer {
  // 查询部门
  async getDepartmentList(body) {
    let sql = `SELECT * from department where 1 = 1`
    if (body.name && body.name !== '') {
      sql += ` and name like '%${body.name}%'`
    }
    if (body.leader && body.leader !== '') {
      sql += ` and leader like '%${body.leader}%'`
    }
    if (body.createAt && body.createAt !== '') {
      let begin = body.createAt[0]
      let end = body.createAt[1]
      sql += ` and createAt between '${begin}' and '${end}'`
    }
    if (!body.offset) {
      body.offset = 0
    }
    if (!body.size) {
      body.size = 10
    }
    sql += ` LIMIT ${body.offset},${body.size}`
    let res = await pool.execute(sql)
    let count = `SELECT count(*) as totalCount from department`
    let totalCount = await pool.execute(count)
    return {
      data: {
        list: res[0],
        ...totalCount[0][0],
      },
    }
  }
  // 添加部门
  async addDepartment(body) {
    let date = new Date()
    let sql = `INSERT into department(name,leader,createAt,updateAt) VALUES (?,?,'${date.toISOString()}','${date.toISOString()}') `
    try {
      await pool.execute(sql, [body.name, body.leader])
      return {
        data: '添加部门成功',
      }
    } catch (error) {
      return {
        data: '添加部门失败',
      }
    }
  }
  // 修改部门
  async editDepartment(body, id) {
    let date = new Date()
    let sql = `update department set updateAt = '${date.toISOString()}', name = ?, leader = ? where id = ?`
    try {
      await pool.execute(sql, [body.name, body.leader, id])
      return {
        data: '修改部门成功',
      }
    } catch (error) {
      return {
        data: '修改部门失败',
      }
    }
  }
  async deleteDepartment(id) {
    let sql = `delete from department where id = ?`
    try {
      await pool.execute(sql, [id])
      return {
        data: '删除部门成功',
      }
    } catch (error) {
      return {
        data: '删除部门失败',
      }
    }
  }
  async nameCheck(name) {
    let sql = `select name,id from department where name = ?`
    let res = await pool.execute(sql, [name])
    return res[0]
  }
  async idCheck(id) {
    let sql = `select name from department where id = ?`
    let res = await pool.execute(sql, [id])
    return res[0]
  }
}
module.exports = new DepartmentServer()
