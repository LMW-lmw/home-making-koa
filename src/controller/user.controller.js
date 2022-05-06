const service = require('../service/user.service')
const jwt = require('jsonwebtoken')
const { private_key } = require('../app/config')
class UserController {
  // 注册
  async create(ctx, next) {
    const user = ctx.request.body
    const res = await service.create(user)
    ctx.status = 200
    ctx.body = res
  }
  // 登录
  async login(ctx, next) {
    // const res = await service.login()
    const { id, name, enable } = ctx.user
    const token = jwt.sign({ id, name }, private_key, {
      expiresIn: '24h',
      algorithm: 'RS256',
    })
    ctx.status = 200
    ctx.body = {
      data: {
        id,
        name,
        enable,
        token,
      },
    }
  }
  async getUserInfoById(ctx, next) {
    const id = ctx.request.params.id
    const res = await service.getUserById(id)
    ctx.status = 200
    ctx.body = res
  }
  async getUserList(ctx, next) {
    let body = ctx.request.body
    let res = await service.getUserList(body)
    ctx.body = res
  }
  async deleteUserById(ctx, next) {
    const id = ctx.request.params.id
    let res = await service.deleteUserById(id)
    ctx.body = res
  }
  async editUserById(ctx, next) {
    const id = ctx.request.params.id
    const body = ctx.request.body
    let res = await service.editUserById(id, body)
    ctx.body = res
  }
}

module.exports = new UserController()
