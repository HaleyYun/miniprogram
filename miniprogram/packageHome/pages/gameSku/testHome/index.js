const app = getApp()
const playUrl = wx.createInnerAudioContext();
const util = require('../../../../util/util')
import {
  getEstimateNum
} from "../../../../http/api"
Page({
  data: {
    ossHttpUrl: app.globalData.ossGamesImgUrl,
    show: true,
    timer: null,
    playUrl: null
  },
  onLoad(options) {
    console.log(app.globalData.gamesDatas)
    this.touch()
    this.btnGetEstimateNum()
  },
  touch: util.throttle(function (e) {
    this.data.playUrl = wx.createInnerAudioContext();
    this.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test1/tts-BrainCA-LITE-Test1-0001.mp3"
    this.data.playUrl.play()
  }, 8000),
  change: util.throttle(function (e) {
    let that = this
    that.data.timer = setTimeout(function () {
      wx.redirectTo({
        url: '/packageHome/pages/gameSku/bookOne/index',
      })
      clearTimeout(that.data.timer)
    }, 1000)
  }, 1000),

  btnGetEstimateNum() {
    let requestData = {
      type: 1,
      estimateServeCode: app.globalData.gamesDatas.estimateServeCode,
      estimateServeName: app.globalData.gamesDatas.estimateServeName,
      customPhone: app.globalData.gamesDatas.customPhone,
      customName: app.globalData.gamesDatas.customName,
      orderNum: app.globalData.gamesDatas.orderNum,
      deviceNum: wx.getSystemInfoSync().screenWidth + "_" + wx.getSystemInfoSync().screenHeight,
      deviceModel: wx.getSystemInfoSync().model,
      ticketsEquityCode: app.globalData.gamesDatas.ticketsEquityCode,
      status: null,
      estimateOrderType: app.globalData.gamesDatas.estimateOrderType ? app.globalData.gamesDatas.estimateOrderType : null
    }
    getEstimateNum(requestData).then(res => {
      console.log(res)
      if (res.code === 200) {
        app.globalData.estimateNum = res.data
      }
    })
  },
  onHide() {
    clearTimeout(this.data.timer)
    this.data.playUrl.destroy()
  },
  onUnload() {
    clearTimeout(this.data.timer)
    this.data.playUrl.destroy()
  },
})