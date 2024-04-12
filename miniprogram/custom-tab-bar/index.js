const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: '',
    color: "#666",
    selectedColor: "blue",
    list: [{
      pagePath: "/page/home/index",
      iconPath: app.globalData.taber + "home.png",
      selectedIconPath:  app.globalData.taber + "home_active.png",
      text: "首页"
    },
    {
      pagePath: "/page/brain/index",
      iconPath: app.globalData.taber + "train.png",
      selectedIconPath:  app.globalData.taber + "train_active.png",
      text: "训练"
    },
    {
      pagePath: "/",
      iconPath: app.globalData.taber + "animate.gif",
      selectedIconPath:  app.globalData.taber + "animate.gif",
      text: ""
    },
    {
      pagePath: "/page/consult/index",
      iconPath: app.globalData.taber + "message.png",
      selectedIconPath:  app.globalData.taber + "message_active.png",
      text: "资讯"
    },
    {
      pagePath: "/page/my/index",
      iconPath: app.globalData.taber + "myself.png",
      selectedIconPath:  app.globalData.taber + "myself_active.png",
      text: "我的"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  switch(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.path,
    })
    if (e.currentTarget.dataset.index!=2) {
      this.setData({
        selected: e.currentTarget.dataset.index
      })
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