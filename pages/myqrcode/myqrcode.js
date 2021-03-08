// pages/myqrcode/myqrcode.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasH: 450,
    canvasW: '',
    height: '',
    width: '',
    pictureUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
      width: wx.getSystemInfoSync().windowWidth,
      canvasW: wx.getSystemInfoSync().windowWidth  - 20,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    util.getQrCodeToCanvas('欢迎加入小程序开发～').then(qrUrl=> {
      // 创建画布
      const ctx = wx.createCanvasContext('canvas')
      ctx.rect(0, 0, this.data.width, this.data.height)
      ctx.fill()
      ctx.draw(true)
      ctx.rect(20, 100, this.data.width - 40, this.data.height - 200)
      ctx.setFillStyle('white')
      ctx.fill()
      ctx.draw(true)
      ctx.setFontSize(18)
      ctx.setFillStyle('black')
      ctx.fillText('吃肉长肉肉', 130, 155)
      ctx.setFontSize(14)
      ctx.setFillStyle('#636363')
      ctx.fillText('湖南 长沙', 130, 180)
      ctx.draw(true)
      ctx.setFontSize(14)
      ctx.setFillStyle('#636363')
      ctx.fillText('扫一扫上面的二维码图案，加我微信', 70, this.data.height - 120)
      ctx.draw(true)
      ctx.drawImage('../../lib/bg.jpg', 40, 120, 80, 80)
      ctx.drawImage(qrUrl, 50, 215, this.data.width - 110, this.data.height - 360)
      ctx.draw(true, ()=>{
        let that = this;
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: that.data.canvasW,
          height: that.data.canvasH,
          destWidth: that.data.canvasW * 2,
          destHeight: that.data.canvasH * 2,
          canvasId: 'canvas',
          success(res) {
            that.setData({
              pictureUrl:  res.tempFilePath, //仅为示例，并非真实的资源
            })
          }
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})