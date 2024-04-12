const app = getApp()
const api = require('../../../http/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    methodList:[
      {id:0,option:'微信支付',iconUrl:app.globalData.ossImgUrl +'wx.png',state:true},
    ],
    method:'微信支付',
	  ossImg:app.globalData.ossImgUrl,
    order:{},
    active:0,
    steps: [
      {
        text: '下单成功 ',
        desc: '2023-05-21 08:30',
        inactiveIcon: 'location-o',
        activeIcon: 'success',
      },
      {
        text: '开始筛查',
        desc: '2023-05-21 08:30',
        inactiveIcon: 'like-o',
        activeIcon: 'plus',
      },
      {
        text: '干预计划制定',
        desc: '2023-05-21 08:30',
        inactiveIcon: 'star-o',
        activeIcon: 'cross',
      },
      {
        text: '完成',
        desc: '2023-05-21 08:30',
        inactiveIcon: 'phone-o',
        activeIcon: 'fail',
      },
    ],
    prodectCode:'',//产品预约单号
    types:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options.type',options.type);
    this.setData({
      prodectCode:options.code,
      types:options.type
    })
    if(options.type=='1'){
      //预约订单详情
      wx.setNavigationBarTitle({
        title: '预约工单详情',
      })
      this.getOrderDetail()
      this.getSteps()
    }else if(options.type=='3'){
      //权益订单详情
      wx.setNavigationBarTitle({
        title: '权益工单详情',
      })
      this.getEquityDetail()
      this.getSteps()
    }else{
      //套餐订单详情
      wx.setNavigationBarTitle({
        title: '服务工单详情',
      })
      this.getMealDetail()
      this.getSteps()
    }
  },
  //预约详情信息
  getOrderDetail(){
    api.orderDetail({code:this.data.prodectCode}).then(res=>{
      console.log(res)
      this.setData({
        order:res.data
      })
    })
  },
   //套餐订单详情信息
   getMealDetail(){
    api.packageDetail({code:this.data.prodectCode}).then(res=>{
      console.log(res)
      this.setData({
        order:res.data
      })
    })
  },
  //权益详情信息
  getEquityDetail(){
    api.equityDetail({code:this.data.prodectCode}).then(res=>{
      console.log(res)
      this.setData({
        order:res.data
      })
    })
  },
  //获取流程
  getSteps(){
    api.orderLogs({ticketCode:this.data.prodectCode,ticketsTypeId:this.data.types}).then(res=>{
      let arr = []
      res.data.data.forEach(item=>{
        arr.push({
          text: item.content,
          desc: item.createTime,
          inactiveIcon: '',
          activeIcon: '',
        })
      })
      this.setData({
        steps:arr,
        active:arr.length-1
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  //电话咨询
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
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
