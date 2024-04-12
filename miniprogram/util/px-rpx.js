export function rpxToPx(rpx) {
  return rpx / 750 * wx.getSystemInfoSync().windowWidth
}

export function pxToRpx(px) {
  return px * 750 / wx.getSystemInfoSync().windowWidth
}