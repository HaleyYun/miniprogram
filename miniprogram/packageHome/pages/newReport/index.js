const app = getApp()

const api = require('../../../http/api.js');
import {
  rpxToPx
} from "../../../util/px-rpx"
import {
  getReportList,
  getBhiHistorys,
  getReportTab
} from "../../../http/api"
Page({
  data: {
    outBtntop: 0,
    isLoading: false, //下拉刷新
    isShow: false,
    nowTime: '', //获取当前时间
    acquiesce: '',
    gameNum: '', //档案编号
    ossImg: app.globalData.ossImgUrl,
    typeList: [],
    adRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg14.png',
      2: app.globalData.ossImgUrl + 'scale-bg50.png',
    },
    defaultLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + "scale-bg14.png",
      2: app.globalData.ossImgUrl + "njk-di.png",
      3: app.globalData.ossImgUrl + "njk-zhong.png",
      4: app.globalData.ossImgUrl + "njk-gao.png",
    },
    riskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg14.png',
      2: app.globalData.ossImgUrl + 'scale-bg7.png',
      3: app.globalData.ossImgUrl + 'scale-bg9.png',
      4: app.globalData.ossImgUrl + 'scale-bg10.png',
    },
    hAMAriskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + "bgactive1.png",
      2: app.globalData.ossImgUrl + "jlactive2.png",
      3: app.globalData.ossImgUrl + "jlactive3.png",
      4: app.globalData.ossImgUrl + "jlactive4.png",
    },
    hAMDriskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + "scale-bg14.png",
      2: app.globalData.ossImgUrl + "scale-bg53.png",
      3: app.globalData.ossImgUrl + "scale-bg1.png",
      4: app.globalData.ossImgUrl + "scale-bg3.png",
    },
    aDLriskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'bgactive1.png',
      2: app.globalData.ossImgUrl + 'shactive2.png',
      3: app.globalData.ossImgUrl + 'shactive3.png'
    },
    jlRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'bgactive1.png',
      2: app.globalData.ossImgUrl + 'knjlactive2.png',
      3: app.globalData.ossImgUrl + 'kdjlactive3.png'
    },
    yyRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'bgactive1.png',
      2: app.globalData.ossImgUrl + 'knyyactive2.png',
      3: app.globalData.ossImgUrl + 'kdyyactive3.png'
    },
    fAQRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg14.png',
      2: app.globalData.ossImgUrl + 'scale-bg7.png',
    },
    pHQRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg55.png',
      2: app.globalData.ossImgUrl + 'scale-bg53.png',
      3: app.globalData.ossImgUrl + 'scale-bg1.png',
      4: app.globalData.ossImgUrl + 'scale-bg2.png',
      5: app.globalData.ossImgUrl + 'scale-bg3.png',
    },
    gADRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg4.png',
      2: app.globalData.ossImgUrl + 'scale-bg5.png',
      3: app.globalData.ossImgUrl + 'scale-bg6.png',
      4: app.globalData.ossImgUrl + 'scale-bg8.png',
    },
    nPIRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg14.png',
      2: app.globalData.ossImgUrl + 'scale-bg51.png',
    },
    miniCogRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg14.png',
      2: app.globalData.ossImgUrl + 'scale-bg50.png',
      3: app.globalData.ossImgUrl + 'scale-bg54.png',
    },
    cFTRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg14.png',
      2: app.globalData.ossImgUrl + 'scale-bg56.png',
    },
    nINDSCSNRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg14.png',
      2: app.globalData.ossImgUrl + 'scale-bg48.png',
    },
    dSRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg14.png',
      2: app.globalData.ossImgUrl + 'scale-bg52.png',
    },
    imgBhiBg: "",
    data: {},
    dataList: [],
    pageNum: 1,
    pageSize: 10,
    riskLabelList: []
  },

  onLoad(options) {
    console.log(options, 'options');
    if (options.long) {
      console.log('0000');
      this.setData({
        acquiesce: '',
      })
    } else {
      this.setData({
        acquiesce: app.globalData.select,
      })
    }
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    let outBtntop = menuButtonInfo.top + (menuButtonInfo.height - rpxToPx(40)) / 2;
    this.setData({
      outBtntop
    })
    this.getTab()
    this.getTime()
    this.getReport()
    this.getBhiList()
  },
  getTime() {
    var mytime = new Date().toTimeString().substring(0, 8); //获取当前时间
    console.log(mytime, 'mytime');
    if (mytime >= '05:00:00' && mytime <= '07:59:59') {
 
      this.setData({
        nowTime: '早上好~'
      })
    } else if (mytime >= '08:00:00' && mytime <= '11:59:59') {
      this.setData({
        nowTime: '上午好~'
      })
    } else if (mytime >= '12:00:00' && mytime <= '17:59:59') {
      this.setData({
        nowTime: '下午好~'
      })
    } else if (mytime >= '18:00:00' || mytime <= '04:59:59') {
      console.log(mytime,'baiyun');
      this.setData({
        nowTime: '晚上好~'
      })
    }else{
      console.log(mytime >= '18:00:00','mytimemytimemytimemytime');
      console.log(mytime >= '04:59:59','mytimemytimemytimemytime');
      // this.setData({
      //   nowTime: '晚上好~'
      // })
    }
  },
  getReport() {
    let data = {}
    // archivesNo: 'DA20230902001346280155006',
    // source: "Mini"确定不传

    getReportList(data).then(res => {
      if (res.code === 200) {
        this.setData({
          data: res.data,
        })
      }
    })
  },
  //tab
  getTab() {
    api.getReportTab({
      dictType: 'estimate_area'
    }).then(res => {
      let arr = res.data
      arr.unshift({
        dictLabel: "全部",
        dictValue: ""
      })
      this.setData({
        typeList: arr
      })
    })
  },
  // tab切换
  tabToggle(e) {
    this.setData({
      acquiesce: e.currentTarget.dataset.value,
      pageNum: 1,
      pageSize: 10,
      dataList: [],
      overList:[],
      isShow:false
    })
    this.getBhiList()
    // let res = this.data.newList.filter(item => item.id == this.data.id)
    // let arr = this.data.serveList.concat(res[0].productList)
    // this.setData({
    //   serveList:arr
    // })
  },
  getBhiList() {
    this.setData({
      isLoading: true
    })
    let data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      source: "Mini",
      searchKey: '',
      estimateArea: this.data.acquiesce
    }
    getBhiHistorys(data).then(res => {

      if (res.code === 200) {
        let data = res.data.data;
        // 标签list

        let dataItem = []
        data.forEach(item => {
          console.log(item, 'item');
          if (item.riskLabel >= 0 && item.riskLabel2 < 0 && item.riskLabel3 < 0) {
            dataItem = [{
              name: '标签',
              riskLabel: item.riskLabel,
            }]
            //  this.setData({
            //   riskLabelList:data
            //  }) 
            item.riskLabelList = dataItem
          } else if (item.riskLabel >= 0 && item.riskLabel2 >= 0 && item.riskLabel3 < 0) {
            if (item.estimateServeCode === "HADS") {
              dataItem = [{
                  name: '焦虑标签',
                  riskLabel: item.riskLabel,
                },
                {
                  name: '抑郁标签',
                  riskLabel: item.riskLabel2,
                },
              ]
            } else {
              dataItem = [{
                  name: '顺背标签',
                  riskLabel: item.riskLabel,
                },
                {
                  name: '倒背标签',
                  riskLabel: item.riskLabel2,
                },
              ]
            }
            // this.setData({
            //   riskLabelList:data
            //  }) 
            item.riskLabelList = dataItem
          } else if (item.riskLabel >= 0 && item.riskLabel2 >= 0 && item.riskLabel3 >= 0) {
            dataItem = [{
                name: '复制图案标签',
                riskLabel: item.riskLabel,
              },
              {
                name: '即刻回忆标签',
                riskLabel: item.riskLabel2,
              },
              {
                name: '延迟回忆标签',
                riskLabel: item.riskLabel3,
              },
            ]
            // this.setData({
            //   riskLabelList:data
            //  }) 
            item.riskLabelList = dataItem
          }
        });
        if (this.data.isShow) {
          console.log('下拉');
          this.setData({
            overList: data
          })
        } else {
          console.log('qweqweqweq');
          let arr = this.data.dataList.concat(data)
          this.setData({
            dataList: arr
          })
        }

      }
      this.setData({
        isLoading: false,

      })
    })
  },

  toBhiInfo() {
    wx.navigateTo({
      url: '../../pages/bhiInfo/index'
    })
  },
  tabClick(e) {
    let data = this.data.data.healthRiskFactors;
    data[e.currentTarget.dataset.index].check = !data[e.currentTarget.dataset.index].check
    this.setData({
      'data.healthRiskFactors': data
    })
    console.log(this.data.data.healthRiskFactors)
  },
  godetails(e) {
    if (wx.getStorageSync('token') != '') {
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then((res) => {
        if (res.code == 200) {
          if (res.data != null) {
            this.setData({
              gameNum: res.data
            })
            //筛查小游戏报告
            wx.navigateTo({
              url: '/packageHome/pages/gameWebview/index?str=Mini' + '&gameNum=' + this.data.gameNum
            })
          }
        }
      })
    }

  },
  goCaide(e) {
    if (wx.getStorageSync('token') != '') {
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then((res) => {
        if (res.code == 200) {
          if (res.data != null) {
            wx.setStorageSync('archivesNo', res.data)
            this.setData({
              distinguish: 12
            })
            app.globalData.which = 0 //从报告解读跳到的cadie
            wx.navigateTo({
              url: '/packageHome/pages/cadie/index?str=' + this.data.distinguish + '&acquiesce=' + this.data.acquiesce
            })
          } else {
            this.setData({
              distinguish: 12,
              addInfoShow: true
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/page/login/phone/index?pageUrl=' + '/packageHome/pages/cadie/index' + '&str=' + 12,
      })
    }
  },
  //电话咨询
  call(e) {
    wx.makePhoneCall({
      phoneNumber: '4000125600'
    })
  },
  goReport(e) {
    let {
      item,
      index
    } = e.currentTarget.dataset
    console.log(index)
    console.log(item.estimateServeCode)
    let pathEnum = {
      'SMALL-GAME': "/packageHome/pages/gameWebview/index?orderNum=" + item.estimateNum,
      'EDB-AD-LIET': "/packageHome/pages/gameWebview/index?yan=" + item.estimateNum,
      'AD-8': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'AD-8-LIET': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'EDB-AD': "/packageHome/pages/gameWebview/index?estimate=" + item.estimateNum,
      'MoCA': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'MMSE': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'HAMA': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'HAMD-24': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'ADL': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'HADS': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'FAQ': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'PHQ-9': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'GAD-7': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'NPI-Q': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'Mini-cog': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'CFT': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'NINDS-CSN': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'DS': "/packageHome/pages/gameWebview/index?estimateNums=" + item.estimateNum,
      'YY0001': "/packageHome/pages/gameWebview/index?depressed=" + item.estimateNum,
    }
    if (index == 2 && item.estimateServeCode == "EDB-AD-LIET") {
      // 跳转眼动小游戏
      app.globalData.eyeGamesData = item;
      app.globalData.eyeGamesType = 2;
      app.globalData.eyeGamesData.estimateOrderType = null;
      console.log(app.globalData.eyeGamesType,'00000');
      wx.navigateTo({
        url: '../../../eyesGema/pages/index/index',
      })
      return
    }
    console.log(pathEnum[item.estimateServeCode], 'dssdsd')
    wx.navigateTo({
      url: pathEnum[item.estimateServeCode],
    })
  },
  onReachBottom() {
    console.log('上划加载');
    this.setData({
      pageNum: this.data.pageNum + 1,
      isShow: false
    })

    this.getBhiList()

  },
  // 搜索
  search() {
    wx.navigateTo({
      url: '/packageHome/pages/reportSearch/index?acquiesce=' + this.data.acquiesce
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log("触发下拉");
    this.setData({
      pageNum: 1,
      isShow: true
    })

    this.getBhiList()
    this.getReport()
    wx.stopPullDownRefresh()
  },

  outPage() {
    wx.switchTab({
      url: '/page/home/index',
    })
   
  },

})