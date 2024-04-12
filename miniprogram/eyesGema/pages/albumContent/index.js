// eyesGema/pages/albumContent/index.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumTip: 0,
    stepData: {},
    images: [],
    stepIndex: 0,
    stepShowIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.albumTip = options.tip;
    this.setData({
      stepData: app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex]
    }, () => {
      this.setData({
        images: this.handleData(this.data.stepData)
      }, () => {
        this.startShow()
      })
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  handleData(val) {
    let arr = []
    let images = []
    if (this.data.albumTip == 1) {
      images = val.steps[0].images1;
    }else{
      images = val.steps[0].images2;
    }
    for (let i = 0; i < images.length; i++) {
      images[i].memoryImages[0].x = val.steps[0].commonPx;
      images[i].memoryImages[0].y = val.steps[0].px1;
      images[i].memoryImages[1].x = val.steps[0].commonPx;
      images[i].memoryImages[1].y = val.steps[0].px2;
      arr.push(images[i].memoryImages)
    }
    return arr
  },
  startShow() {
    setTimeout(() => {
      if (this.data.stepShowIndex === 2) {
        this.nextPage()
        return
      }
      this.setData({
        stepIndex: this.data.stepIndex += 1
      }, () => {
        setTimeout(() => {
          this.setData({
            stepShowIndex: this.data.stepShowIndex += 1
          }, () => {
            this.startShow()
          })
        }, 1000)
      })
    }, this.data.images[this.data.stepShowIndex][0].imageTime)
  },
  nextPage() {
    app.globalData.eyeGamesStepIndex++
    if (this.data.albumTip == 1) {
      wx.redirectTo({
        url: '../albumtwo/index',
      })
    } else if (this.data.albumTip == 2) {
      wx.redirectTo({
        url: '../albumEnd/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})