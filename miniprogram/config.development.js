/**
 * 小程序配置文件
 */
const config = {
  // 开发的请求地址
  apiBaseUri: "http://192.168.50.152:8090/zskj",
  // apiBaseUri: "http://192.168.50.108:8090/zskj",
  // apiBaseUri: "http://192.168.50.23:8090/zskj",
  // apiBaseUri: "http://192.168.50.60:8090/zskj",
  //测试oss地址
  taber: 'https://zskjobject.oss-cn-beijing.aliyuncs.com/zskj_nbj_mini/taber/',
  ossImgUrl: 'https://zskjobject.oss-cn-beijing.aliyuncs.com/zskj_nbj_mini/img/',
  ossGamesImgUrl: 'https://zskjobject.oss-cn-beijing.aliyuncs.com/zskj_nbj_mini/games/',
  //脑吾脑游戏测试地址
  brainApiUrl: 'http://121.41.84.75:8089/patienth5/getVoucherCode',
  //图片识别游戏测试地址
  gameUrl: 'http://exam.zskj.tech/game/#/index',
  //上传头像测试地址
  uploadUrl: 'https://testgwapi.zskj.tech/zskj/app/common/uploadForDate',
  //报告整合系统测试地址
  reportUrl: 'http://192.168.50.199:8076',
  //小游戏报告判断code
  orderCode: 'http://exam.zskj.tech/game/#/index'
}
module.exports = config