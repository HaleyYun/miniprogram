const app = getApp()
const api = require('../../../http/api')
const util = require('../../../util/util')
import Toast from 'vant-weapp/toast/toast';

Page({
  data: {
    isFailure: false, //生成失败展示
    isSuccessful:false,//生成成功展示
    isShowicon: false,
    ossImg: app.globalData.ossImgUrl,
    xians: app.globalData.ossImgUrl + 'hexiao-lanjiao.png',
    xianx: app.globalData.ossImgUrl + 'hexiao-lvjiao.png',
    tabList: [{
        id: 3,
        option: '全部'
      },
      {
        id: 0,
        option: '已核销'
      },
      {
        id: 1,
        option: '使用中'
      },
      {
        id: 2,
        option: '已完成'
      }
    ],
    tab: 3,
    state: true,
    pageNum: 1,
    pageSize: 10,
    isEnd: false, // 是否到达最后一页
    equity: '',
    activatedUrl: app.globalData.ossImgUrl + 'activated.png',
    usedUrl: app.globalData.ossImgUrl + 'used.png',
    defunctUrl: app.globalData.ossImgUrl + 'defunct.png',
    setMeal: [],
    archivesNo: '',
    phone: '',
    employeeId: 0,
    equityId: 0,
    addInfoShow: false,
    doctor: false, //列表无数据
    loadStatus: '', //loading-加载中,noData-无数据,failure-加载失败,
    schedule: 0, //加载中进度
    isShowModel: false,
    equityName: '',
    isSupport:false
  },
  onLoad(options) {
    if(options.backLose){
      let that = this
      that.setData({
        isSupport: true,
        checkService:app.globalData.checkService
      })
      that.data.timer = setTimeout(function () {
        that.setData({
          isSupport: false,
        })
      }, 5000)
    }

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log(scene, '这是二维码扫描参数')
      let sceneParams = {};
      sceneParams = this.parseScene(scene);
      app.globalData.sceneParams = sceneParams;
      wx.setStorageSync('isScan', sceneParams.isScan)
      console.log(app.globalData.sceneParams)
      this.setData({
        equityId: sceneParams.code,
        employeeId: sceneParams.userId,
        isScan: sceneParams.isScan
      })
    }
    if (options.jlqy === '') {
      wx.setStorageSync('jlqy', 'jlqy')
    }
  },
  onShow() {
    this.setData({
      state: true,
      pageNum: 1,
      equity: '',
      setMeal: [],
    })
    this.isCheckArch()
  },
  onBackPress: function (options) {
    console.log(options, '000000000000000000000000000000');
    // 可以在这里编写返回按钮的处理逻辑
    // 返回 `true` 时，表示阻止默认的返回行为
    // 返回 `false` 时，表示不阻止默认的返回行为
    if (options.from === 'navigateBack') {
      // 来自页面的返回按钮
      // 在这里处理你的逻辑
      console.log('返回按钮被触发，来自页面返回按钮');
      // 返回 `true` 阻止默认行为，返回 `false` 不阻止
      return false;
    }
    // 其他返回触发条件可以在这里判断
    return false;
  },

  // 获取列表
  getPageQuery() {
    api.pageQuery({
      status: this.data.tab,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(res => {
      if (res.code == 200) {
        const newData = res.data.data;
        console.log(newData.length)
        if (!newData.length) {
          console.log('aaaaaaaaaaaaaaaaaa')
          // 如果返回结果为空，表示已到达最后一页
          this.setData({
            isEnd: true,
            loadStatus: 'noData',
          });
        } else {
          // 如果返回结果不为空，则追加到已有数据中
          const arr = this.data.setMeal.concat(newData);
          this.setData({
            setMeal: arr,
            pageNum: this.data.pageNum + 1,
          });
        }
        wx.hideLoading()
      } else {
        this.setData({
          loadStatus: 'failure',
          setMeal: []
        })
      }
    })
  },
  loadMore() {
    // 加载更多数据，触发下一页查询
    if (!this.data.isEnd) {
      this.getPageQuery();
    }
  },
  //立即使用
  use: util.debounce(function (e) {
    console.log(e.currentTarget.dataset, 'e.currentTarget.dataset.item');
    //isOnlyIntervention  true是纯干预//纯干预
    //serviceComplete     true可以做筛查// 筛查间隔时间
    console.log(e)
    let item = e.currentTarget.dataset.item;
    console.log(item.ticketsBookingCode,'item.ticketsBookingCode');
    api.checkInterTime({
      ticketCode: item.ticketsEquityCode
    }).then(res => {
      console.log(res)
      this.setData({
        isShowicon: true,
      })
      if (res.code === 200) {
        this.setData({
          isShowicon: false,
        })
        // 干预是否生成报告
        if (res.data.isOnlyIntervention) {
          let that = this;
          that.setData({
            isSuccessful: true,
          })
          // wx.showModal({
          //   title: '提示',
          //   content: '当前已为您生成干预方案，干预周期为：' + res.data.interventionBeginTime + "至" + res.data.interventionEndTime,
          //   cancelText: '去训练',
          //   success(res) {
          //     if (res.confirm) {
          //       console.log('用户点击确定')
          //       that.setData({
          //         pageNum: 1,
          //         tab: 3,
          //         setMeal: [],
          //         equity: '',
          //       })
          //       that.getPageQuery()
          //     } else if (res.cancel) {
          //       wx.switchTab({
          //         url: '/page/brain/index'
          //       })
          //     }
          //   }
          // })
        }
        if (res.data.serviceComplete) {
          if (item.status === 0 || item.status === 1) {
            if (item.checkService) {
              console.log(e, '8333')
              if (item.checkService === "EDB-AD-LIET") {
                if (item.status == 0 || item.status == 1) {
                  app.globalData.eyeGamesData = item;
                  wx.setStorageSync('ticketsEquityCode', e.currentTarget.dataset.item.ticketsBookingCode || e.currentTarget.dataset.item.ticketsEquityCode)
                  wx.setStorageSync('strCode', 'EquityCode')
                  app.globalData.eyeGamesData.estimateOrderType = null;
                  wx.navigateTo({
                    url: '../../../eyesGema/pages/index/index',
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: '状态不可用',
                    duration: 3000,
                  });
                }
              } else if (item.checkService === "SMALL-GAME") {
                if (item.status == 0 || item.status == 1) {
                  app.globalData.gamesDatas = {
                    estimateServeCode: item.checkService,
                    estimateServeName: item.checkServiceName,
                    customPhone: item.phone,
                    customName: item.clientName,
                    orderNum: '',
                    ticketsEquityCode: item.ticketsBookingCode || item.ticketsEquityCode,
                  }
                  console.log(JSON.stringify({
                    estimateServeCode: item.checkService,
                    estimateServeName: item.checkServiceName,
                    customPhone: item.phone,
                    customName: item.clientName,
                    orderNum: '',
                    ticketsEquityCode: item.ticketsBookingCode || item.ticketsEquityCode,
                  }) + '缓存数据111')
                  wx.setStorageSync('ticketsEquityCode', e.currentTarget.dataset.item.ticketsBookingCode || e.currentTarget.dataset.item.ticketsEquityCode)
                  wx.setStorageSync('strCode', 'EquityCode')
                  app.globalData.gamesDatas.estimateOrderType = null;;
                  wx.navigateTo({
                    url: '/packageHome/pages/gameSku/testHome/index',
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: '状态不可用',
                    duration: 3000,
                  });
                }
              } else if (item.checkService === "AD-8-LIET") {
                console.log(item.status,'item.status');
                if (item.status == 0||item.status == 1) {
                  console.log(item,'item');
                  // return false
                  // app.globalData.serverInfo = item;
                  app.globalData.serverInfo = {
                    ticketsBookingCode: item.ticketsBookingCode || item.ticketsEquityCode,
                    clientId:item.archivesNo,
                    clientName:item.clientName,
                    phone:item.phone,
                    estimateNum:'',
                    checkService:item.checkService,
                    status:'',
                  }
                  wx.redirectTo({
                    url: '../../../packageScale/pages/ad8Index/index?outBack=0',
                  })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: '状态不可用',
                    duration: 3000,
                  });
                }
              }
            }else{
              wx.navigateTo({
                url: '/packageHome/pages/equityList/index?code=' + item.ticketsEquityCode,
              })
            }
           
          } else {
            //详情
            wx.navigateTo({
              url: '/packageHome/pages/equityDetails/index?code=' + item.ticketsEquityCode + '&type=3',
            })
          }
        } else {
          if (!res.data.isOnlyIntervention) {
            wx.showToast({
              icon: 'none',
              title: '筛查间隔不足',
              duration: 3000,
            });
          }
        }
      } else if (res.code == 2049) {
        this.setData({
          isShowicon: false,
        })
        wx.showToast({
          icon: 'none',
          title: '请至少完成一次脑健康筛查后~',
          duration: 5000,
        });
      } else {
        this.setData({
          isShowicon: false,
        })
        wx.showToast({
          icon: 'none',
          title: res.msg,
          duration: 3000,
        });
      }
    })
  }, 500),
  confirm() {
    this.setData({
      isSuccessful: false,
      pageNum: 1,
      tab: 3,
      setMeal: [],
      equity: '',
    })
    this.getPageQuery()
  },
  cancel() {
    wx.switchTab({
      url: '/page/brain/index'
    })
  },

  // 我已知晓
  commits() {
    this.setData({
      isShowModel: false
    })
  },
  // 查看
  check(e) {
    let {
      item
    } = e.currentTarget.dataset
    if (this.data.archivesNo == '' || this.data.archivesNo == null) {
      this.setData({
        addInfoShow: true
      })
    } else {
      wx.navigateTo({
        url: '/packageHome/pages/equityDetails/index?code=' + item.ticketsEquityCode + '&type=3',
      })
    }
  },
  // tab切换
  tab: util.debounce(function (id) {
    this.setData({
      pageNum: 1,
      setMeal: [],
      isEnd: false,
      tab: id.currentTarget.dataset.id,
    })
    this.getPageQuery()
  }, 400),
  // 兑换
  exchange() {
    if (this.data.archivesNo == '' || this.data.archivesNo == null) {
      this.setData({
        addInfoShow: true
      })
    } else {
      if (this.data.equity == '') {
        Toast('兑换失败，激活码不能为空~');
      } else {
        this.setData({
          isShowicon: true,
        })
        api.equityExchange({
          activeCode: this.data.equity,
          clientName: wx.getStorageSync('userName'),
          archivesNo: wx.getStorageSync('archivesNo'),
          phone: wx.getStorageSync('phone'),
        }).then(res => {
          if (res.code == 200) {
            this.setData({
              isShowicon: false,
            })
            // Toast('兑换成功');
            this.setData({
              equityName: res.data,
              isShowModel: true,
              pageNum: 1,
              tab: 0,
              setMeal: [],
              equity: '',
            })
            this.getPageQuery()
          } else {
            this.setData({
              isShowicon: false,
            })
            wx.showToast({
              icon: 'none',
              title: res.msg,
              duration: 3000,
            });
          }
        })
      }
    }
  },
  changePage() {
    this.setData({
      isFailure: false,
    })
  },
  nextPage(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  // 取消
  deleteinfo() {
    this.setData({
      addInfoShow: false
    })
  },
  // 建档
  toAddinfo() {
    this.setData({
      addInfoShow: false
    })
    wx.navigateTo({
      url: '/page/my/infoEdit/index' + '?str=7'
    })
  },
  EquityExchange(data) {
    console.log(data, '兑换权益参数')
    api.getEquityExchange(data).then((res) => {
      if (res.code === 200) {
        this.setData({
          equityName: res.data,
          isShowModel: true,
        })
        // wx.showToast({
        //   icon: 'none',
        //   title: res.msg,
        //   duration: 5000,
        // });
        app.globalData.sceneParams = {}
        this.getPageQuery()
      } else {
        app.globalData.sceneParams = {}
        wx.showToast({
          icon: 'none',
          title: res.msg,
          duration: 5000,
        });
        this.getPageQuery()
      }
    })
  },
  isCheckArch() {
    // 君龙短信链接可直接进入需判断登录
    if (wx.getStorageSync('token') != '') {
      console.log(wx.getStorageSync('token'), 'token=====')
      // 登录之后判断档案
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then(res => {
        if (res.code == 200 && res.data != null) {
          // 有档案
          this.setData({
            archivesNo: res.data
          })
          console.log(app.globalData.sceneParams, '这是app.sceneParams')
          if (app.globalData.sceneParams.userId && app.globalData.sceneParams.code) {
            let data = {
              archivesNo: res.data,
              employeeId: app.globalData.sceneParams.userId,
              equityId: app.globalData.sceneParams.code,
              phone: wx.getStorageSync('phone'),
            }
            this.EquityExchange(data)
          } else {
            this.getPageQuery()
          }
        } else {
          wx.navigateTo({
            url: '/page/my/infoEdit/index' + '?str=1'
          })
        }
      })
    } else {
      // 没有登录，会直接跳转登录页，需获取登录所需openId
      wx.login({
        success(res) {
          api.getUserInfo({
            code: res.code
          }).then((res) => {
            if (res.data.openId != null) {
              app.globalData.openId = res.data.openId
              wx.setStorageSync("openId", res.data.openId)
              // 跳转登录
              wx.reLaunch({
                url: '/page/login/start/index?pageUrl=/packageHome/pages/interests/index&str=1',
              })
            }
          })
        }
      })
    }
  },
  onReachBottom() {
    this.loadMore()
  },
  parseScene(scene) {
    const sceneParams = {};
    scene.split('&').forEach(param => {
      const [key, value] = param.split('=');
      sceneParams[key] = Number(value);
    });
    console.log(sceneParams.code, '二维码参数解析权益id:code');
    console.log(sceneParams.userId, ':二维码参数解析用户id:userId');
    return sceneParams
  }
})