// components/load/load.js
const app = getApp()
Component({
  properties: {
    status: {
      type: String,
      value: 'loading' //loading-加载中,noData-无数据,failure-加载失败
    },
    schedule: {
      type: Number,
      value: 0 //加载中进度
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ossImg: app.globalData.ossImgUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})