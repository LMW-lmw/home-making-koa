const service = require('../service/test.service')
class TestController {
  async cityList(ctx) {
    const res = await service.cityList(ctx.request.body)
    ctx.status = 200
    ctx.body = res
  }
}
module.exports = new TestController()
