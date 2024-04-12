import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
const api = require('../../http/api');
const aesUtil = require('../../http/useAse'); //获取加密组件
function setOption(chart, option) {
  chart.setOption(option);
}
Page({
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.ecComponent = this.selectComponent('#mychart-dom-gauge');
  },
  /**
   * 页面的初始数据
   */
  data: {
    addInfoShow: false, //建档弹框
    ec: {
      lazyLoad: true
    },
    ossImg: app.globalData.ossImgUrl,
    statusBarHeight: 0,
    gameId: '', //第三方游戏
    dialog: false,
    hebdomad: [
      // {date:"2023-08-29",isCurrent:1,options:"周二",state:0},
      // {date:"2023-08-30",isCurrent:1,options:"周三",state:1},
      // {date:"2023-08-31",isCurrent:1,options:"周四",state:0},
      // {date:"2023-09-01",isCurrent:0,options:"周五",state:0},
      // {date:"2023-09-02",isCurrent:1,options:"周六",state:2},
      // {date:"2023-09-03",isCurrent:1,options:"周日",state:2},
      // {date:"2023-09-04",isCurrent:1,options:"周一",state:2},
    ],
    hebdomadActive: '2023-08-29',
    state: 0,
    istoday: 0,
    three: {},
    taskList: [],
    types: [{
        options: '膳食',
        url: app.globalData.ossImgUrl + 'mealsbg.png',
        id: '/packageMy/pages/scale/index'
      },
      {
        options: '运动',
        url: app.globalData.ossImgUrl + 'movementbg.png',
        id: '/packageTrain/pages/exercise/index'
      }
    ],
    whichDay: '',
    see: '',
    isShowModel: 0
  },

  // 建档
  toAddinfo() {
    this.setData({
      addInfoShow: false
    })
    wx.navigateTo({
      url: '/page/my/infoEdit/index' + '?str=02'
    })
  },
  // 取消
  close() {
    this.setData({
      addInfoShow: false
    })
  },
  goscheme() {
    wx.navigateTo({
      url: '/page/train/index',
    })
  },
  goto(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.id + '?date=' + this.data.hebdomadActive,
    })
  },
  getTrainingDaily() {
    api.trainingDaily({
      localDate: this.data.hebdomadActive
    }).then(res => {
      this.setData({
        gameId: res.data.archivesNo,
        taskList: res.data.gameAdviceList,
        whichDay: res.data.whichDay,
      })
    })
  },
  goredirect(e) {
    api.clockIn({
      date: wx.getStorageSync('date'),
      attendanceType: 'game',
      knowledgeBaseId: e.currentTarget.dataset.item.knowledgeBaseId
    })
    let encrypt = aesUtil.encrypt('织生 + userId123', '1b6d64ea3375754cd67209bf501ad03a')
    let voucherCode = ''
    wx.request({
      url: app.globalData.brainApiUrl,
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'voucher': encrypt,
      },
      success: (res) => {
        let url = e.currentTarget.dataset.item.redirectUrl + '&voucherCode=' + res.data.voucherCode + '&gameList=' + e.currentTarget.dataset.item.gameId + '&difficultyList=' + e.currentTarget.dataset.item.difficulty
        wx.navigateTo({
          url: '/packageHome/pages/gameWebview/index?threeGame=' + this.data.gameId + '_' + this.data.whichDay + '&gameUrl=' + url,
        })
      },
    })
  },
  getStatisticsInfo() {
    api.statisticsInfo({
      date: wx.getStorageSync('date')
    }).then(res => {
      this.setData({
        three: res.data
      })
      this.init()
    })
  },
  getClockInList() {
    api.clockInList().then(res => {
      if (res.code == 200) {
        api.findInterveneType().then(res => {
          this.setData({
            see: res.data,
            isShowModel: 0
          })
        })
        let arr = res.data
        let arrs = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        for (let index = 0; index < arr.length; index++) {
          arr[index].options = arrs[new Date(arr[index].date).getDay()]
          if (arr[index].isCurrent == 0) {
            if (wx.getStorageSync('date')) {
              if (arr.some(function (value, index) {
                  return value.date == wx.getStorageSync('date')
                })) {
                this.setData({
                  hebdomadActive: wx.getStorageSync('date'),
                })
              } else {
                wx.setStorageSync('date', arr[index].date)
                this.setData({
                  hebdomadActive: arr[index].date,
                })
              }
            } else {
              wx.setStorageSync('date', arr[index].date)
              this.setData({
                hebdomadActive: arr[index].date,
              })
            }
            this.setData({
              state: arr[index].state,
              istoday: arr[index].isCurrent,
            })
            for (let i = index + 1; i < arr.length; i++) {
              arr[i].state = 2
            }
          }
        }
        this.setData({
          hebdomad: arr
        })
        this.getStatisticsInfo()
        this.getTrainingDaily()
      } else {
        this.getplanList()
      }
    })
  },
  getplanList() {
    let data = {
      pageNum: 1,
      pageSize: 9999,
    }
    api.planList(data).then(res => {
      console.log(res)
      let isShowModel = 1;
      if (res.code === 200) {
        if (res.data.length) {
          let data = res.data.data.filter(item => item.interventionOrderStatus === "UN_START");
          console.log(data)
          if (data.length) {
            // //新增页面点击跳转到干预方案页面
            // wx.navigateTo({
            //   url: '/page/train/index',
            // })
            isShowModel = 2
          }
        }
      }
      this.setData({
        isShowModel: isShowModel
      })
    })
  },
  //没有干预方案点击跳转服务产品列表页购买
  goService() {
    wx.navigateTo({
      url: '/packageHome/pages/serve/index?type=tc',
    })
    // wx.navigateTo({
    //   url: '/packageHome/pages/serve/index',
    // })
  },
  goPlanList() {
    wx.navigateTo({
      url: '/page/train/index',
    })
  },
  hebdomad(e) {
    if (e.currentTarget.dataset.state != 2) {
      wx.setStorageSync('date', e.currentTarget.dataset.date)
      this.setData({
        hebdomadActive: e.currentTarget.dataset.date,
        state: e.currentTarget.dataset.state,
        istoday: e.currentTarget.dataset.istoday,
      })
      this.getStatisticsInfo()
      this.getTrainingDaily()
    }
  },
  goperfect() {
    wx.navigateTo({
      url: '/page/my/infoEdit/index?str=5',
    })
    this.setData({
      dialog: false
    })
  },
  init() {
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      const option = {
        angleAxis: {
          // 起始角度，180 也可以是 225
          startAngle: 205,
          max: 360,
          clockwise: true, // 逆时针
          // 隐藏刻度线
          show: false
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false

          },
          axisTick: {
            show: false
          }
        },
        polar: {
          center: ['50%', '50%'],
          radius: '180%', //图形大小
        },
        series: [{
            type: 'bar',
            z: 2,
            // 数值
            data: [this.data.three.gameNum / this.data.three.gameTotalNum * 230],
            showBackground: true,
            backgroundStyle: {
              color: 'transparent'
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              normal: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0,
                  color: '#3E76F5'
                }, {
                  offset: 1,
                  color: '#3E76F5'
                }]),
                // shadowBlur: 5,
                // shadowColor: '#2A95F9'
              }
            }
          },
          {
            type: 'bar',
            z: 1,
            // 需要的圆环跨度大小，可以是180,270等
            data: [230],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              normal: {
                opacity: 1,
                color: '#F5F6FA'
              }
            }
          },
        ],

      };
      setOption(chart, option);

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
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    if (wx.getStorageSync('token') != '') {
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then(res => {
        if (res.code == 200) {
          if (res.data != null) {
            this.setData({
              dialog: false
            })
            this.getClockInList()
          } else {
            this.setData({
              dialog: true
            })
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'error',
            duration: 1500
          })
        }
      })
    } else {
      wx.reLaunch({
        url: '/page/login/start/index?pageUrl=/page/brain/index&str=5',
      })
    }
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