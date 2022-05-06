const pool = require('../app/database')
const { pool2 } = require('../app/database')
class RoleService {
  async getUserMenuById(id) {
    let sql1 = `select * from menu where id in (select menuid from maprole where roleid = (select roleId from user where id = ?)) and type = 1`
    const sql1Data = await pool.execute(sql1, [id])
    const sql1dbData = sql1Data[0]
    function setResult(parent, child) {
      for (let i in parent) {
        for (let y in child) {
          if (parent[i].id === child[y].parentId) {
            parent[i].children.push(child[y])
          }
        }
      }
    }
    async function getData(data) {
      let type = ''
      for (let i of data) {
        type += ',' + i.id
        i.children = []
      }
      type = type.replace(',', '')
      let sql = `select * from menu where id in (select menuid from maprole where roleid = (select roleId from user where id = ?)) and parentId in (${type})`
      const sql2Data = await pool.execute(sql, [id])
      const sql2dbData = sql2Data[0]
      if (sql2dbData.length === 0) {
        return
      } else {
        setResult(data, sql2dbData)
        await getData(sql2dbData)
      }
    }
    await getData(sql1dbData)
    return {
      data: sql1dbData,
    }
  }
  async getMenuList() {
    let sql1 = `select * from menu where type = 1`
    const sql1Data = await pool.execute(sql1)
    const sql1dbData = sql1Data[0]
    function setResult(parent, child) {
      for (let i in parent) {
        for (let y in child) {
          if (parent[i].id === child[y].parentId) {
            parent[i].children.push(child[y])
          }
        }
      }
    }
    async function getData(data) {
      let type = ''
      for (let i of data) {
        type += ',' + i.id
        i.children = []
      }
      type = type.replace(',', '')
      let sql = `select * from menu where parentId in (${type})`
      const sql2Data = await pool.execute(sql)
      const sql2dbData = sql2Data[0]
      if (sql2dbData.length === 0) {
        return
      } else {
        setResult(data, sql2dbData)
        await getData(sql2dbData)
      }
    }
    await getData(sql1dbData)
    return {
      data: {
        list: sql1dbData,
      },
    }
  }
  async getRoleList(body) {
    let sql = `SELECT * from role where 1 = 1`
    if (body.name && body.name !== '') {
      sql += ` and name like '%${body.name}%'`
    }
    if (body.intro && body.intro !== '') {
      sql += ` and intro like '%${body.intro}%'`
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
    function setResult(parent, child) {
      for (let i in parent) {
        for (let y in child) {
          if (parent[i].id === child[y].parentId) {
            parent[i].children.push(child[y])
          }
        }
      }
    }
    async function getData(data, id) {
      let type = ''
      for (let i of data) {
        type += ',' + i.id
        i.children = []
      }
      type = type.replace(',', '')
      let sql = `select * from menu where id in (select menuid from maprole where roleid = ${id}) and parentId in (${type})`
      const sql2Data = await pool.execute(sql)
      const sql2dbData = sql2Data[0]
      if (sql2dbData.length === 0) {
        return
      } else {
        setResult(data, sql2dbData)
        await getData(sql2dbData, id)
      }
    }
    let sqlData = await pool.execute(sql)
    let allRole = sqlData[0]
    for (let i in allRole) {
      allRole[i].menuList = []
      let id = allRole[i].id
      let sql1 = `select * from menu where id in (select menuid from maprole where roleid = ${id}) and type = 1`
      let sql1Data = await pool.execute(sql1)
      let sql1dbData = sql1Data[0]
      await getData(sql1dbData, id)
      allRole[i].menuList = sql1dbData
      allRole[i].menuList.forEach((item) => {
        item.roleid = id
        getChildRoleId(item.children, id)
      })
      function getChildRoleId(child, id) {
        child.forEach((item) => {
          item.roleid = id
          if (item.children.length !== 0) {
            getChildRoleId(item.children, id)
          } else {
            return
          }
        })
      }
    }
    let sql3 = `select count(*) as totalCount from role`
    let sql3Data = await pool.execute(sql3)
    return {
      data: { list: allRole, ...sql3Data[0][0] },
    }
  }
  async deleteRole(id) {
    try {
      let sql = `delete from maprole where roleid = ?`
      await pool.execute(sql, [id])
      let sql1 = `delete from role where id = ?`
      await pool.execute(sql1, [id])
      return {
        data: '删除成功',
      }
    } catch (error) {
      return {
        data: '删除失败',
      }
    }
  }
  async addRole(body) {
    const date = new Date()
    const sql = `INSERT into role(name,intro,createAt,updateAt) VALUES ('${
      body.name
    }','${body.intro}','${date.toISOString()}','${date.toISOString()}') `
    await pool.execute(sql)
    const sql1 = `select id from role where name='${body.name}'`
    const roleId = await pool.execute(sql1)
    let insert = ``
    for (let i = 0; i < body.menuList.length; i++) {
      insert = `INSERT into maprole(roleid,menuid) VALUES 
      (${roleId[0][0].id},${body.menuList[i]});`
      await pool2.execute(insert)
    }

    return {
      data: '添加成功',
    }
  }
  async editRole(body, id) {
    let date = new Date()
    let sql = `UPDATE role set updateAt='${date.toISOString()}',
    name = ?, intro = ? where id = ?`
    await pool.execute(sql, [body.name, body.intro, id])
    let del = `delete from maprole where roleid = ?`
    await pool.execute(del, [id])
    for (let i = 0; i < body.menuList.length; i++) {
      let insert = `INSERT into maprole(roleid,menuid) VALUES 
      (${id},${body.menuList[i]});`
      await pool2.execute(insert)
    }
    return {
      data: '修改成功',
    }
  }
  async idCheck(id) {
    let sql = `select name from role where id = ?`
    let res = await pool.execute(sql, [id])
    return res[0]
  }
  async nameCheck(name) {
    let select = `select name,id from role where name = ?`
    let res = await pool.execute(select, [name])
    return res[0]
  }
}
module.exports = new RoleService()
