// 检查参数传递是否有问题
function checkParameters(...info) {
  let flag = true
  for (let i of info) {
    if (!i || i == '') {
      flag = false
      break
    }
  }
  return flag
}
// 检查数据库信息是否存在
/**
 *
 * @param {function} fn 数据库查询函数
 * @param {Array} name 数据库查询条件
 */
async function checkForPresence(fn, name) {
  let res = await fn(...name)
  if (res.length === 0) {
    return false
  } else {
    return res[0]
  }
}
module.exports = {
  checkParameters,
  checkForPresence,
}
