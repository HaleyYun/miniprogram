const app = getApp()
const api = require('../../../http/api.js')
const amapFile = require('../../../libs/amap-wx')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkId:0,
    ossImg:app.globalData.ossImgUrl,
    iconUrl:app.globalData.ossImgUrl +'showMake.png',
    iconBtn:app.globalData.ossImgUrl +'showSee.png',
    weekList:[],
    amTime:'',
    pmTime:'',
    mapImg:'',
    latitude:'',//经纬度
    longitude:'',//经纬度
    personShow:true,//成员
    instituShow:false,//机构
    serveShow:false,//服务
    userInfo:'',//成员信息
    avatarUrl:'',//成员头像
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      latitude:options.latitude,//经纬度
      longitude:options.longitude,//经纬度
    })
    if(options.organNum){
      wx.setStorageSync("organNum",options.organNum)
    }
    if(options.id){
      wx.setStorageSync("serveId",options.id)
    }
  },

  //获取预约成员信息"pages/servicepage/index"
  getPerson(){
      api.detailInfo({}).then(res=>{
        if(res.data.healthRecordsBase!=null){
          console.log(res)
          this.setData({
            personShow:true,//成员
            userInfo:res.data?.healthRecordsBase,
            avatarUrl:res.data.avatarUrl
          })
        }
      })
  },
  deleteinfo() {
    wx.navigateTo({
      url: '/packageHome/pages/servicepage/index?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
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
    //获取预约成员信息
    this.getPerson()
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