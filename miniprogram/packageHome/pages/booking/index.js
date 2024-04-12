const app = getApp()
const api = require('../../../http/api.js')
const util = require('../../../util/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
	ossImg:app.globalData.ossImgUrl,
  list:[],//列表数据
  popup:false,//退款弹框
  currentItem:{},//退款数据
  page:0,
  status:true,//触底加载状态
  doctor:false,//列表无数据
  loadStatus:'', //loading-加载中,noData-无数据,failure-加载失败,
  schedule:0, //加载中进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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
    this.setData({
      page:0,
      status:true,//触底加载状态
      list:[]
    })
    this.getList()
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
  // 取消
  cancel(){
    this.setData({
      popup:false
    })
  },
  // 确认
  verify: util.debounce(function (){
    this.setData({
      popup:false
    })
    let data = {
      money: this.data.currentItem.money,
      outTradeNo: this.data.currentItem.ticketsBookingCode,
      reason: '',
      refundMoney: this.data.currentItem.money,
      ticketId: this.data.currentItem.ticketsBookingCode,
      ticketType:1,
    }
    api.createRefund(data).then(res=>{
      if(res.code===200){
        wx.showToast({
          icon:'success',
          title: '申请退款成功',
        })
        this.getList()
      }else{
        wx.showToast({
          icon:'error',
          title: res.msg,
        })
      }
    })
  }, 500),
  //获取工单列表
  getList(){
    this.setData({
      page:this.data.page+1
    })
    api.orderList({
      pageNum: this.data.page,
      pageSize: 10,
    }).then(res=>{
      if (res.code==200) {
        if (res.data.total==0) {
          this.setData({
            loadStatus:'noData',
            list:[]
          })
        } else {
          if (res.data.data.length<10) {
            this.setData({
              status:false
            })
          } else {
            this.setData({
              status:true
            })
          }
          let arr = this.data.list.concat(res.data.data)
          this.setData({
            list:arr,
          })
        }
      } else {
        this.setData({
          loadStatus:'failure',
          list:[]
        })
      }
    })
  },
  //跳转详情页
  detail(e){
    console.log(e)
    wx.navigateTo({
      url: '/packageHome/pages/orderDetails/index?code=' + e.currentTarget.dataset.code + '&type=1',
    })
  },
  //退款
  refund(e){
    this.setData({
      currentItem:e.currentTarget.dataset.item,
      popup:true
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
    if (this.data.status) {
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})