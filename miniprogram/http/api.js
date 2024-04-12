//引入封装的reuest请求
const {

  axios
} = require('./request.js')
module.exports = {
  //授权信息
  getUserInfo: (data) => {
    return axios('/app/wechat/getUserInfo', 'POST', data)
  }, //授权信息
  getPhone: (data) => {
    return axios('/app/wechat/login', 'POST', data)
  }, //获取手机号码
  getCode: (data) => {
    return axios('/app/wechat/loginSendCode', 'Get', data)
  }, //获取验证码
  logout: (data) => {
    return axios('/app/wechat/logout', 'Get', data)
  }, //退出登录

  //首页根据手机号查询是否建档案
  getCheckArch: (params) => {
    return axios('/app/healthRecords/checkArch', 'Get', params)
  }, //查询档案

  //机构分类 return axios('/app/organ/getOrganType', 'Post', params)
  getCheckType: (params) => {
    // return axios('/app/dict/data/type', 'Get', params)
    return axios('/app/organ/getOrganType', 'Post', params)
  },
  //首页文章接口
  homeArticleCategory: (data) => {
    return axios('/app/marketingCenter/getPageArticleCategory', 'POST', data)
  }, //获取文章分类
  homeArticleList: (data) => {
    return axios('/app/marketingCenter/getPageArticle', 'POST', data)
  }, //获取文章列表
  homeArticleDetail: (data) => {
    return axios('/app/marketingCenter/getById', 'Get', data)
  }, //根据ID查询文章详情
  // 首页服务推荐
  homeServiceRecommend: (data) => {
    return axios('/app/recommendProduct/recommendedPaginQuery', 'POST', data)
  }, //首页服务推荐
  homeServiceList: (data) => {
    return axios('/app/recommendProduct/recommendProductQuery', 'POST', data)
  }, //首页服务推荐列表

  // 服务套餐列表
  serviceCategory: (data) => {
    return axios('/app/serviceClassification/serviceClassificationPaginQuery', 'POST', data)
  }, //获取服务分类
  serviceList: (data) => {
    return axios('/app/serviceClassification/classificationProductQuery', 'POST', data)
  }, //获取服务列表
  serpaginQueryCombine: (data) => {
    return axios('/app/serviceClassification/paginQueryCombineOpen', 'POST', data)
  }, //获取服务整合分类
  // 详情页
  commodityDetailPage: (params) => {
    return axios('/app/servProd/findProdById', 'GET', params)
  }, //通过商品id获取商品详情

  commodityCodePage: (params) => {
    return axios('/app/servProd/findProdByCode', 'GET', params)
  }, //通过商品code获取商品详情
  //健康
  dietCampaign: (data) => {
    return axios('/app/interventionStatistics/queryDietAndSportsRecord', 'POST', data)
  }, //饮食运动
  summary: (data) => {
    return axios('/app/interventionDaily/summary', 'POST', data)
  }, //每日推荐

  //训练
  trainingStatistics: (data) => {
    return axios('/app/interventionStatistics/queryGameRecord', 'POST', data)
  }, //训练统计
  trainingDaily: (data) => {
    return axios('/app/interventionDaily/game', 'POST', data)
  }, //今日训练任务

  // 运动健康
  todaySportsRecord: (data) => {
    return axios('/app/interventionStatistics/queryTodaySportsRecord', 'POST', data)
  }, //今日训练任务
  sports: (data) => {
    return axios('/app/interventionDaily/sports', 'POST', data)
  }, //获取运动数据
  saveSportsVideoTime: (data) => {
    return axios('/app/interventionStatistics/saveSportsVideoTime', 'POST', data)
  }, //获取运动数据

  //权益列表
  equityExchange: (data) => {
    return axios('/app/ticketsEquity/equityExchange', 'POST', data)
  }, //权益兑换
  pageQuery: (data) => {
    return axios('/app/ticketsEquity/pageQuery', 'POST', data)
  }, //权益列表
  equityDetail: (params) => {
    return axios('/app/ticketsEquity/queryByCode', 'GET', params)
  }, //预约订单详情
  checkInterTime: (params) => {
    return axios('/app/ticketsBooking/verificationServiceComplete', 'GET', params)
  }, //预约订单详情

  // 机构列表
  mechanismList: (data) => {
    return axios('/app/organ/getLiteOrgans', 'POST', data)
  }, //机构列表
  mechanismDetail: (data) => {
    return axios('/app/organ/getLiteOrganInfo', 'POST', data)
  }, //机构列表
  codeList: (data) => {
    return axios('/app/citycode/getCityCodeSelect', 'POST', data)
  }, //省市级


  // 膳食干预
  recipe: (data) => {
    return axios('/app/interventionDaily/recipe', 'POST', data)
  }, //获取膳食推荐
  recipeDetails: (params) => {
    return axios('/app/interventionDaily/recipe/details', 'GET', params)
  }, //获取菜品详情
  clockingSituation: (data) => {
    return axios('/app/interventionAttendance/queryDietWeekAttendance', 'POST', data)
  }, //获取打卡情况
  clockIn: (data) => {
    return axios('/app/interventionAttendance/saveAttendance', 'POST', data)
  }, //打卡

  // 档案
  newFile: (data) => {
    return axios('/app/healthRecords/addHealthRecords', 'POST', data)
  }, //新建档案
  editFile: (data) => {
    return axios('/app/healthRecords/editHealthRecords', 'POST', data)
  }, //编辑档案
  updateArch: (data) => {
    return axios('/app/healthRecords/saveOrUpdateArch', 'POST', data)
  }, //小程序修改或者更新档案信息
  queryFile: (data) => {
    return axios('/app/healthRecords/queryHealthRecords', 'POST', data)
  }, //档案列表
  getLitePage: (data) => {
    return axios('/app/estimateOrder/getLitePage', 'POST', data)
  }, //报告列表

  //用户协议
  agreement: (params) => {
    return axios('/app/agreement/query', 'GET', params)
  }, //通过商品id获取商品详情


  //用户信息
  getInfo: (params) => {
    return axios('/app/wechatUser/getUserInfo', 'GET', params)
  }, //获取用户信息
  editInfo: (params) => {
    return axios('/app/wechatUser/editUserInfo', 'POST', params)
  }, //编辑信息
  detailInfo: (params) => {
    return axios('/app/healthRecords/getHealthRecordsDetailByArchivesNo', 'Post', params)
  }, //编辑信息
  //优惠券
  couponApp: (params) => {
    return axios('/app/couponApp/userCouponPage', 'Post', params)
  }, //优惠券列表 
  couponUseCheck: (params) => {
    return axios('/app/couponApp/couponUseCheck', 'GET', params)
  }, //优惠券校验
  //我的预约订单
  orderList: (params) => {
    return axios('/app/ticketsBooking/pageQuery', 'POST', params)
  }, //预约订单列表
  orderDetail: (params) => {
    return axios('/app/ticketsBooking/queryByCode', 'GET', params)
  }, //预约订单详情
  orderLogs: (params) => {
    return axios('/app/ticketsBooking/queryLogsByCodeType', 'POST', params)
  }, //根据工单号和工单类型查询工单服务记录
  equityList: (params) => {
    return axios('/app/ticketsBooking/padTicketsDetail', 'POST', params)
  }, //筛查服务列表

  //我的套餐订单
  packageList: (params) => {
    return axios('/app/ticketsService/pageQuery', 'POST', params)
  }, //套餐订单列表
  packageDetail: (params) => {
    return axios('/app/ticketsService/queryByCode', 'GET', params)
  }, //套餐订单列表

  //干预查询周的统计情况
  weekRecord: (params) => {
    return axios('/app/interventionStatistics/queryUserWeekRecord', 'POST', params)
  }, //查询周的统计情况
  planList: (params) => {
    return axios('/app/interventionOrder/page', 'POST', params)
  }, //查询干预订单列表
  planDetail: (params) => {
    return axios('/app/interventionOrder/planDetail', 'POST', params)
  }, //根据订单编号查询方案详情
  interveneList: (params) => {
    return axios('/app/interventionStatistics/page', 'POST', params)
  }, //干预记录列表
  queryWeekList: (params) => {
    return axios('/app/interventionOrder/queryWeekList', 'POST', params)
  }, //干预单周情况

  //支付  
  orderPay: (params) => {
    return axios('/app/wechatPay/createServiceOrder', 'POST', params)
  }, //服务工单请求下单
  BookingOrder: (params) => {
    return axios('/app/wechatPay/createBookingOrder', 'POST', params)
  }, //预约工单请求下单
  createRefund: (params) => {
    return axios('/app/wechatPay/createRefund', 'POST', params)
  }, //申请退款

  checkAgeRefund: (params) => {
    return axios('/app/ticketsService/checkAge', 'POST', params)
  }, //校验年龄
  ServiceOrder: (params) => {
    return axios('/app/wechatPay/createServiceOrder', 'POST', params)
  }, //服务工单请求下单
  queryIsMany: (params) => {
    return axios('/app/ticketsEquity/queryIsMany', 'GET', params)
  }, //判断多个筛查
  //省市区  
  getCityCodeSelect: (data) => {
    return axios('/app/citycode/getCityCodeSelect', 'POST', data)
  },

  // 返回档案编号
  generateDefault: (data) => {
    return axios('/app/interventionOrder/generateDefault', 'POST', data)
  },

  // 脑健康训练
  clockInList: (data) => {
    return axios('/app/interventionAttendance/clockInList', 'GET', data)
  }, //周列表
  findInterveneType: (data) => {
    return axios('/app/interventionAttendance/findInterveneType', 'GET', data)
  }, //脑健康页面显示
  statisticsInfo: (data) => {
    return axios('/app/interventionAttendance/statisticsInfo', 'POST', data)
  }, //三者统计

  // 膳食比例
  copies: (data) => {
    return axios('/app/interventionDaily/weekComplete/copies', 'POST', data)
  }, //比例份数
  addClockIn: (data) => {
    return axios('/app/interventionDaily/add/clockIn', 'POST', data)
  }, //选择比例
  echarts: (data) => {
    return axios('/app/interventionDaily/upload/OrCopiesList', 'POST', data)
  }, //图表
  records: (data) => {
    return axios('/app/interventionDaily/myWeek/Intervention', 'POST', data)
  }, //完成率

  // 食材大全
  conditionsSelect: (data) => {
    return axios('/app/interventionDaily/ingredientLite/conditionsSelect', 'POST', data)
  }, //食材列表查询
  addFood: (data) => {
    return axios('/app/interventionDaily/dietRecords/add', 'POST', data)
  }, //添加食材
  RecordsSelect: (data) => {
    return axios('/app/interventionDaily/diet/RecordsSelect', 'POST', data)
  }, //获取食材


  // 小游戏测试环境获取图片
  getPhoto: (data) => {
    return axios('/app/h5/queryH5List', 'GET', data)
  },
  // 小游戏测试环境提交信息
  submitInfo: (data) => {
    return axios('/app/gameImageRecognition/computeGameScore', 'POST', data)
  },

  // 眼动获取模板
  getEstimateProcess: (data) => {
    return axios('/app/estimate/getEstimateProcess', 'POST', data)
  },

  // 眼动获取单号
  getEstimateNum: (data) => {
    return axios('/app/estimate/getPhoneEstimateNum', 'POST', data)
  },

  // 眼动矫正提交
  handleEstimateCheckVideo: (data) => {
    return axios('/app/estimate/handleEstimateCheckVideo', 'POST', data)
  },
  // 眼动任务2/3矫正提交
  handleEstimateVideo: (data) => {
    return axios('/app/estimate/handleEstimateVideo', 'POST', data)
  },
  // 上传oss
  getStsToken: () => {
    return axios('/app/estimate/getStsToken', 'POST', {})
  },
  //获取bhi报告
  getReportList: (data) => {
    // return axios('/app/reportWhole/getReportByArchivesNo', 'POST', data)
    return axios('/app/estimateOrder/countingEstimateOrder', 'POST', data)
  },
  //获取字典tab
  getReportTab: (params) => {
    return axios('/app/dict/data/type', 'GET', params)
  },
  //获取评估结果列表
  getBhiHistory: (data) => {
    // return axios('/app/reportWhole/findEstimateOrderByProdCode', 'POST', data)
    return axios('/app/estimateOrder/findEstimateOrderByProdCode', 'POST', data)
  },
  //获取评估结果列表2
  getBhiHistorys: (data) => {
    // return axios('/app/reportWhole/findEstimateOrderByProdCode', 'POST', data)
    return axios('/app/estimateOrder/findEstimateOrderByProdCode2', 'POST', data)
  },
  //小程序绑定pad员工账号
  bindAccount: (data) => {
    return axios('/app/wechatEquity/bindEmployeeAccount', 'POST', data)
  },
  //小程序解绑pad员工账号
  unBindAccount: () => {
    return axios('/app/wechatEquity/unbindEmployeeAccount', 'GET', {})
  },
  //小程序获取绑定pad员工账号信息，返回null则表明绑定失效或未绑定
  getBindAccount: () => {
    return axios('/app/wechatEquity/getWechatEmployeeInfo', 'GET', {})
  },
  //分页查询员工所属渠道下营销权益
  getEquityList: (data) => {
    return axios('/app/equityService/marketingEquityPageQuery', 'POST', data)
  },
  //根据权益id和员工id查询营销权益详情
  getEquityCenterDetail: (data) => {
    return axios('/app/equityService/queryDetail', 'POST', data)
  },
  //分页查询员工发放权益兑换详情
  getEquityCenterExchange: (data) => {
    return axios('/app/equityService/marketingEquityCardQuery', 'POST', data)
  },
  // 根据权益服务id查询已关联模板
  getPosterList: (data) => {
    return axios('/app/poster/queryTemplate', 'POST', data)
  },
  //生成海报接口
  getCreatePoster: (data) => {
    return axios('/app/poster/createPoster', 'POST', data)
  },
  //首页caide接口
  getCaideReport: (data) => {
    return axios('/app/healthRecords/getCaideResponse', 'GET', data)
  },
  // 权益营销权益兑换
  getEquityExchange: (data) => {
    return axios('/app/equityService/marketingEquityExchange', 'POST', data)
  },


  // 营销活动接口
  // 增加访问人次接口
  getPeopleNumber: (data) => {
    return axios('/app/marketingActivity/addVisitPeopleNumber', 'GET', data)
  },
  // 查询活动状态
  getQueryStatus: (data) => {
    return axios('/app/marketingActivity/queryStatus', 'POST', data)
  },
  // 营销确认页
  getMarketingConfirm: (data) => {
    return axios('/app/marketingActivity/marketingConfirm', 'POST', data)
  },
  // 查询是否存在待支付订单
  getQueryWaitPay: (data) => {
    return axios('/app/marketingActivity/queryWaitPay', 'POST', data)
  },
  // 记录分享次数
  getRecordingShares: (data) => {
    return axios('/app/marketingActivity/recordingShares', 'POST', data)
  },
  // 获取开始评估需要的参数
  getActParms: (data) => {
    return axios('/app/marketingActivity/getParams', 'POST', data)
  },
  // 获取订单查询分页查询工单列表
  ticketsNumber: (data) => {
    return axios('/app/ticketsBooking/pageQuery', 'POST', data)
  },
  // 获取量表列表信息
  questionFind: (data) => {
    return axios('/app/estimateScale/questionFind', 'POST', data)
  },
  // 生成单号
  getScaleEstimateNum: (data) => {
    return axios('/app/estimate/getEstimateNum', 'POST', data)
  },
  // 每道题提交
  addQuestionResult: (data) => {
    return axios('/app/estimateScale/addQuestionResult', 'POST', data)
  },
  // 提交量表
  saveScaleResult: (data) => {
    return axios('/app/estimateMoCA/saveAppletScaleResult', 'POST', data)
  },
  getReport: (data) => {
    return axios('/app/reportWhole/getReport', 'POST', data)
  },
}