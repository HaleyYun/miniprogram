import * as echarts from '../../../ec-canvas/echarts';
const app = getApp()
const api = require('../../../http/api')
function setOption(chart,option) {
  chart.setOption(option);
}

Page({
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    ossImg:app.globalData.ossImgUrl,
    statusBarHeight:0,
    dialog:false,
    date:'',
    meals:{},
    options:[
      {id:0.2,label:'20%'},
      {id:0.4,label:'40%'},
      {id:0.6,label:'60%'},
      {id:0.8,label:'80%'},
      {id:1,label:'100%'},
    ],
    optionsActive:null,
    ecValue:{},
    ecLevel:{},
    completion:{},
    interventionWeekEnd:'',
    interventionWeekStart:'',
    recommended:[],
    showRegion:1,
    food:[
      {name:'蔬菜',upload:0,copies:0,color:'#4D8FFE',scale:0},
      {name:'红肉',upload:0,copies:0,color:'#FF95AC',scale:0},
      {name:'谷物',upload:0,copies:0,color:'#05EFEE',scale:0},
      {name:'水果',upload:0,copies:0,color:'#FFDF5A',scale:0},
      {name:'坚果',upload:0,copies:0,color:'#81ABFF',scale:0},
      {name:'海鲜',upload:0,copies:0,color:'#9591F0',scale:0},
      {name:'乳制品',upload:0,copies:0,color:'#FFB48F',scale:0},
      {name:'禽类',upload:0,copies:0,color:'#2DEF7A',scale:0},
    ],
    vsleft:[
      {name:'蔬菜',upload:'0%',url:app.globalData.ossImgUrl+'vsdestroy4.png'},
      {name:'红肉',upload:'0%',url:app.globalData.ossImgUrl+'vsdestroy7.png'},
      {name:'谷物',upload:'0%',url:app.globalData.ossImgUrl+'vsdestroy8.png'},
      {name:'水果',upload:'0%',url:app.globalData.ossImgUrl+'vsdestroy2.png'},
      {name:'坚果',upload:'0%',url:app.globalData.ossImgUrl+'vsdestroy1.png'},
      {name:'海鲜',upload:'0%',url:app.globalData.ossImgUrl+'vsdestroy3.png'},
      {name:'乳制品',upload:'0%',url:app.globalData.ossImgUrl+'vsdestroy6.png'},
      {name:'禽类',upload:'0%',url:app.globalData.ossImgUrl+'vsdestroy5.png'},

    ],
    vsright:[
      {name:'蔬菜',upload:'0%',url:app.globalData.ossImgUrl+'vsactivate4.png'},
      {name:'红肉',upload:'0%',url:app.globalData.ossImgUrl+'vsactivate7.png'},
      {name:'谷物',upload:'0%',url:app.globalData.ossImgUrl+'vsactivate8.png'},
      {name:'水果',upload:'0%',url:app.globalData.ossImgUrl+'vsactivate2.png'},
      {name:'坚果',upload:'0%',url:app.globalData.ossImgUrl+'vsactivate1.png'},
      {name:'海鲜',upload:'0%',url:app.globalData.ossImgUrl+'vsactivate3.png'},
      {name:'乳制品',upload:'0%',url:app.globalData.ossImgUrl+'vsactivate6.png'},
      {name:'禽类',upload:'0%',url:app.globalData.ossImgUrl+'vsactivate5.png'},
    ],
    unpack:false,
  },
  unpack(){
    this.setData({
      unpack:!this.data.unpack
    })
  },
  option(e){
    if (this.data.optionsActive==null) {
      api.addClockIn({
        clockIn:e.currentTarget.dataset.id,
        localDate:wx.getStorageSync('date'),
        localDate:this.data.date
      }).then(res=>{
        if (res.code==200) {
          this.getCopies()
        }
      })
    }
  },
  reveal(){
    this.setData({
      dialog:true
    })
  },
  hidden(){
    this.setData({
      dialog:false
    })
  },
  goDishesDetails(e){
    wx.navigateTo({
      url: '/packageMy/pages/dishesDetails/index?id='+e.currentTarget.dataset.id,
    })
  },
  gofood(){
    wx.navigateTo({
      url: '/packageMy/pages/food/index?date='+this.data.date,
    })
  },
  getCopies(){
    api.copies({
      localDate:this.data.date
    }).then(res=>{
      let obj={}
      for (let index = 0; index < res.data.name.length; index++) {
        obj[res.data.name[index]]=res.data.value[index]
      }
      this.setData({
        showRegion:res.data.isReveal,
        optionsActive:res.data.clockIn,
        dietPlanName:res.data.dietPlanName,
        meals:obj
      })
    })
  },
  getRecords(){
    api.records().then(res=>{
      this.setData({
        interventionWeekEnd:res.data.interventionWeekEnd,
        interventionWeekStart:res.data.interventionWeekStart,
      })
      let arr = res.data.myWeekInterventionResponseList
      for (let index = 0; index < arr.length; index++) {
        if (arr[index].name=='P') {
          this.setData({
            ['vsleft[7].upload']:arr[index].copies,
            ['vsright[7].upload']:arr[index].upload
          })
        } else if (arr[index].name=='R') {
          this.setData({
            ['vsleft[1].upload']:arr[index].copies,
            ['vsright[1].upload']:arr[index].upload
          })
        } else if (arr[index].name=='S') {
          this.setData({
            ['vsleft[5].upload']:arr[index].copies,
            ['vsright[5].upload']:arr[index].upload
          })
        } else if (arr[index].name=='D') {
          this.setData({
            ['vsleft[6].upload']:arr[index].copies,
            ['vsright[6].upload']:arr[index].upload
          })
        } else if (arr[index].name=='F') {
          this.setData({
            ['vsleft[3].upload']:arr[index].copies,
            ['vsright[3].upload']:arr[index].upload
          })
        } else if (arr[index].name=='V') {
          this.setData({
            ['vsleft[0].upload']:arr[index].copies,
            ['vsright[0].upload']:arr[index].upload
          })
        } else if (arr[index].name=='G') {
          this.setData({
            ['vsleft[2].upload']:arr[index].copies,
            ['vsright[2].upload']:arr[index].upload
          })
        } else if (arr[index].name=='N') {
          this.setData({
            ['vsleft[4].upload']:arr[index].copies,
            ['vsright[4].upload']:arr[index].upload
          })
        }
      }
    })
  },
  getDiet(){
    api.recipe({
      localDate:this.data.date
    }).then(res=>{
      this.setData({
        recommended:res.data
      })
    })
  },
  getEcharts(){
    api.echarts({
      localDate:this.data.date
    }).then(res=>{
      let arr = res.data
      for (let index = 0; index < arr.length; index++) {
        if (arr[index].name=='P') {
          this.setData({
            ['food[7].copies']:arr[index].copies,
            ['food[7].upload']:arr[index].upload,
            ['food[7].scale']:arr[index].scale
          })
        } else if (arr[index].name=='R') {
          this.setData({
            ['food[1].copies']:arr[index].copies,
            ['food[1].upload']:arr[index].upload,
            ['food[1].scale']:arr[index].scale
          })
        } else if (arr[index].name=='S') {
          this.setData({
            ['food[5].copies']:arr[index].copies,
            ['food[5].upload']:arr[index].upload,
            ['food[5].scale']:arr[index].scale
          })
        } else if (arr[index].name=='D') {
          this.setData({
            ['food[6].copies']:arr[index].copies,
            ['food[6].upload']:arr[index].upload,
            ['food[6].scale']:arr[index].scale
          })
        } else if (arr[index].name=='F') {
          this.setData({
            ['food[3].copies']:arr[index].copies,
            ['food[3].upload']:arr[index].upload,
            ['food[3].scale']:arr[index].scale
          })
        } else if (arr[index].name=='V') {
          this.setData({
            ['food[0].copies']:arr[index].copies,
            ['food[0].upload']:arr[index].upload,
            ['food[0].scale']:arr[index].scale
          })
        } else if (arr[index].name=='G') {
          this.setData({
            ['food[2].copies']:arr[index].copies,
            ['food[2].upload']:arr[index].upload,
            ['food[2].scale']:arr[index].scale
          })
        } else if (arr[index].name=='N') {
          this.setData({
            ['food[4].copies']:arr[index].copies,
            ['food[4].upload']:arr[index].upload,
            ['food[4].scale']:arr[index].scale
          })
        }
      }
      console.log(this.data.food,'this.data.food');
      this.init()
    })
  },
  init() {
    this.selectComponent('#mychart-dom-gauge').init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      const option = {
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '0%',
          containLabel: true
        },
        series: [
          {
            type: 'pie',
            radius: ['58%', '90%'],
            label: {
              show: false,
            },
            data: [
              { value: this.data.food[0].scale, name: this.data.food[0].name,itemStyle: {color:'#4D8FFE'} },
              { value: this.data.food[1].scale, name: this.data.food[1].name,itemStyle: {color:'#FF95AC'} },
              { value: this.data.food[2].scale, name: this.data.food[2].name,itemStyle: {color:'#05EFEE'} },
              { value: this.data.food[3].scale, name: this.data.food[3].name,itemStyle: {color:'#FFDF5A'} },
              { value: this.data.food[4].scale, name: this.data.food[4].name,itemStyle: {color:'#81ABFF'} },
              { value: this.data.food[5].scale, name: this.data.food[5].name,itemStyle: {color:'#9591F0'} },
              { value: this.data.food[6].scale, name: this.data.food[6].name,itemStyle: {color:'#FFB48F'} },
              { value: this.data.food[7].scale, name: this.data.food[7].name,itemStyle: {color:'#2DEF7A'} },
            ],
            hoverAnimation: false
          }
        ]
      };
      setOption(chart,option);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
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
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getCopies()
    this.getDiet()
    this.getRecords()
    this.getEcharts()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('this.chart.dispose();');
    this.chart.dispose();
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