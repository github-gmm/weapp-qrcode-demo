const QRCode = require("../lib/weapp-qrcode.js");
const drawQrcode = require("../lib/weapp.qrcode.min.js");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 生成二维码
const getQrCode = text => {
  let imgData = QRCode.drawImg(text, {
    typeNumber: 4,          // 密度
    errorCorrectLevel: 'M', // 纠错等级
    size: 500,              // 白色边框
  })
  return imgData
}

// 生成二维码画布
const getQrCodeToCanvas = text => {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.select('#myQrcode').fields({
      node: true,
      size: true
    }).exec((res) => {
      var canvas = res[0].node
      // 调用方法drawQrcode生成二维码
      drawQrcode({
        canvas: canvas,
        canvasId: 'myQrcode',
        width: 75,
        padding: 10,
        background: '#ffffff',
        foreground: '#000000',
        text: text,
      })
      // 获取临时路径（得到之后，想干嘛就干嘛了）
      wx.canvasToTempFilePath({
        canvasId: 'myQrcode',
        canvas: canvas,
        x: 0,
        y: 0,
        width: 75,
        height: 75,
        destWidth: 150,
        destHeight: 150,
        success(res) {
          resolve(res.tempFilePath)
        },
      })
    })
  })
}

// 下载图片
const uploadImg = (filePath) => {
  wx.getSetting({
    success(res) {
      // 授权
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
        })
      } else {
        // 下载图片
        wx.saveImageToPhotosAlbum({
          filePath: filePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
            })
          }
        })
      }
    }
  })
}

module.exports = {
  formatTime,
  getQrCode,
  getQrCodeToCanvas,
  uploadImg
}
