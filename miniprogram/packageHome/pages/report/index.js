const app = getApp()
const api = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ossImg: app.globalData.ossImgUrl,
    customName: '',
    estimateTime: '',
    archivesNo: '',
    keyword: '',
    doctor: false, //列表无数据
    loadStatus:'', //loading-加载中,noData-无数据,failure-加载失败,
    schedule:0, //加载中进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 获取档案列表
  getLite() {
    api.getLitePage({
      pageNum: 1,
      pageSize: 100,
      keyword: this.data.keyword,
    }).then(res => {
      if (res.code==200) {
        if (res.data == null) {
          this.setData({
            doctor: true,
            loadStatus:'noData',
          })
        } else {
          this.setData({
            doctor: false,
            customName: res.data.name,
            estimateTime: res.data.updateTime,
            archivesNo: res.data.archivesNo,
          })
        }
      } else {
        this.setData({
          loadStatus:'failure',
          doctor: true
        })
      }
    })
  },
  search(val) {
    this.setData({
      keyword: val.detail.value
    })
    this.getLite()
  },


  //查看报告
  showReport() {
    wx.navigateTo({
      url: '/packageHome/pages/gameWebview/index?str=Mini'
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
    this.getLite()
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
    wx.reLaunch({
      url: '/page/home/index',
    })
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