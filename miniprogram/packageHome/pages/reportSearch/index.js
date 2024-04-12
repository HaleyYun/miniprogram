const app = getApp()
const api = require('../../../http/api.js');
import {
  getBhiHistorys,
} from "../../../http/api"
Page({
  data: {
    isloading: false, //下拉刷新
    searchValue: '', //搜索内容
    report: '', //tab展示
    notShow: false, //显示
    acquiesce: '',
    ossImg: app.globalData.ossImgUrl,
    typeList: [],
    adRiskLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + 'scale-bg14.png',
      2: app.globalData.ossImgUrl + 'scale-bg50.png',
    },
    defaultLabelImg: {
      0: app.globalData.ossImgUrl + 'scale-bg11.png',
      1: app.globalData.ossImgUrl + "njh-zc.png",
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
    if (options) {
      this.setData({
        report: options.acquiesce
      })
      app.globalData.select = this.data.report
    }
  },


  getBhiList() {
    this.setData({
      isLoading: true
    })
    let data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      source: "Mini",
      estimateArea: this.data.acquiesce,
      searchKey: this.data.searchValue
    }
    getBhiHistorys(data).then(res => {

      if (res.code === 200) {
        console.log(res, 'res');
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
        console.log(data)
        let arr = this.data.dataList.concat(data)
        // riskLabelList
        this.setData({
          dataList: arr,
          isLoading: false,
          notShow: true
        })
      }
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
    //筛查小游戏报告
    wx.navigateTo({
      url: '/packageHome/pages/gameWebview/index?str=Mini'
    })
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
            wx.navigateTo({
              url: '/packageHome/pages/cadie/index?str=' + this.data.distinguish
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
        url: '/page/login/start/index?pageUrl=' + '/packageHome/pages/cadie/index' + '&str=' + 12,
      })
    }
  },
  goReport(e) {
    let {
      item,
      index
    } = e.currentTarget.dataset
    // console.log(index)
    // console.log(item.estimateServeCode)
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
    }
    if (index == 2 && item.estimateServeCode == "EDB-AD-LIET") {
      // 跳转眼动小游戏
      app.globalData.eyeGamesData = item;
      app.globalData.eyeGamesData.estimateOrderType = null;
      wx.navigateTo({
        url: '../../../eyesGema/pages/index/index',
      })
      return
    }
    console.log(pathEnum[item.estimateServeCode])
    wx.navigateTo({
      url: pathEnum[item.estimateServeCode],
    })
  },

  onReachBottom() {
    console.log('上划加载');
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.getBhiList()
  },
  // 搜索
  search() {
    if (this.data.notShow) {
      this.setData({
        notShow: false,
        searchValue: '',
        dataList: [],
      })
    } else {
      this.setData({
        dataList: [],
        pageNum: 1,
      })
      this.getBhiList()
    }

  },
  // 搜索
  int(e) {
    if (e.detail.value == '') {
      this.setData({
        notShow: false,
        searchValue: '',
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // console.log("触发下拉");
    // this.setData({
    //   pageNum: this.data.pageNum
    // })
    // this.getBhiList()
    // wx.stopPullDownRefresh()
  },

})