// pages/qrCode/qrcode.js
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    qrcodeURL: ''
  },
  // 获取输入值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 生成二维码url
  bindToQrCode() {
    util.getQrCodeToCanvas(this.data.inputValue).then(url=> {
      console.log('图片', url)
      this.setData({
        qrcodeURL: url
      })
    })
  },

  savePicture() {
    util.uploadImg(this.data.qrcodeURL)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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