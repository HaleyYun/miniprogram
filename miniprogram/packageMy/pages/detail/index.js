const app = getApp()
const api = require('../../../http/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    organNum:'',
    prodCode:'',
    productCode:'',
    latitude:'',
    longitude:'',
    type:'',
    addInfoShow: false, //建档弹框
    distinguish:'',//区分
    goodId:'',
    ossImg:app.globalData.ossImgUrl,
    id:0,
    swiperImg:[],
    detailPic:'',
    price:0,
    sold:0,
    introduction:'',
    index:1,
    productCode:'',
  },
  bindchange(e){
    this.setData({
      index:e.detail.current+1
    })
  },
  // 获取商品详情
  getCommodityDetail(){
    api.commodityDetailPage({
      id:this.data.id
    }).then(res=>{
      this.setData({
        swiperImg:res.data?.playPicList,
        detailPic:res.data.detailPic,
        price:res.data.prodPrice,
        sold:res.data.prodSold,
        introduction:res.data.prodName ,
        prodCode:res.data.prodCode,
      })
    })
  },

    // 获取商品优惠券详情
    getCouponDetail(){
      api.commodityCodePage({
        code:this.data.productCode
      }).then(res=>{
        this.setData({
          swiperImg:res.data?.playPicList,
          detailPic:res.data.detailPic,
          price:res.data.prodPrice,
          sold:res.data.prodSold,
          introduction:res.data.prodName,
          id:res.data.id,
          prodCode:res.data.prodCode,
        })
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    console.log(option,'oooo');
    this.setData({
      type:option?.type,
      organNum:option.organNum,
      latitude:option.latitude,
      longitude:option.longitude,
      productCode:option.productCode,
    })
    if(option.type==1 || option.type==2){
      this.setData({
        productCode:option.productCode,
      })
    }else{
      this.setData({
        id:option.id,
        type:3
      })
    }
  
  },
  gopayment(){
    if (wx.getStorageSync('token')!='') {
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then((res) => {
        if (res.code == 200) {
          if (res.data != null) {
             wx.setStorageSync('archivesNo',res.data)
             wx.navigateTo({
              url: '/packageHome/pages/confirmOrder/index?id='+this.data.id + '&prodCode=' + this.data.prodCode
              ,
            })
          
          } else {
            this.setData({
              addInfoShow: true,
              distinguish: 4
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/page/login/start/index?pageUrl=/packageHome/pages/confirmOrder/index&str=4&id='+this.data.id + '&prodCode=' + this.data.prodCode,
      })
    }
  },

   //电话咨询
   call(e){
    wx.makePhoneCall({
      phoneNumber: '400-1852-5658'
    })
  },
    // 建档
    toAddinfo() {
      this.setData({
        addInfoShow:false
      })
        wx.navigateTo({
          url: '/page/my/infoEdit/index' + '?str=' + this.data.distinguish +  '&goodId=' + this.data.id
        })
      },
       // 取消
    deleteinfo() {
      this.setData({
        addInfoShow:false
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
    if(this.data.type==1 || this.data.type==2){
      this.getCouponDetail()
    }else{
      this.getCommodityDetail()
    }

  },
  //立预约
  getAppointment(e) {
      wx.navigateTo({
        url:'/packageHome/pages/order/index?organNum=' + this.data.organNum +'&productCode=' + this.data.productCode +'&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude,
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