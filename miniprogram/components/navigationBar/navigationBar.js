Component({
  properties: {
    // defaultData（父页面传递的数据-就是引用组件的页面）
    title: String,
  },
  options: {
    multipleSlots: true
  },
  data: {
    navBarHeight: 0,
    menuRight: 0,
    menuBotton: 0,
    menuHeight: 0,
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
    })
  },
  methods: {}
})