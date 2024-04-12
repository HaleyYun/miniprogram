const app = getApp()
const api = require('../../../http/api.js')
const util = require('../../../util/util')
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    loadStatus: '', //loading-加载中,noData-无数据,failure-加载失败,
    schedule: 0, //加载中进度
    dataList: [],
    pageNum: 1,
    pageSize: 10,
    isEnd: false, // 是否到达最后一页
    equityId: 0,
    employeeId: 0,
  },
  onLoad(options) {
    this.setData({
      equityId: Number(options.id),
      employeeId: wx.getStorageSync('employeeId')
    })
    this.getList()
  },
  getList() {
    api.getEquityCenterExchange({
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      employeeId: this.data.employeeId,
      equityId: this.data.equityId
    }).then((res) => {
      if (res.code === 200) {
        let newData = res.data.data
        if (!newData.length) {
          // 如果返回结果为空，表示已到达最后一页
          this.setData({
            isEnd: true,
            loadStatus: 'noData',
          });
        } else {
          // 如果返回结果不为空，则追加到已有数据中
          const arr = this.data.dataList.concat(newData);
          this.setData({
            dataList: arr,
            pageNum: this.data.pageNum + 1,
          });
        }
      } else {
        this.setData({
          loadStatus: 'failure',
          dataList: []
        })
      }
    })
  },
  loadMore() {
    // 加载更多数据，触发下一页查询
    if (!this.data.isEnd) {
      this.getList();
    }
  },
  onReachBottom() {
    this.loadMore()
  }
})