## 项目介绍

本项目以 WordPress RestFul API为基础，实现了一款对接WordPress网站的UniApp，可被编译为 Android APP、iOS APP、微信小程序 和 H5手机网站。项目借鉴了 jianbo 开发的 [微信小程序开源版](https://github.com/iamxjb/winxin-app-watch-life.net) 的部分设计，在UniApp的加持下，使用`Vue`的语法进行了完全重构，因此可以被编译到更多的平台，实现一套代码，多端运行。本套程序额外增加了对 WordPress原生用户系统登录的支持，增加了可扩展性，支持进行二次开发对接任意的WordPress主题。



## 平台兼容性

| Uni-APP | 微信小程序 | QQ小程序 | 百度小程序 | 字节小程序 | 支付宝小程序 | 快应用 |  H5  |
| :-----: | :--------: | :------: | :--------: | :--------: | :----------: | :----: | :--: |
|    √    |     √      |    √     |     ×      |     ×      |      ×       |   ×    |  √   |



## 项目依赖

本套程序需要在 WordPress 集成的 Restful API 的基础上，额外增加自定义API，因此需要额外安装两款 WordPress插件。

- **rest-api-to-miniprogram-enhence**

下载地址：[https://github.com/SuperTylerX/rest-api-to-miniprogram-enhanced](https://github.com/SuperTylerX/rest-api-to-miniprogram-enhanced)

这款插件是在 jianbo 开发的 [rest-api-to-miniprogram](https://github.com/iamxjb/rest-api-to-miniprogram) 插件基础上进行了二次开发，增加了更多自定义API支持。

- **JWT Authentication for WP-API**

下载地址：[https://cn.wordpress.org/plugins/jwt-authentication-for-wp-rest-api](https://cn.wordpress.org/plugins/jwt-authentication-for-wp-rest-api) （也可以从WordPress插件市场内直接下载）

这款插件实现了WordPress JWT 登录，为原生用户登录做支持。

注意：安装完需要对配置文件进行额外设置，具体操作步骤请阅读[官方指导](https://cn.wordpress.org/plugins/jwt-authentication-for-wp-rest-api )，或者搜寻相关配置指引。



## QQ登录特别说明（QQ小程序与APP）

一般来说，用户体系存在`openid`和`unionid`两种用户标识，其中`openid`是同一个小程序、APP、网站下用户的唯一标识，而`unionid`是同一开发者下的所有应用的用户的唯一标识，这意味着使用`unionid`可以让你的网站、APP、小程序共享一套用户体系。

因为QQ的`unionid`非常易于获取 ，所以本程序在QQ登录体系下会优先会使用`unionid`来注册用户。

**注意：**`unionid`默认状态下是暂不可获取的，需要你到[QQ互联](https://connect.qq.com/)去手动点击申请。

**QQ小程序：**使用与QQ小程序相同的开发者身份登录到[QQ互联](https://connect.qq.com/)平台，在 `应用管理` - `小程序`下找到你的小程序，在`应用接口`选项卡中点击申请`unionid`的按钮，即可成功获取。

**APP：**使用与QQ小程序相同的开发者身份登录到[QQ互联](https://connect.qq.com/)平台，并创建一个移动应用，在`应用接口`选项卡中点击申请`unionid`的按钮，即可成功获取。接着去Uniapp程序源码里找到manifest配置文件，在`App模块配置` - `OAuth登录鉴权` - `QQ登录`前打钩，并填入在QQ互联平台刚刚创建的移动应用的appid即可。

**（以上步骤请务必在程序上线前完成）**



## TODO

- 小程序list和评论翻页
- 支持字节跳动小程序
- H5 QQ登录
- 页面分享功能
- 二维码分享功能
- 完善错误处理
- Q&A



## 特别感谢

- [微慕小程序开源版 by jianbo](https://github.com/iamxjb/winxin-app-watch-life.net)
- [WordpPress rest api 定制化插件 by jianbo](https://github.com/iamxjb/rest-api-to-miniprogram)
- [JWT Authentication for WP-API](https://cn.wordpress.org/plugins/jwt-authentication-for-wp-rest-api)
- [uView UI](https://www.uviewui.com/)

