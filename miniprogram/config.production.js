/**
 * 小程序配置文件
 */
const config = {
  // 生产的请求地址
  apiBaseUri: "https://gwapi.zskj.tech/zskj",
  //生产oss地址
  taber: 'https://zskjobject.oss-cn-beijing.aliyuncs.com/zskj_nbj_mini/taber/',
  ossImgUrl: 'https://zskjobject.oss-cn-beijing.aliyuncs.com/zskj_nbj_mini/img/',
  ossGamesImgUrl: 'https://zskjobject.oss-cn-beijing.aliyuncs.com/zskj_nbj_mini/games/',
  //脑吾脑游戏测试地址 
  brainApiUrl: 'https://www.braingine.top:1118/patienth5/getVoucherCode',
  //图片识别游戏正式地址
  gameUrl: 'https://brain.zskj.tech/game/#/index',
  //上传头像正式地址
  uploadUrl: 'https://gwapi.zskj.tech/zskj/app/common/uploadForDate',
  //报告整合系统正式地址
  reportUrl: 'https://public.zskj.tech',
  //小游戏报告判断code
  orderCode: 'https://brain.zskj.tech/game/#/index'
}
module.exports = config