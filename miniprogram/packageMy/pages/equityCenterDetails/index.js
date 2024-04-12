const app = getApp()
const api = require('../../../http/api.js')
const util = require('../../../util/util')
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    data: {},
    equityId: 0,
    employeeId: 0,
  },
  onLoad(options) {
    this.setData({
      equityId: Number(options.id),
      employeeId: wx.getStorageSync('employeeId')
    })
    this.getEquityDetail()
  },
  //权益详情信息
  getEquityDetail() {
    api.getEquityCenterDetail({
      employeeId: this.data.employeeId,
      equityId: this.data.equityId
    }).then(res => {
      this.setData({
        data: res.data
      })
    })
  },
  goEquiyDetails() {
    wx.navigateTo({
      url: '/packageMy/pages/detail/index?id=' + this.data.data.productResponse.id
    })
  },
  // 立即使用
  goSwiper() {
    wx.navigateTo({
      url: '/packageMy/pages/posterSwiper/index?equityId=' + this.data.data.id,
    })
  },
  goExchange() {
    wx.navigateTo({
      url: '/packageMy/pages/exchangeDetails/index?id=' + this.data.equityId
    })
  }
})