const api = require("../../../http/api")
const app = getApp()
// packageHealth/pages/food/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ossImg:app.globalData.ossImgUrl,
    statusBarHeight:0,
    dialog:false,
    date:'',
    search:'',
    sort:[
      {id:'G',label:'谷物'},
      {id:'V',label:'蔬菜'},
      {id:'F',label:'水果'},
      {id:'N',label:'坚果'},
      {id:'R',label:'红肉'},
      {id:'P',label:'禽类'},
      {id:'S',label:'海鲜'},
      {id:'D',label:'乳制品'},
    ],
    sortActive:'G',
    content:[],
    tab:[
      {id:0,options:'早餐'},
      {id:1,options:'午餐'},
      {id:2,options:'晚餐'},
    ],
    tabActive:0,
    morning:{
      id:'',
      infoList:[],
      mealTime:'1'
    },
    middle:{
      id:'',
      infoList:[],
      mealTime:'2'
    },
    evening:{
      id:'',
      infoList:[],
      mealTime:'3'
    }
  },
  initiate(){
    if (this.data.morning.infoList.length!=0||this.data.middle.infoList.length!=0||this.data.evening.infoList.length!=0) {
      api.addFood({
        localDate:this.data.date,
        req:[
          this.data.morning,
          this.data.middle,
          this.data.evening
        ]
      }).then(res=>{
        if (res.code==200) {
          wx.navigateBack()
        }
      })
    }else{
      this.setData({
        dialog:true,
      })
    }
  },
  confirm(){
    this.setData({
      dialog:false,
    })
  },
  toggle(e){
    this.setData({
      sortActive:e.currentTarget.dataset.id
    })
    this.getConditionsSelect()
  },
  tab(e){
    this.setData({
      tabActive:e.currentTarget.dataset.id
    })
  },
  onChange(event) {
    if (this.data.tabActive==0) {
      this.setData({
        [`morning.infoList[${event.currentTarget.dataset.index}].num`]:event.detail
      })
    } else if (this.data.tabActive==1) {
      this.setData({
        [`middle.infoList[${event.currentTarget.dataset.index}].num`]:event.detail
      })
    } else if (this.data.tabActive==2) {
      this.setData({
        [`evening.infoList[${event.currentTarget.dataset.index}].num`]:event.detail
      })
    }
  },
  overlimit(e){
    if (this.data.tabActive==0) {
      let arr=this.data.morning.infoList
      arr.splice(e.currentTarget.dataset.index,1)
      this.setData({
        ['morning.infoList']:arr
      })
    } else if (this.data.tabActive==1) {
      let arr=this.data.middle.infoList
      arr.splice(e.currentTarget.dataset.index,1)
      this.setData({
        ['middle.infoList']:arr
      })
    } else if (this.data.tabActive==2) {
      let arr=this.data.evening.infoList
      arr.splice(e.currentTarget.dataset.index,1)
      this.setData({
        ['evening.infoList']:arr
      })
    }
  },
  search(){
    this.getConditionsSelect()
  },
  add(e){
    if (this.data.tabActive==0) {
      let arr=this.data.morning.infoList
      if (arr.some((item,index)=>{return item.id==e.currentTarget.dataset.data.id})) {
        for (let index = 0; index < arr.length; index++) {
          if (arr[index].id==e.currentTarget.dataset.data.id) {
            arr[index].num=arr[index].num+1
            break
          }
        }
      }else{
        e.currentTarget.dataset.data.num=1
        arr.unshift(e.currentTarget.dataset.data)
      }
      this.setData({
        ['morning.infoList']:arr
      })
    } else if (this.data.tabActive==1) {
      let arr=this.data.middle.infoList
      if (arr.some((item,index)=>{return item.id==e.currentTarget.dataset.data.id})) {
        for (let index = 0; index < arr.length; index++) {
          if (arr[index].id==e.currentTarget.dataset.data.id) {
            arr[index].num=arr[index].num+1
            break
          }
        }
      }else{
        e.currentTarget.dataset.data.num=1
        arr.unshift(e.currentTarget.dataset.data)
      }
      this.setData({
        ['middle.infoList']:arr
      })
    } else if (this.data.tabActive==2) {
      let arr=this.data.evening.infoList
      if (arr.some((item,index)=>{return item.id==e.currentTarget.dataset.data.id})) {
        for (let index = 0; index < arr.length; index++) {
          if (arr[index].id==e.currentTarget.dataset.data.id) {
            arr[index].num=arr[index].num+1
            break
          }
        }
      }else{
        e.currentTarget.dataset.data.num=1
        arr.unshift(e.currentTarget.dataset.data)
      }
      this.setData({
        ['evening.infoList']:arr
      })
    }
  },
  getRecordsSelect(){
    api.RecordsSelect({
      localDate:this.data.date,
    }).then(res=>{
      for (let index = 0; index < res.data.length; index++) {
        if (res.data[index].mealTime==1) {
          this.setData({
            morning:res.data[index]
          })
        }else if(res.data[index].mealTime==2){
          this.setData({
            middle:res.data[index]
          })
        }else if(res.data[index].mealTime==3){
          this.setData({
            evening:res.data[index]
          })
        }
      }
    })
  },
  getConditionsSelect(){
    api.conditionsSelect({
      category:this.data.sortActive,
      name:this.data.search
    }).then(res=>{
      this.setData({
        content:res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      date:wx.getStorageSync('date'),
      statusBarHeight:wx.getSystemInfoSync().statusBarHeight
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
    this.getConditionsSelect()
    this.getRecordsSelect()
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