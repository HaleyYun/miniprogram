export function checkPermisson(scopeStr) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: async (res) => {
        const authSettingObj = res.authSetting
        if (authSettingObj[scopeStr] === true) {
          // 当前已经有权限了
          console.log('当前已经有权限了', scopeStr)
          return resolve(true)
        } else if (authSettingObj[scopeStr] === false) {
          // 之前问过权限，但是拒绝了
          console.log('之前问过权限，但是拒绝了', scopeStr)
          // 打开setting
          try {
            await openSetting(scopeStr)
            return resolve(true)
          } catch {
            return reject(false)
          }
        } else {
          // 还没问过权限
          console.log('还没问过权限', scopeStr)
          // 去请求授权
          wx.authorize({
            scope: scopeStr,
            success: (res) => {
              return resolve(true)
            },
            fail: async (err) => {
              // 拒绝授权了
              // 打开setting
              try {
                await openSetting(scopeStr)
                return resolve(true)
              } catch {
                return reject(false)
              }
            },
          })
        }
      },
    })
  })
}
export function openSetting(scopeStr) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '温馨提示',
      content: '请授权微信小程序相关权限，以使用更多功能',
      success: (res) => {
        if (res.confirm) {
          wx.openSetting({
            success: function (res) {
              console.log('打开权限设置页面', res)
              const authSettingObj = res.authSetting
              if (scopeStr) {
                // 有指定去获取的权限
                if (authSettingObj[scopeStr] === true) {
                  return resolve(true)
                } else {
                  return reject(false)
                }
              } else {
                // 没有指定去获取的权限
                return resolve(true)
              }
            },
          })
        } else {
          return reject()
        }
      },
      fail: (err) => {
        return reject()
      },
    })
  })
}