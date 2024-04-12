const app = getApp()
const api = require('../../../http/api.js');
import {
  getCaideReport,
} from "../../../http/api"
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    userInfo: {},
    isChange: null
  },
  onLoad(options) {
    console.log(options.isChange)
    this.setData({
      isChange: Number(options.isChange)
    })
    app.globalData.select = options.acquiesce
  },
  isArch() {
    if (wx.getStorageSync('token') != '') {
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then((res) => {
        if (res.code == 200) {
          if (res.data != null) {
            this.getReport(res.data)
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/page/login/start/index?pageUrl=' + '/packageHome/pages/cadie/index' + '&str=' + 12,
      })
    }
  },
  getReport(isChange) {
    getCaideReport().then(res => {
      if (res.code === 200) {
        this.setData({
          userInfo: res.data,
        })
        if (isChange === 1) {
          wx.showToast({
            title: 'CAIDE报告已根据您填写的最新资料更新～',
            icon: 'none',
            duration: 5000
          })
          wx.removeStorageSync("isChange")
        }
      }
    })
  },
  onShow() {
    let isChange = wx.getStorageSync('isChange')
    this.getReport(isChange)
  },
  toUpdateInfo() {
    wx.navigateTo({
      url: '/page/my/infoEdit/index' + '?str=12'
    })
  },
})