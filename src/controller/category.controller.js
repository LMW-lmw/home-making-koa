const service = require('../service/category.service')
class CategoryController {
  async getCategoryList(ctx, next) {
    let body = ctx.request.body
    const res = await service.getCategoryList(body)
    ctx.body = res
  }
  async addCategory(ctx, next) {
    let body = ctx.request.body
    const res = await service.addCategory(body)
    ctx.body = res
  }
  async editCategory(ctx, next) {
    const id = ctx.request.params.id
    let body = ctx.request.body
    const res = await service.editCategory(body, id)
    ctx.body = res
  }
  async deleteCategory(ctx, next) {
    const id = ctx.request.params.id
    const res = await service.deleteCategory(id)
    ctx.body = res
  }
}
module.exports = new CategoryController()
