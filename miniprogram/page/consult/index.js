const app = getApp()
const api = require('../../http/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ossImg: app.globalData.ossImgUrl,
    indexId: 0,
    artcileTypeList: [], //咨询
    artcileList: [], //咨询

  },
  onLoad(options) {},
  onShow() {
    this.getCategory()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
  },
  articleDetail(e) {
    if (e.currentTarget.dataset.id != undefined) {
      wx.navigateTo({
        url: '/packageHome/pages/article/index?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },
  //咨询
  // 获取文章分类
  getCategory() {
    api.homeArticleCategory({
      pageNum: 0,
      pageSize: 10,
      statusList: []
    }).then((res) => {
      if (res.code === 200) {
        this.setData({
          artcileTypeList: res.data.data
        })
        if (res.data.data.length > 0 || res.data.total > 0) {
          let that = this
          if (res.data.data.some(function (item, index) {
              return item.id == that.data.indexId
            })) {
            that.gethomeArticleList()
          } else {
            that.setData({
              indexId: res.data.data[0].id
            })
            that.gethomeArticleList()
          }
        }
      }
    })
  },
  // 获取文章列表
  gethomeArticleList() {
    api.homeArticleList({
      pageNum: 0,
      pageSize: 50,
      articleTypeList: [this.data.indexId]
    }).then(res => {
      if (res.code == 200) {
        if (res.data.data.length > 0) {
          this.setData({
            artcileList: res.data.data
          })
        } else {
          this.setData({
            oneInfo: '',
            artcileList: []
          })
        }
      }
    })
  },
  // 资讯科普切换tab
  change(e) {
    this.setData({
      indexId: e.currentTarget.dataset.id
    })
    this.gethomeArticleList()
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
    if (this.data.status) {
      // this.getserviceList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})