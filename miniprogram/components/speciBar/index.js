const app = getApp()
Component({
  properties: {
    // defaultData（父页面传递的数据-就是引用组件的页面）
    title: String,
    path: String
  },
  options: {
    multipleSlots: true
  },
  data: {
    ossImg: app.globalData.ossImgUrl,
    navBarHeight: 0,
    menuRight: 0,
    menuBotton: 0,
    menuHeight: 0,
    textCenter: 0,
  },
  attached: function () {
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    this.setData({
      navBarHeight: systemInfo.statusBarHeight + 44,
      menuRight: systemInfo.screenWidth - menuButtonInfo.right,
      menuBotton: menuButtonInfo.top - systemInfo.statusBarHeight,
      menuHeight: menuButtonInfo.height,
      textCenter: systemInfo.screenWidth - 66
    })
  },
  methods: {
    goIndex() {
      console.log(this.properties.path)
        wx.redirectTo({
          url: this.properties.path
        })
      }
  }
})