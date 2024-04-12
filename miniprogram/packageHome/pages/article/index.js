const app = getApp()
const api = require('../../../http/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ossImg: app.globalData.ossImgUrl,
    articleId:'',
    allInfo:'',
    unpack:true,//展开收起
    playPause:true,//播放暂停
    duration:'',//视频总时长
    durationHMS:'',//视频总时长
    schedule:0.25,//播放时间
    scheduleHMS:'00:00:00',//播放时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      articleId:options.id
    })
    this.getDetail()
  },
  //获取文章详情
  getDetail(){
    api.homeArticleDetail({id:this.data.articleId}).then(res=>{
      this.setData({
        allInfo:res.data
      })
    })
  },
  // 展开收起
  unpack(){
    this.setData({
      unpack:!this.data.unpack
    })
  },
  // 播放暂停
  playPause(){
    if (this.data.playPause) {
      wx.createVideoContext('video').pause()
      this.setData({
        playPause:!this.data.playPause
      })
    } else {
      wx.createVideoContext('video').play()
      this.setData({
        playPause:!this.data.playPause
      })
    }
  },
  timeupdate(){
    this.setData({
      schedule:this.data.schedule+0.25
    })
    let strh = parseInt(Math.round(this.data.schedule)/3600)<10?'0'+parseInt(Math.round(this.data.schedule)/3600):parseInt(Math.round(this.data.schedule)/3600)
    let strm = parseInt((Math.round(this.data.schedule)/60)%60)<10?'0'+parseInt((Math.round(this.data.schedule)/60)%60):parseInt((Math.round(this.data.schedule)/60)%60)
    let strs = Math.round(this.data.schedule)%60<10?'0'+Math.round(this.data.schedule)%60:Math.round(this.data.schedule)%60
    this.setData({
      scheduleHMS:strh+':'+strm+':'+strs
    })
  },
  loadedmetadata(e){
    let strh = parseInt(Math.round(e.detail.duration)/3600)<10?'0'+parseInt(Math.round(e.detail.duration)/3600):parseInt(Math.round(e.detail.duration)/3600)
    let strm = parseInt((Math.round(e.detail.duration)/60)%60)<10?'0'+parseInt((Math.round(e.detail.duration)/60)%60):parseInt((Math.round(e.detail.duration)/60)%60)
    let strs = Math.round(e.detail.duration)%60<10?'0'+Math.round(e.detail.duration)%60:Math.round(e.detail.duration)%60
    this.setData({
      duration:Math.round(e.detail.duration),
      durationHMS:strh+':'+strm+':'+strs
    })
  },
  ended(){
    this.setData({
      playPause:false,//播放暂停
      schedule:0,//播放时间
      scheduleHMS:'00:00:00',//播放时间
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