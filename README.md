## 项目介绍

本项目以 WordPress RestFul API为基础，实现了一款对接WordPress网站的UniApp，可被编译为 Android APP、iOS APP、微信小程序 和 H5手机网站。项目借鉴了 jianbo 开发的 [微信小程序开源版](https://github.com/iamxjb/winxin-app-watch-life.net) 的部分设计，在UniApp的加持下，使用`Vue 3`的语法进行了完全重构，因此可以被编译到更多的平台，实现一套代码，多端运行。本套程序额外增加了对 WordPress原生用户系统登录的支持，增加了可扩展性，支持进行二次开发对接任意的WordPress主题。



## 平台兼容性

| Uni-APP JSCore |   UniApp X   |     快应用     |       H5       |                  |
| :------------: | :----------: | :------------: | :------------: | :--------------: |
|       √        |      ×       |       ×        |       √        |                  |
| **微信小程序** | **QQ小程序** | **抖音小程序** | **百度小程序** | **支付宝小程序** |
|       √        |      √       |       √        |       √        |        √         |



## 项目依赖

本套程序需要在 WordPress 集成的 Restful API 的基础上，额外增加自定义API，因此需要额外安装两款 WordPress插件。

- **rest-api-to-miniprogram-enhence**

下载地址：[https://github.com/SuperTylerX/rest-api-to-miniprogram-enhanced](https://github.com/SuperTylerX/rest-api-to-miniprogram-enhanced)

这款插件是在 jianbo 开发的 [rest-api-to-miniprogram](https://github.com/iamxjb/rest-api-to-miniprogram) 插件基础上进行了二次开发，增加了更多自定义API支持。

- **JWT Authentication for WP-API**

下载地址：[https://cn.wordpress.org/plugins/jwt-authentication-for-wp-rest-api](https://cn.wordpress.org/plugins/jwt-authentication-for-wp-rest-api) （也可以从WordPress插件市场内直接下载）

这款插件实现了WordPress JWT 登录，为原生用户登录做支持。

注意：安装完需要对配置文件进行额外设置，具体操作步骤请阅读[官方指导](https://cn.wordpress.org/plugins/jwt-authentication-for-wp-rest-api )，或者搜寻相关配置指引。



## 开发

1. 安装

```
pnpm install
```

2. 运行

```
pnpm run dev:mp-weixin
```

`运行成功后，使用微信开发者工具，选择mp-weixin目录并打开（路径：dist/dev/mp-weixin），即可预览。`



## 多环境打包

生产环境打包

```
pnpm run build:mp-weixin
```

打包完成后，使用微信开发者工具，选择mp-weixin目录并打开，目录路径：dist/build/mp-weixin，在微信开发者工具中点击上传即可。



## 代码检查修复

```
# eslint 检查
pnpm run lint:fix
# tsc 检查
pnpm run type:check
```


## Demo

| ![cover](https://tva1.sinaimg.cn/large/006RKGBpgy1gsmd4pcly7j608c08cwep02.jpg) | ![](https://tva1.sinaimg.cn/large/006RKGBpgy1gstazqepndj608c08caaa02.jpg) | ![](https://tva1.sinaimg.cn/large/006RKGBpgy1h9diqcqkatj308c08c0tl.jpg) | <img src="https://tva1.sinaimg.cn/large/006RKGBpgy1h8jyrzftp4j30rs0rsjy6.jpg" style="zoom:30%;" /> |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|                          微信小程序                          |                           QQ小程序                           |                          百度小程序                          |                          头条小程序                          |

| ![](https://tva1.sinaimg.cn/large/006RKGBpgy1gsmd9enffgj608c08c3z502.jpg) | ![](https://tva1.sinaimg.cn/large/006RKGBpgy1h8jz1boxjxj308c08cwf5.jpg) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| H5                                                           | 安卓APP                                                      |



## 交流反馈群

<img src="https://tva1.sinaimg.cn/large/006RKGBpgy1h8jtjasufqj30ep0hqtc5.jpg" alt="cover" style="zoom:50%;" />



## TODO

- 暗黑主题色适配
- 小程序特殊能力适配
- 文章发布管理
- Q&A



## 特别感谢

- 微信小程序开源程序：[微慕小程序开源版](https://github.com/iamxjb/winxin-app-watch-life.net)
- WordPress Restful API增强插件：[WordpPress rest api 定制化插件](https://github.com/iamxjb/rest-api-to-miniprogram)
- WordPress JWT认证插件：[JWT Authentication for WP-API](https://cn.wordpress.org/plugins/jwt-authentication-for-wp-rest-api)
- UniApp UI库：[uView UI](https://www.uviewui.com/)
- Html解析库：[mp-html](https://github.com/jin-yufeng/mp-html)
