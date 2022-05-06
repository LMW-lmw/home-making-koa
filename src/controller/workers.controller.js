const service = require('../service/workers.service')
// 部门
class WorkersController {
  // 获取
  async getWorkersList(ctx, next) {
    let body = ctx.request.body
    const res = await service.getWorkersList(body)
    ctx.body = res
  }
  // 添加
  async addWorker(ctx, next) {
    let body = ctx.request.body
    const res = await service.addWorker(body)
    ctx.body = res
  }
  // 修改
  async editWorker(ctx, next) {
    let body = ctx.request.body
    const id = ctx.request.params.id
    const res = await service.editWorker(body, id)
    ctx.body = res
  }
  // 删除
  async deleteWorker(ctx, next) {
    const id = ctx.request.params.id
    const res = await service.deleteWorker(id)
    ctx.body = res
  }
}
module.exports = new WorkersController()
