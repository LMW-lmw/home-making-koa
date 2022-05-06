const pool = require('../app/database')
class WorkersServer {
  // 查询
  async getWorkersList(body) {
    let sql = `select w.id,
  w.name,
  p.province,
  c.city,
  a.area,
  w.city as cityid,
  w.area as areaid,
  w.province as provinceid,
  ca.name as type,
  w.telephone,
  w.remuneration,
  w.count,
  w.createAt,
  w.updateAt
   from workers as w,
  provinces as p,
  cities as c,
  areas as a,
  category as ca
   where p.provinceid = w.province and c.cityid = w.city and a.areaid = w.area and w.type = ca.id`
    let sql2 = ``
    if (!body.offset) {
      body.offset = 0
    }
    if (!body.size) {
      body.size = 10
    }
    if (body.name && body.name !== '') {
      sql2 += ` and w.name like '%${body.name}%'`
    }
    if (body.telephone && body.telephone !== '') {
      sql2 += ` and w.telephone like '%${body.telephone}%'`
    }
    if (body.type && body.type !== '') {
      let selectCategoryId = `select id from category where name = "${body.type}"`
      let info = await pool.execute(selectCategoryId)
      console.log(info[0][0])
      let type = info[0][0].id
      sql2 += ` and w.type = ${type}`
    }
    sql += sql2
    sql += ` ORDER BY w.id LIMIT ${body.offset},${body.size}`
    let res = await pool.execute(sql)
    let count = `SELECT count(*) as totalCount from workers w where 1=1`
    count += sql2
    const totalCount = await pool.execute(count)
    return {
      data: { list: res[0], ...totalCount[0][0] },
    }
  }
  // 添加
  async addWorker(body) {
    let date = new Date()
    let selectTypeId = `select id from category where name = ?`
    let info = await pool.execute(selectTypeId, [body.type])
    let type = info[0][0].id
    let sql = `INSERT into workers
    (area,city,name,province,remuneration,telephone,type,createAt,updateAt)
     VALUES (?,?,?,?,?,?,?,'${date.toISOString()}','${date.toISOString()}') `
    try {
      await pool.execute(sql, [
        body.area,
        body.city,
        body.name,
        body.province,
        body.remuneration,
        body.telephone,
        type,
      ])
      return {
        data: '添加工作人员成功',
      }
    } catch (error) {
      return {
        data: '添加工作人员失败',
      }
    }
  }
  // 修改
  async editWorker(body, id) {
    let date = new Date()
    let selectTypeId = `select id from category where name = '${body.type}'`
    const info = await pool.execute(selectTypeId)
    const typeid = info[0][0].id
    let sql = `update workers set updateAt = '${date.toISOString()}',
     name = ?, telephone = ?, remuneration = ?, province = ?,
     city = ?, area = ?, type = ? where id = ?
     `
    try {
      await pool.execute(sql, [
        body.name,
        body.telephone,
        body.remuneration,
        body.province,
        body.city,
        body.area,
        typeid,
        id,
      ])
      return {
        data: '修改员工成功',
      }
    } catch (error) {
      return {
        data: '修改员工失败',
      }
    }
  }
  // 删除
  async deleteWorker(id) {
    let sql = `delete from workers where id = ?`
    try {
      await pool.execute(sql, [id])
      return {
        data: '删除员工成功',
      }
    } catch (error) {
      return {
        data: '删除员工失败',
      }
    }
  }
  async idCheck(id) {
    let sql = `select name from workers where id = ?`
    let res = await pool.execute(sql, [id])
    return res[0]
  }
}
module.exports = new WorkersServer()
