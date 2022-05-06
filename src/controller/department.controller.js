const service = require('../service/department.service')
// 部门
class DepartmentController {
  // 获取
  async getDepartmentList(ctx, next) {
    let body = ctx.request.body
    const res = await service.getDepartmentList(body)
    ctx.body = res
  }
  // 添加
  async addDepartment(ctx, next) {
    let body = ctx.request.body
    const res = await service.addDepartment(body)
    ctx.body = res
  }
  // 修改
  async editDepartment(ctx, next) {
    let body = ctx.request.body
    const id = ctx.request.params.id
    const res = await service.editDepartment(body, id)
    ctx.body = res
  }
  // 删除
  async deleteDepartment(ctx, next) {
    const id = ctx.request.params.id
    const res = await service.deleteDepartment(id)
    ctx.body = res
  }
}
module.exports = new DepartmentController()
