const app = getApp()
const api = require('../../../http/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ossImg:app.globalData.ossImgUrl,
    serveTypeList:[],
    serveList:[],
    newList:[],
    page:0,
    status:true,//触底加载状态
    serviceType:0,
    index:0,
    latitude:'',//经纬度
    longitude:'',//经纬度
    id:"",
    loadStatus:'', //loading-加载中,noData-无数据,failure-加载失败,
    schedule:0, //加载中进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      serviceType:options.type,
      latitude:options.latitude,//经纬度
      longitude:options.longitude,//经纬度
      serveList:[],
      newList:[],
      page:0,
      status:true,//触底加载状态
    })
    this.getserviceCategory()
  },
    // 获取服务列表
    getserviceList(){
      this.setData({
        page:this.data.page+1
      })
      api.serviceList({
        serviceType:this.data.serviceType,
        id:this.data.id,
        pageNum:this.data.page,
        pageSize:10
      }).then(res=>{
        if (res.code==200) {
          if (res.data.total==0) {
            this.setData({
              loadStatus:'noData',
              serveList:[]
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
            console.log(res.data.data,'sss');
            // let arr = this.data.serveList.concat(res.data.data)
            this.setData({
              serveList:arr
            })
          }
        } else {
          this.setData({
            loadStatus:'failure',
            serveList:[]
          })
        }
      })
    },
  // 获取服务分类
  getserviceCategory(){
    api.serpaginQueryCombine({
      status:1,
      pageNum:1,
      pageSize:100,
      serviceType:this.data.serviceType
    }).then(res=>{
      if (res.code==200) {
        if (res.data.total==null) {
          this.setData({
            loadStatus:'noData',
            serveList:[]
          })
        } else {
          this.setData({
            serveTypeList:res.data.data,
            id:res.data.data[0].id
          })
          console.log(res.data.data,'res.data.data');
          // this.getserviceList()
            if (res.data.data.length<10) {
              this.setData({
                status:false
              })
            } else {
              this.setData({
                status:true
              })
            }
            this.data.newList=res.data.data
            let arr = this.data.serveList.concat(res.data.data[0].productList)
            this.setData({
              serveList:arr
            })
        }
      } else {
        this.setData({
          loadStatus:'failure',
          serveList:[]
        })
      }
    })
  },

  // tab切换
  tabToggle(e){
    console.log(e,'999');
    this.setData({
      serveList:[],
      page:0,
      status:true,//触底加载状态
      id:e.currentTarget.dataset.id
    })
    let res = this.data.newList.filter(item => item.id == this.data.id)
    let arr = this.data.serveList.concat(res[0].productList)
    this.setData({
      serveList:arr
    })
  },
  // 跳转详情页
  goCommodityDetails(e){
    if (this.data.serviceType=='tc') {
      wx.navigateTo({
        url:'/packageMy/pages/detail/index?id=' + e.currentTarget.dataset.id  
      })
    }
  },
  // 跳转预约
  choose(e){
    if (this.data.serviceType=='book') {
      getCurrentPages()[1].id=e.currentTarget.dataset.id
      getCurrentPages()[1].latitude=this.data.latitude
      getCurrentPages()[1].longitude=this.data.longitude
      wx.navigateBack()
      // wx.navigateTo({
      //   url:'/packageHome/pages/order/index?id=' + e.currentTarget.dataset.id +'&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude,
      // })
    }
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