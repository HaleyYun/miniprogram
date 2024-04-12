const app = getApp()
const api = require('../../../http/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
	  ossImg:app.globalData.ossImgUrl,
    list:[],//列表
    search:'',//搜索内容
    state:true,//触底请求状态
    page:0,//请求页数
    show:true,//省市区弹框
    provinceCode:'',
    cityCode:'',
    areaCode:'',
    
    provinceList:'',
    cityList:'',
    areaList:'',
    url:'',
    address:['','',''],//省/市/区
    latitude:'',//纬度
    longitude:'',//经度
    doctor:false,//列表无数据
    loadStatus:'', //loading-加载中,noData-无数据,failure-加载失败,
    schedule:0, //加载中进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      latitude:options.latitude,//纬度
      longitude:options.longitude,//经度
      url:options.url
    })
    this.getList('','','province')
  },
  //获取省份
  getList(code,level,type){
    api.codeList({code:code,level:level}).then(res=>{
      if(res.code==200){
        if(type=='province'){
          this.setData({
            provinceList:res.data
          })
        }
        if(type=='city'){
          this.setData({
            cityList:res.data
          })
        }
        if(type=='area'){
          this.setData({
            areaList:res.data
          })
        }
      }
    })
  },
  
//获取列表数据
  getMechanismList(){
    this.setData({
      page:this.data.page+1
    })
    api.mechanismList({
      latitude:this.data.latitude,
      longitude: this.data.longitude,
      organName:this.data.search,
      pageNum:this.data.page,
      pageSize:5,
      provinceCode:this.data.provinceCode,
      cityCode:this.data.cityCode,
      areaCode:this.data.areaCode,
    }).then(res=>{
      if (res.code===200) {
        if (res.data.total==0) {
          this.setData({
            loadStatus:'noData',
            list:[]
          })
        } else {
          if (res.data.data.length<5) {
            this.setData({
              state:false,
            })
          }else{
            this.setData({
              state:true,
            })
          }
          let arr = this.data.list.concat(res.data.data)
          this.setData({
            list:arr,
            address:[arr[0].provinceLabel,arr[0].cityLabel,arr[0].areaLabel]
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
  // 电话咨询
  tel(phone){
    wx.makePhoneCall({
      phoneNumber: phone.currentTarget.dataset.phone
    })
  },
  // 搜索
  search(){
    this.setData({
      address:['','',''],
      list:[],//列表
    })
    api.mechanismList({
      latitude:this.data.latitude,
      longitude:this.data. longitude,
      organName:this.data.search,
      pageNum:1
    }).then(res=>{
      if (res.data.total==0) {
        this.setData({
          doctor:true,//列表无数据
        })
      } else {
        this.setData({
          doctor:false,//列表无数据
          state:false,
          list:res.data.data
        })
      }
    })
  },
  //筛选省市区
  choose(){
    this.setData({
      show:false
    })
  },

  //选择省份
  province(e){
    this.setData({
      provinceCode:e.currentTarget.dataset.item.code,
      ['address[0]']:e.currentTarget.dataset.item.label,
      ['address[1]']:'',
      ['address[2]']:''
    })
    this.getList(e.currentTarget.dataset.item.code,1,'city')
  },
  //选择城市
  city(e){
    this.setData({
      cityCode:e.currentTarget.dataset.item.code,
      ['address[1]']:e.currentTarget.dataset.item.label
    })
    this.getList(e.currentTarget.dataset.item.code,2,'area')
  },
  // 选择区
  area(e){
    this.setData({
      areaCode:e.currentTarget.dataset.item.code,
      show:true,
      ['address[2]']:e.currentTarget.dataset.item.label
    })
    this.setData({
      page:0,
      list:[]
    })
    this.getMechanismList()
  },

  //取消
  close(){
    this.setData({
      show:true
    })
  },
  //确定
  sure(){
    this.setData({
      show:true,
      page:0,
      list:[]
    })
    this.getMechanismList()
  },
   //选择机构
   checkOne(e){
    getCurrentPages()[1].organNum=e.currentTarget.dataset.id
    getCurrentPages()[1].latitude=this.data.latitude
    getCurrentPages()[1].longitude=this.data.longitude
    wx.navigateBack()
    // wx.navigateTo({
    //   url: '/packageHome/pages/order/index?organNum=' + e.currentTarget.dataset.id + '&latitude=' + this.data.latitude  + '&longitude=' + this.data.longitude, 
    // })
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
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
      }
    })
    this.setData({
      page:0,
      list:[],
      state:true,//触底请求状态
    })
    this.getMechanismList()
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
    if (this.data.state) {
      this.getMechanismList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})