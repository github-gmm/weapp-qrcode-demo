## 微信小程序生成海报

  效果图：
    ![Alt](https://github.com/github-gmm/weapp-qrcode-demo/blob/main/lib/1.png)

### 效果
上面的图片是仿照微信的个人名片生成的海报（比较粗糙，主要是为了快速生成，达到效果），该海报包括：背景图片，文字，二维码等信息。感兴趣的请继续往下看👇 

该demo实现了下面几个功能：
- 动态的二维码
- 动态生成海报
- 可以自定义转发给好友
- 保存海报到图库

### 思路
> 需求说明

项目上准备在现有的小程序（小高）上开发邀请新用户优惠活动功能，邀请成功以后邀请者和被邀请者都可以获取一张折扣券。
1. `生成一张海报分享到朋友和朋友圈`
2. `转发链接给朋友和群聊`

> 吐糟文档和百度

微信开放文档介绍的比较模棱两可，如果从未开发过小程序的刚上手会觉得非常麻烦，基本上需要去百度上看别人介绍的；开发过小程序的也需要不断的去调试里面提供方法，有些写的也是不对的地方有时根本也找不出。

so，大家都会打开百度，博客，去搜资料；搜到了很多大量重复的资料，大海捞针的一个一个看自己需要的。

> 其他文章介绍如何生成海报可以参考

- https://github.com/Pudon/weapp-qrcode-base64
- https://juejin.cn/post/6913802456900042766

### 代码实现
- [x] 难点1：如何生成你想要的二维码？（这里的二维码，我认为的是可以通过扫码跳到自己小程序页面并携带参数的）

- [x] 难点2：如何使用画布，画出你想要的海报？
> 生成二维码

通过weapp.qrcode.js可以生成两种图片格式的文件，一种是base64的二维码，一种是在canvas作画保存在微信临时图片文件的二维码。通过实验比较，第二种更加符合我们的要求，我尝试着把这两种生成的二维码放在一块新的画布上，第一种会提示报错了。

```
二维码生成插件的原理：
    1、定义一块2d的画布 type=2d
    2、获取canvas画布的元素 createSelectorQuery
    3、调用二维码插件的方法 drawQrcode
    4、获取canvas在小程序的临时图片路径 canvasToTempFilePath
```

wxml 画布定义：可视界面不可见，只想拿到图片路径展示

```
<canvas     
    type="2d"     
    style="width: 75px; height: 75px; position: absolute; left: -200px;"     
    id="myQrcode">  
</canvas>
```

封装成公共二维码方法

```
// 引用插件
const drawQrcode = require("../lib/weapp.qrcode.min.js");

// 生成二维码画布
const getQrCodeToCanvas = text => {  
    return new Promise((resolve) => {  
        // 获取画布dom元素
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
```

页面调用

```
bindToQrCode() {
    util.getQrCodeToCanvas(this.data.inputValue).then(url=> {
        console.log('图片', url)
        this.setData({
            qrcodeURL: url
        })
    })
},
```

ps：如果想要生成带有图片的二维码，只需在drawQrcode方法里面加入image属性

```
// 生成二维码画布
const getQrCodeToCanvas = text => {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.select('#myQrcode').fields({
      node: true,
      size: true
    }).exec((res) => {
      var canvas = res[0].node
      // 插入图片
      var img = canvas.createImage();
      img.src = "/lib/bg.jpg"
      img.onload = function () {
        // 调用方法drawQrcode生成二维码
        drawQrcode({
          canvas: canvas,
          canvasId: 'myQrcode',
          width: 150,
          padding: 0,
          marign: 0,
          background: '#ffffff',
          foreground: '#000000',
          text: text,
          // 定义图片的大小
          image: {
            imageResource: img,
            width: 40, // 建议不要设置过大，以免影响扫码
            height: 40, // 建议不要设置过大，以免影响扫码
            round: true // Logo图片是否为圆形
          }
        })
        // 获取临时路径（得到之后，想干嘛就干嘛了）
        wx.canvasToTempFilePath({
          canvasId: 'myQrcode',
          canvas: canvas,
          x: 0,
          y: 0,
          width: 150,
          height: 150,
          destWidth: 300,
          destHeight: 300,
          success(res) {
            resolve(res.tempFilePath)
          },
        })
      }
    })
  })
}
```
> 生成海报

还原上面demo的图片，二维码动态生成，图片是项目里面的

```
流程：从上到下，从左到右
    1、定义画布 canvas-id=canvas
    2、获取动态二维码 getQrCodeToCanvas
    3、获取画布的对象 createCanvasContext (建议使用createSelectorQuery)
    4、把图片，字，二维码放在画布的位置
```

wxml画布定义

```
<canvas canvas-id="canvas"
    style="width: {{width}}px; height: {{height}}px;">
</canvas>
```

调用方法
```
/**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    util.getQrCodeToCanvas('欢迎加入小程序开发～').then(qrUrl=> {
      // 创建画布
      const ctx = wx.createCanvasContext('canvas')
      // 背景黑色
      ctx.rect(0, 0, this.data.width, this.data.height)
      ctx.fill()
      ctx.draw(true)
      // 白色打底
      ctx.rect(20, 100, this.data.width - 40, this.data.height - 200)
      ctx.setFillStyle('white')
      ctx.fill()
      ctx.draw(true)
      // 文字填充
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
      // 用户图片
      ctx.drawImage('../../lib/bg.jpg', 40, 120, 80, 80)
      // 二维码图片
      ctx.drawImage(qrUrl, 50, 215, this.data.width - 110, this.data.height - 360)
      ctx.draw(true, ()=>{
        let that = this;
        // 获取图片路径
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
```


> 文档链接

- [weapp-qrcode-canvas-2d](https://developers.weixin.qq.com/community/develop/article/doc/000e88e73a415835ed9b46d7956013)
- [canvas](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.createCanvasContext.html)
- [转发](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onshareappmessageobject-object)
- [保存照片到图库](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html)

### 总结

1. 如何获取weapp.qrcode.min.js插件？请去gitHub上下载该文件
2. 画布id和你调用方法的参数必须保持一致才能调用
3. 真机调试报错？2d画布只支持预览，不支持真机
4. 为什么不同时生成带有二维码的海报？暂时没找到方法，毕竟二维码的插件也是调用官方的的😭，理解：应该需要改写该插件

