const app = getApp()
const api = require('../../../http/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schedule:0, //加载中进度
    loadStatus:'', //loading-加载中,noData-无数据,failure-加载失败,
    type:1,
    foldImg:app.globalData.ossImgUrl,
    ossImg:app.globalData.ossImgUrl,
    switch:false,
    serveTypeList:[
      {
        id: 5,
        option: '全部'
      },
      {
        id: 0,
        option: '未使用'
      },
      {
        id: 1,
        option: '已使用'
      },
      {
        id: 2,
        option: '已过期'
      }
     ],//优惠券列表
     latitude:'',
     longitude:'',
    serveList:[],
    newList:[],
    page:1,
    status:true,//触底加载状态
    couponStatus:5,
    serviceType:0,
    index:0,
    id:5,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

    this.setData({
      serviceType:'tc',
      newList:[],
      page:1,
      status:true,//触底加载状态

    })
   this.getCoupon()
  },
   
 //获取优惠券列表
 getCoupon(){
  api.couponApp({ pageNum: this.data.page, pageSize: 10 ,status: this.data.couponStatus}).then(res=>{
    if(res.code==200){
      if (res.code===200) {
        if (res.data.total==0) {
          this.setData({
            loadStatus:'noData',
            serveList:[]
          })
        } else {
          if (res.data.data.length<10) {
            this.setData({
              switch:false,
            })
          } else {
            this.setData({
              switch:true,
            })
          }
          this.setData({
            serveList:this.data.serveList.concat(res.data.data)
          })
        }
      } else {
        this.setData({
          loadStatus:'failure',
          serveList:[]
        })
      }
    }
  })
},
  // this.setData({
    //   page:0,
    //   couponStatus:true,//触底加载状态
    //   id:e.currentTarget.dataset.id
    // })
  // tab切换
  tabToggle(e){
    this.setData({
      page:1,
      couponStatus:e.currentTarget.dataset.id,//触底加载状态
      id:e.currentTarget.dataset.id,//触底加载状态
      serveList:[],
    })
    this.getCoupon()

  },
  // 去使用
  choose(e){
    api.couponUseCheck({ code: e.currentTarget.dataset.item.couponCode}).then(res=>{
      if(res.code==200){
        console.log(res,'dsds');
        if (e.currentTarget.dataset.item.serviceType=='tc') {
          wx.navigateTo({
            url: '/packageMy/pages/detail/index?productCode=' + e.currentTarget.dataset.item.productCode  + '&type=' + this.data.type
          })
        }else{
          // wx.navigateTo({
          //   url: '/packageMy/pages/detail/index?productCode=' + e.currentTarget.dataset.item.productCode  + '&type=' + 2
          // })
          wx.navigateTo({
            url: '/packageHome/pages/servicepage/index'
          })
        }
      }else{
        wx.showToast({
          icon:'error',
          title:res.msg,
        })
      }
    })
    console.log(e.currentTarget,'ppp');
 
    
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
    console.log('触底');
    if (this.data.switch) {
      console.log('ppppp');
      this.setData({
        page:this.data.page+1
      })
      this.getCoupon()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})