const app = getApp()
const api = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  ossImg:app.globalData.ossImgUrl,
    // infoList:[],//档案列表
    list:[],//干预列表
    weekList:[],//周列表
    weekSequence:1,//选中周
    weekName:'第1周',//选中周name
    trainingList:[
      // {id:'0',title:'饮食完成率',accomplish:'（100%为合格）',qualified:'10%',color:'#F02B42',backgroundColor:'#FFEBED'},
      // {id:'1',title:'训练时长',accomplish:'（150分钟为合格）',qualified:'70分20',color:'#4883F4',backgroundColor:'#E7F7FD'},
      // {id:'2',title:'认知激活量',accomplish:'（25个为合格）',qualified:'19个备份',color:'#33C6AD',backgroundColor:'#EEFBF8'}
    ],
    interventionOrderNumber:'',//干预单号
    statusBarHeight:0,//状态栏高度
    addInfoShow: false,//建档弹框
    pageNum:0,
    state:true,//触底请求状态
    doctor:false,//列表无数据
    loadStatus:'', //loading-加载中,noData-无数据,failure-加载失败,
    schedule:0, //加载中进度
    show:false,
  },
  
  toggle(e){
    this.setData({
      pageNum:0,
      state:true,
      list:[],
    })
    this.getInterveneList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      statusBarHeight:wx.getSystemInfoSync().statusBarHeight
    })
    this.getInterveneList()
  },

  //周选择
  bindDateChange(e) {
    this.setData({
      weekSequence: Number(e.detail.value)+1,
      weekName:'第'+(Number(e.detail.value)+1)+'周'
    })
    this.weekRecordList()
  },
  //展开
  unfold(e){
    let arr = this.data.list
    arr.forEach((item)=>{item['turnUp']=false})
    this.setData({
      list:arr,
      [`list[${e.currentTarget.dataset.index}].turnUp`]:true,
      interventionOrderNumber:e.currentTarget.dataset.id
    })
    api.queryWeekList({
      interventionOrderNumber:e.currentTarget.dataset.id
    }).then(res=>{
      this.setData({
        weekList:res.data
      })
    })
    this.weekRecordList()
  },
  //收起
  packUp(e){
    this.setData({
      [`list[${e.currentTarget.dataset.index}].turnUp`]:false
    })
  },
  // 获取干预记录列表
  getInterveneList(){
    this.setData({
      pageNum:this.data.pageNum+1
    })
    api.interveneList({
      pageNum:this.data.pageNum,
      pageSize:10
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
              state:false,
            })
          } else {
            this.setData({
              state:true,
            })
          }
          res.data.data.forEach(item=>{item.turnUp=false})
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
  // 查询周干预情况
  weekRecordList(){
    api.weekRecord({
      interventionOrderNumber:this.data.interventionOrderNumber,
      weekSequence: this.data.weekSequence,
    }).then(res=>{
      let arr = []
      res.data.forEach(item=>{
        if(item.title=='饮食完成率'){
          arr.push({
              id:'0',
              title:item.title,
              standard: '(' +  item.standard + '%为合格）',
              complete:item.complete + '%',
              color:'#F02B42',
              backgroundColor:'#FFEBED'
            })
        }
        if(item.title=='训练时长'){
          arr.push({
              id:'1',
              title:item.title,
              standard: '(' +  item.standard + '分钟为合格）',
              complete:item.complete + '分',
              color:'#4883F4',
              backgroundColor:'#E7F7FD'
            })
        }
        if(item.title=='认知激活量'){
          arr.push({
              id:'2',
              title:item.title,
              standard: '(' +  item.standard + '个为合格）',
              complete:item.complete + '个',
              color:'#33C6AD',
              backgroundColor:'#EEFBF8'
            })
        }
      })
      this.setData({
        trainingList:arr,
        show:arr.some(item=>{return item.title=='认知激活量'})
      })
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
    // 建档
    toAddinfo() {
      wx.navigateTo({
        url: '/page/health/addinfo/index',
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
    if (this.data.state) {
      this.getInterveneList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})