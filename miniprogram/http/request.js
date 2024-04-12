const app = getApp()
module.exports = {
  /*
   * url:请求的接口地址
   * methodType:请求方式
   * data: 要传递的参数
   */
  axios: function (url, methodType, data) {
    let fullUrl = `${app.globalData.apiBaseUri}${url}`
    let token = wx.getStorageSync('token') ? wx.getStorageSync('token') : ''
    if (url != "/app/estimate/handleEstimateCheckVideo" && url != "/app/estimate/handleEstimateVideo" && url != "/app/estimate/getStsToken" && url != "/app/equityService/marketingEquityExchange" && url != "/app/ticketsEquity/pageQuery") {
      wx.showLoading({
        title: "加载中"
      });
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: fullUrl,
        method: methodType,
        data,
        timeout: 60000,
        header: {
          'content-type': 'application/json', // 默认值
          'token': token,
        },
        success: (res) => {
          if (res.statusCode == 200) {
            if (res.data.code == 406) {
              wx.removeStorageSync("token")
              wx.reLaunch({
                url: '/page/login/start/index',
              })
            } else {
              resolve(res.data)
              wx.hideLoading()
            }
          }
        },
        fail: (err) => {
          reject(err)
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    })
  }
}