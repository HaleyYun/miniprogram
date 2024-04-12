const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameUrl: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    if (options.estimateNum) {
 
      this.setData({
        gameUrl: options.gameUrl + '?estimateNum=' + options.estimateNum + '&token=' + wx.getStorageSync('token')
      })
      console.log(this.data.gameUrl)
    } else if (options.archivesNo) {
      this.setData({
        gameUrl: options.gameUrl + '?archivesNo=' + options.archivesNo + '&token=' + wx.getStorageSync('token') + '&ticketsEquityCode=' + options.ticketsEquityCode + '&ticketsServiceCode=' + options.ticketsServiceCode
      })
      console.log(this.data.gameUrl)
    } else if (options.threeGame) {
      console.log(options.gameUrl + '?voucherCode=' + options.voucherCode + '&gameList=' + options.gameList + '&difficultyList=' + options.difficultyList + '&archivesNo=' + options.threeGame)
      this.setData({
        gameUrl: options.gameUrl + '?voucherCode=' + options.voucherCode + '&gameList=' + options.gameList + '&difficultyList=' + options.difficultyList + '&archivesNo=' + options.threeGame
      })
    } else if (options.gameNum) {
      this.setData({
        gameUrl: app.globalData.reportUrl + '/ReportInterpretation?archivesNo=' + options.gameNum + '&str=Mini'
      })
      console.log(this.data.gameUrl)
    } else if (options.estimate) {
      // pad端眼动报告
      this.setData({
        gameUrl: app.globalData.reportUrl + '/EyeMovement?estimateNum=' + options.estimate + '&str=Mini'
      })
      console.log(this.data.gameUrl)
    } else if (options.estimateNums) {
      console.log(options.estimateNums,'options.estimateNums');
      //跳转量表报告
      this.setData({
        gameUrl: app.globalData.reportUrl + '/scaleReportdetail?estimateNum=' + options.estimateNums + '&str=Mini'
      })
      console.log(this.data.gameUrl)
    } else if (options.yan) {
      // liet端眼动报告
      this.setData({
        gameUrl: app.globalData.reportUrl + '/EyeMovementH5?estimateNum=' + options.yan + '&str=Mini'
      })
      console.log(this.data.gameUrl)
    } else if (options.AD8) {
      // liet端眼动报告
      this.setData({
        gameUrl: app.globalData.reportUrl + '/reportAD8?estimateNum=' + options.AD8 + '&str=Mini'
      })
      console.log(this.data.gameUrl)
    } else if (options.orderNum) {
  
      // liet端小游戏报告
      this.setData({
        gameUrl: app.globalData.reportUrl + '/gameResult?estimateNum=' + options.orderNum + '&str=Mini'
      })
      console.log(this.data.gameUrl)
      //跳转抑郁
    }else if(options.depressed){
      this.setData({
        gameUrl: app.globalData.reportUrl + '/depressedResultH5?estimateNum=' + options.depressed + '&str=Mini'
      })
      console.log(this.data.gameUrl)
    }
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