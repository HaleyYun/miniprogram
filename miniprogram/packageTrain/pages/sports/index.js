const app = getApp()
const api = require('../../../http/api')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ossImg:app.globalData.ossImgUrl,
    knowledgeBaseId:'',//训练组合id
    sportsDataList:[
      {id:0,option:'当日训练',quantity:'0分钟'},
      {id:1,option:'训练中',quantity:'0人'},
      {id:2,option:'累计训练',quantity:'0分钟'},
    ],
    videoUrl:'',//视频地址
    videoIndex:0,//第几个视频
    training:[],//视频列表
    duration:0,//当前视频总时长
    runTime:0,//经历时长
    trainingName:'',//训练名称
    title:'',
    date:'',
  },
  getTodaySportsRecord(){
    api.todaySportsRecord({
      localDate:this.data.date
    }).then(res=>{
      // console.log(res);
      this.setData({
        ['sportsDataList[0].quantity']:res.data.todaySportsMin+'分钟',
        ['sportsDataList[1].quantity']:res.data.todayTotalPeopleCount+'人',
        ['sportsDataList[2].quantity']:res.data.totalSportsMin+'分钟',
      })
    })
  },
  getSports(){
    api.sports({
      knowledgeBaseId: this.data.knowledgeBaseId
    }).then(res=>{
      this.setData({
        training:res.data,
        videoUrl:res.data[0].videoUrl,
        title:res.data[0].assemblyName,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      knowledgeBaseId:options.id,
      title:options.title,
      date:wx.getStorageSync('date')
    })
    this.getTodaySportsRecord()
    this.getSports()
    api.clockIn({
      attendanceType:'sports',
      knowledgeBaseId:this.data.knowledgeBaseId,
      date:wx.getStorageSync('date')
    })
  },
  // 视频进度改变，每250ms执行一次
  duration(){
    this.setData({
      runTime:this.data.runTime+250
    })
  },
  //视频播放结束事件
  videoEnd(e){
    // 记录训练时间
    api.saveSportsVideoTime({
      playDuration:Math.round(this.data.runTime/1000),
      totalDuration:Math.round(this.data.duration),
      videoUrl:this.data.videoUrl,
      localDate:this.data.date
    })
    // 记录之后视频观看时间归零
    this.setData({
      runTime:0
    })

    setTimeout(() => {
      //如果videoIndex等于training.length-1就是最后一条视频
      if (this.data.videoIndex==this.data.training.length-1) {
        // 暂停视频
        wx.createVideoContext('video').pause()
        //如果videoIndex小于training.length-1
      } else if(this.data.videoIndex<this.data.training.length-1) {
        // videoIndex+1播放下一条
        this.setData({
          videoIndex: this.data.videoIndex+1
        })
      }
      // 更换视频url
      this.setData({
        videoUrl:this.data.training[this.data.videoIndex].videoUrl
      })
    }, this.data.training[this.data.videoIndex].relaxMinute*60000);
  },
  // 切换视频
  startTraining(e){
    this.setData({
      videoUrl:e.currentTarget.dataset.videourl,
      videoIndex:e.currentTarget.dataset.index
    })
  },
  // 视频加载完拿到视频总时长
  videoData(e){
    if (this.data.videoIndex==0) {
      this.setData({
        duration:e.detail.duration
      })
    } else {
      this.setData({
        duration:e.detail.duration
      })
    // 开始播放
    wx.createVideoContext('video').play()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})