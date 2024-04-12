// packageTrain/pages/exercise/index.js
const app = getApp()
const api = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ossImg:app.globalData.ossImgUrl,
    date:'',
    list:[],
    loadStatus:'', //loading-加载中,noData-无数据,failure-加载失败,
    schedule:0, //加载中进度
  },
  record(e){
    wx.navigateTo({
      url: '/packageTrain/pages/sports/index?id='+e.currentTarget.dataset.id+'&title=' +e.currentTarget.dataset.title+'&date=' +this.data.date,
    })
  },
  getSummary() {
    api.summary({
      localDate: this.data.date
    }).then(res => {
      if (res.code==200) {
        if (res.data==[]||res.data==null) {
          this.setData({
            loadStatus:'noData',
            list: [],
          })
        } else {
          this.setData({
            list: res.data,
          })
        }
      } else {
        this.setData({
          loadStatus:'failure',
          list: [],
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      date:wx.getStorageSync('date')
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
    this.getSummary()
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