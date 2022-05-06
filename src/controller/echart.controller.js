const service = require('../service/echart.service')
// 部门
class EchartController {
  async getWorkerTop(ctx, next) {
    const res = await service.getWorkerTop()
    ctx.body = res
  }
  async getCataryTop(ctx, next) {
    const res = await service.getCataryTop()
    ctx.body = res
  }
}
module.exports = new EchartController()
