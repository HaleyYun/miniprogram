// packageHome/pages/bhiInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  goBack(){
    wx.navigateBack({
      url: '../../pages/newReport/index'
    })
  },
})