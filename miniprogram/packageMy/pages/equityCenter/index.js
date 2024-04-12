const app = getApp()
const api = require('../../../http/api')
const util = require('../../../util/util')
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    xians: app.globalData.ossImgUrl + 'hexiao-lanjiao.png',
    employeeId: 0,
    state: true,
    pageNum: 1,
    pageSize: 10,
    isEnd: false, // 是否到达最后一页
    setMeal: [],
    equity: '',
    loadStatus: '', //loading-加载中,noData-无数据,failure-加载失败,
    schedule: 0, //加载中进度
  },
  onLoad(options) {
    this.setData({
      employeeId: wx.getStorageSync('employeeId')
    })
    console.log(this.data)
    this.getPageQuery(this.data.equity)
  },
  // changeInput: util.throttle(function (e) {
  //   console.log(e)
  //   if (e.detail.value == '') {
  //   }
  //   this.getPageQuery(e.detail.value)
  // }, 500),
  changeInput(e) {
    console.log(e)
    if (e.detail.value == '') {}
    this.getPageQuery(e.detail.value)
  },
  // 获取列表
  getPageQuery(val) {
    console.log(this.data)
    api.getEquityList({
      employeeId: this.data.employeeId,
      generateType: 3,
      equityName: val,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(res => {
      if (res.code == 200) {
        const newData = res.data.data;
        if (!newData.length) {
          // 如果返回结果为空，表示已到达最后一页
          this.setData({
            isEnd: true,
            setMeal: [],
            loadStatus: 'noData',
          });
        } else {
          // 如果返回结果不为空，则追加到已有数据中
          if (val) {
            if (res.data.totalPage <= 1) {
              this.setData({
                isEnd: true,
                setMeal: newData,
              });
            } else {
              const arr = this.data.setMeal.concat(newData);
              this.setData({
                setMeal: arr,
              });
            }
          } else {
            if (res.data.totalPage <= 1) {
              this.setData({
                isEnd: true,
                setMeal: newData,
              });
            } else {
              if (res.data.pageIndex < res.data.totalPage) {
                const arr = this.data.setMeal.concat(newData);
                this.setData({
                  setMeal: arr,
                  pageNum: this.data.pageNum + 1,
                });
              } else if (res.data.pageIndex == res.data.totalPage) {
                const arr = this.data.setMeal.concat(newData);
                this.setData({
                  isEnd: true,
                  setMeal: arr,
                  pageNum: this.data.pageNum,
                });
              }
            }
          }
        }
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
      this.getPageQuery(this.data.equity);
    }
  },
  use(e) {
    let {
      item
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/packageMy/pages/posterSwiper/index?equityId=' + item.id,
    })
  },
  // 查看
  goDetail(e) {
    let {
      item
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/packageMy/pages/equityCenterDetails/index?id=' + item.id,
    })
  },
  onShow() {
    this.setData({
      state: true,
      pageNum: 1,
      pageSize: 10,
    })
  },
  onReachBottom() {
    this.loadMore()
  },
})