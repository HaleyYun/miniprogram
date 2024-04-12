// packageScale/pages/ad8Index/index.js
import {
  rpxToPx
} from "../../../util/px-rpx"
import {
  getScaleEstimateNum
} from "../../../http/api"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    outBtntop: 0,
    outBack:0,//右上角返回跳哪个页面  0权益列表 1 权益多个列表 2权益详情 3 支付订单列表
    ticketCode:'',
    str:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,'options.outBack');
    this.setData({
      ticketCode:options.ticketCode,
      prodectCode:options.prodectCode,
      types:options.types,
      str:options.str
    })
    if(options.outBack){
      this.setData({
        outBack:options.outBack,
        ticketCode:options.ticketCode
      })
    }
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    let outBtntop = menuButtonInfo.top + (menuButtonInfo.height - rpxToPx(40)) / 2;
    this.setData({
      outBtntop
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
  outPage() {
    //右上角返回跳哪个页面  0权益列表 1 权益多个列表 2权益详情 3 支付订单列表
    if(this.data.outBack == 0){
      wx.redirectTo({
        url: '/packageHome/pages/interests/index',
      })
    }else if(this.data.outBack == 1){
      wx.redirectTo({
        url: '/packageHome/pages/equityList/index?code='+ this.data.ticketCode,
      })
    }else if(this.data.outBack == 2){
      console.log('0000000000000');
      wx.redirectTo({
        url: '/packageHome/pages/equityDetails/index?type='+ this.data.types + '&code=' + this.data.prodectCode,
      })
    }else if(this.data.outBack == 3){
      wx.redirectTo({
        url: '/packageHome/pages/meal/index?str='+ this.data.str,
      })
    }
   
  },
  goEvaluation() {
    let data = {
      archivesNo: app.globalData.serverInfo.clientId,
      customName: app.globalData.serverInfo.clientName,
      customPhone: app.globalData.serverInfo.phone,
      deviceNum: 0 + '_' + 0,
      estimateServeCode: app.globalData.serverInfo.checkService,
      estimateServeName: app.globalData.serverInfo.checkName,
      orderNum: app.globalData.serverInfo.ticketsBookingCode,
      status: '',
      estimateNum: ''
    }
    getScaleEstimateNum(data).then(res => {
      console.log(res)
      if (res.code === 200) {
        wx.redirectTo({
          url: '../ad8/index?estimateNum=' + res.data + '&outBack=' +  this.data.outBack + '&type='+ this.data.types + '&prodectCode=' + this.data.prodectCode +'&code='+ this.data.ticketCode + '&str=' + this.data.str,
        })
      }
    })
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