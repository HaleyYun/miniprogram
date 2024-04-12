const app = getApp()
const api = require('../../../../http/api')
Page({
  data: {
    ossHttpUrl: app.globalData.ossGamesImgUrl,
    show: true,
    numberCount: 10,
    TwoText: '现在我们再花一点时间来记住第二本相册里的 6 张照片',
    imgList: [{
        url: app.globalData.ossGamesImgUrl + 'images/picturebg.png'
      },
      {
        url: app.globalData.ossGamesImgUrl + 'images/picturebg.png'
      },
      {
        url: app.globalData.ossGamesImgUrl + 'images/picturebg.png'
      },
      {
        url: app.globalData.ossGamesImgUrl + 'images/picturebg.png'
      },
      {
        url: app.globalData.ossGamesImgUrl + 'images/picturebg.png'
      },
      {
        url: app.globalData.ossGamesImgUrl + 'images/picturebg.png'
      }
    ],
    picArr: [],
    timer: null,
    playUrl: null
  },
  onLoad(options) {
    var timestamp = new Date().getTime(); //当前时间戳
    console.log(timestamp + '第二本相册结束时间')
    wx.setStorageSync('twoEndTime', timestamp)
    this.data.playUrl = wx.createInnerAudioContext();
    this.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test1/tts-BrainCA-LITE-Test1-0023.mp3"
    this.data.playUrl.play()
    var picArr = wx.getStorageSync('setPicRemberNoTwo')
    this.setData({
      picArr: picArr
    })
    this.playTime()
  },
  playTime() {
    var that = this
    var time = 6
    that.data.timer = setInterval(function () {
      time--
      if (time <= 0) {
        clearInterval(that.data.timer)
        that.data.playUrl.pause()
        that.timerFun()
      }
    }, 1000)
  },
  timerFun() {
    var that = this
    that.data.timer = setTimeout(function () {
      that.setData({
        show: false
      })
      that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/soundfx/photo_flip.mp3"
      that.data.playUrl.play()
      that.countDown()
    }, 500)
  },
  countDown() {
    var that = this
    that.data.timer = setInterval(function () {
      var numberCount = that.data.numberCount
      numberCount--
      that.setData({
        numberCount: numberCount
      })
      if (that.data.numberCount <= 0) {
        that.setData({
          TwoText: '我们就记到这里了，接下来我们做另一个测试'
        })
        that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test1/tts-BrainCA-LITE-Test1-0024.mp3"
        that.data.playUrl.play()
        that.next()
      }
    }, 1000)
  },
  next() {
    var that = this
    clearTimeout(that.data.timer)
    that.data.timer = setTimeout(function () {
      clearTimeout(that.data.timer)
      wx.redirectTo({
        url: '/packageHome/pages/gameSku/checkNumber/index',
      })
    }, 7000)
  },
  onHide() {
    clearTimeout(this.data.timer)
    clearInterval(this.data.timer)
    this.data.playUrl.destroy()
  },
  onUnload() {
    clearTimeout(this.data.timer)
    clearInterval(this.data.timer)
    this.data.playUrl.destroy()
  },
})