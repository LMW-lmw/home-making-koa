const service = require('../service/role.service')
class RoleController {
  async getUserMenuById(ctx, next) {
    const id = ctx.request.params.id
    const res = await service.getUserMenuById(id)
    ctx.status = 200
    ctx.body = res
  }
  async getMenuList(ctx, next) {
    const res = await service.getMenuList()
    ctx.status = 200
    ctx.body = res
  }
  async getRoleList(ctx, next) {
    const res = await service.getRoleList(ctx.request.body)
    ctx.status = 200
    ctx.body = res
  }
  async deleteRole(ctx, next) {
    const id = ctx.request.params.id
    const res = await service.deleteRole(id)
    ctx.status = 200
    ctx.body = res
  }
  async addRole(ctx, next) {
    let body = ctx.request.body
    const res = await service.addRole(body)
    ctx.status = 200
    ctx.body = res
  }
  async editRole(ctx, next) {
    const id = ctx.request.params.id
    let body = ctx.request.body
    const res = await service.editRole(body, id)
    ctx.status = 200
    ctx.body = res
  }
}
module.exports = new RoleController()
