const pool = require('../app/database')
class UserService {
  async create(user) {
    let date = new Date().toISOString()
    let { name, password, cellphone, department, role, realname } = user
    let createSql = `INSERT into user(name,password,cellphone,departmentId,roleId,realname,createAt,updateAt) VALUES (?,?,?,?,?,?,?,?)`
    await pool.execute(createSql, [
      name,
      password,
      cellphone,
      department,
      role,
      realname,
      date,
      date,
    ])
    return {
      data: '创建用户成功',
    }
  }
  async getUserById(id) {
    let getUserSql = `select id,name,realname,cellphone,enable,createAt,updateAt,roleId,departmentId from user where id = ?`
    let user = await pool.execute(getUserSql, [id])
    let res = {}
    const roleId = user[0][0].roleId
    const departmentId = user[0][0].departmentId
    let getDepartmentSql = `SELECT * from department where id = ?`
    let getRoleSql = `SELECT * from role where id = ?`
    let department = await pool.execute(getDepartmentSql, [departmentId])
    let role = await pool.execute(getRoleSql, [roleId])
    res = Object.assign(user[0][0])
    res.role = role[0][0]
    res.department = department[0][0]
    return {
      data: { ...res },
    }
  }
  async getUserList(body) {
    let sql = `SELECT id, name, enable, cellphone, createAt, updateAt, departmentId as department, roleId as role, realname from user u where 1=1`
    let sql2 = ``
    let departmentInfoSql = `select * from department`
    let roleInfoSql = `select * from role`
    let departmentInfo = await pool.execute(departmentInfoSql)
    let roleInfo = await pool.execute(roleInfoSql)
    let departmentMap = new Map()
    let roleMap = new Map()
    departmentInfo[0].forEach((item) => {
      departmentMap.set(item.id, item.name)
    })
    roleInfo[0].forEach((item) => {
      roleMap.set(item.id, item.name)
    })
    if (body.name && body.name !== '') {
      sql2 += ` and u.name like '%${body.name}%'`
    }
    if (body.enable !== undefined && body.enable !== '') {
      switch (body.enable) {
        case '全部':
          break
        case '禁用':
          sql2 += ` and u.enable = 0`
          break
        case '启用':
          sql2 += ` and u.enable = 1`
          break
      }
    }
    if (body.cellphone && body.cellphone !== '') {
      sql2 += ` and u.cellphone like '%${body.cellphone}%'`
    }
    if (body.department && body.department !== '') {
      let selectDepartmentId = `SELECT d.id as departmentId from department d where d.name = "${body.department}" `
      let info = await pool.execute(selectDepartmentId)
      let departmentId = info[0][0].departmentId
      sql2 += ` and u.departmentId = ${departmentId}`
    }
    if (body.role && body.role !== '') {
      let selectRoleId = `SELECT r.id as roleId from role r where r.name = "${body.role}" `
      let info = await pool.execute(selectRoleId)
      let roleId = info[0][0].roleId
      sql2 += ` and u.roleId = ${roleId}`
    }

    if (body.realname && body.realname !== '') {
      sql2 += ` and u.realname like '%${body.realname}%'`
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
    sql += ` ORDER BY u.id LIMIT ${body.offset},${body.size}`
    let sql3 = `SELECT count(*) as totalCount from user u where 1=1`
    sql3 += sql2
    let list = await pool.execute(sql)
    list[0].forEach((element) => {
      if (element.department) {
        element.department = departmentMap.get(element.department)
      }
      if (element.role) {
        element.role = roleMap.get(element.role)
      }
    })
    let count = await pool.execute(sql3)
    return {
      data: {
        list: list[0],
        ...count[0][0],
      },
    }
  }
  async deleteUserById(id) {
    let sql = `delete from user where id = ?`
    try {
      await pool.execute(sql, [id])
      return {
        data: '删除用户成功',
      }
    } catch (error) {
      console.log(error)
      return {
        data: '删除失败',
      }
    }
  }
  async editUserById(id, body) {
    let date = new Date()
    let sql = `update user set updateAt = '${date.toISOString()}',`
    if (body.name && body.name !== '') {
      sql += ` name = '${body.name}',`
    }
    if (body.realname && body.realname !== '') {
      sql += ` realname = '${body.realname}',`
    }
    if (body.enable !== '' && body.enable !== undefined) {
      sql += ` enable = ${body.enable},`
    }
    if (body.cellphone && body.cellphone !== '') {
      sql += ` cellphone = '${body.cellphone}',`
    }
    if (body.department && body.department !== '') {
      sql += ` departmentId = ${body.department},`
    }
    if (body.role && body.role !== '') {
      sql += ` roleId = ${body.role},`
    }
    sql += ` where id = ?`
    let last = sql.lastIndexOf(',')
    let totalSql = sql.substring(0, last)
    totalSql += sql.substring(last + 1, sql.length)
    try {
      pool.execute(totalSql, [id])
      return {
        data: '修改用户成功',
      }
    } catch (error) {
      return {
        data: '修改失败',
      }
    }
  }

  async getUserByName(name) {
    let seletUser = `SELECT name FROM user where name = ?;`
    const flag = await pool.execute(seletUser, [name])
    return flag[0]
  }
  async getDepartmentIdByName(name) {
    let seletUser = `SELECT id FROM department where name = ?;`
    const flag = await pool.execute(seletUser, [name])
    return flag[0]
  }
  async getRoleIdByName(name) {
    let seletUser = `SELECT id FROM role where name = ?;`
    const flag = await pool.execute(seletUser, [name])
    return flag[0]
  }
  async checkLogin(name, password) {
    let loginSql = `select id,name,enable,roleId from user where name = ? and password = ?`
    let res = await pool.execute(loginSql, [name, password])
    return res[0]
  }
  async deleteCheckUserById(id) {
    let sql = `select name from user where id = ?`
    let res = await pool.execute(sql, [id])
    return res[0]
  }
  async nameCheck(name) {
    let select = `select name,id from user where name = ?`
    let res = await pool.execute(select, [name])
    return res[0]
  }
}
module.exports = new UserService()
