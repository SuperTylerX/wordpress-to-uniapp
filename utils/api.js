/*
 * UniApp Wordpress 小程序
 * author: XiaoSaGe
 * 开源协议：MIT
 * Copyright (c) 2021 https://uni.supertyler.com
 */

import Config from "./config.js";

const BASE_URL = `https://${Config.HOST_DOMAIN}`;
const WORDPRESS_REST_API_URL = `${BASE_URL}/wp-json/wp/v2`;
const PLUGIN_REST_API_URL = `${BASE_URL}/wp-json/uni-app-rest-enhanced/v1`;
// const PLUGIN_REST_API_URL = `${BASE_URL}/wp-json/watch-life-net/v1`;
const JWT_REST_API_URL = `${BASE_URL}/wp-json/jwt-auth/v1`;
const PLUGIN_PATH_URL = `${BASE_URL}/wp-content/plugins/rest-api-to-miniprogram-enhanced`;

export const RESIZE_IMG_URL = `${PLUGIN_PATH_URL}/prune.php`;

// 配置文件，首页幻灯与导航
export const HOME_CONFIG_URL = `${PLUGIN_REST_API_URL}/options/homeconfig`;

// 获取微信页面QRCode
export const WEIXIN_QR_CODE_URL = `${PLUGIN_REST_API_URL}/weixin/qrcodeimg`;



/* 文章类API*/

// 获取文章列表
export const ARTICLE_LIST_URL = `${PLUGIN_REST_API_URL}/posts`;
// 获取评论热门
export const HOT_COMMENT_POST_URL = `${PLUGIN_REST_API_URL}/post/hotpostthisyear`;
// 获取浏览热门
export const HOT_VIEW_POST_URL = `${PLUGIN_REST_API_URL}/post/pageviewsthisyear`;
// 获取点赞热门
export const HOT_LIKE_POST_URL = `${PLUGIN_REST_API_URL}/post/likethisyear`;
// 获取文章详情
export const POST_DETAIL_URL = `${PLUGIN_REST_API_URL}/posts`;
// 点赞
export const POST_LIKE_URL = `${PLUGIN_REST_API_URL}/post/like`;
// 获取我的点赞
export const GET_MY_LIKE_URL = `${PLUGIN_REST_API_URL}/post/mylike`;
// 获取文章标签
export const POST_TAG_URL = `${WORDPRESS_REST_API_URL}/tags`;
// 获取页面
export const PAGE_DETAIL_URL = `${WORDPRESS_REST_API_URL}/pages`;


/* 分类 API */

// 显示分类的ID
export const DISPLAY_CATEGORY_IDS_URL = `${PLUGIN_REST_API_URL}/category/ids`;
// 获取分类列表
export const CATEGORY_URL = `${WORDPRESS_REST_API_URL}/categories`;
// 获取分类元信息
export const CATEGORY_META_URL = `${WORDPRESS_REST_API_URL}/categories`;



/* 评论类API*/

// 获取我的评论
export const COMMENTS_URL = `${WORDPRESS_REST_API_URL}/comments`;
// 获取某篇文章的评论
export const POST_COMMENT_URL = `${PLUGIN_REST_API_URL}/comment/getcomments`;
// 添加我的评论
export const POST_MY_COMMENTS_URL = `${PLUGIN_REST_API_URL}/comment/add`;
// 获取我的评论
export const GET_MY_COMMENTS_URL = `${PLUGIN_REST_API_URL}/comment/get`;
// 删除我的评论
export const DELETE_MY_COMMENTS_URL = `${PLUGIN_REST_API_URL}/comment/delete`;



/* 登录类API*/

// 微信用户登录
export const WECHAT_USER_LOGIN = `${PLUGIN_REST_API_URL}/weixin/miniAppLogin`;
// QQ小程序用户登录
export const QQ_MINIAPP_USER_LOGIN = `${PLUGIN_REST_API_URL}/qq/miniAppLogin`;
// 字节跳动小程序用户登录
export const TOUTIAO_MINIAPP_USER_LOGIN = `${PLUGIN_REST_API_URL}/bytedance/miniAppLogin`;
// 百度小程序用户登录
export const BAIDU_MINIAPP_USER_LOGIN = `${PLUGIN_REST_API_URL}/baidu/miniAppLogin`;
// QQAPP用户登录
export const QQ_APP_USER_LOGIN = `${PLUGIN_REST_API_URL}/qq/appLogin`;
// QQH5用户登录
export const QQ_H5_USER_LOGIN = `${PLUGIN_REST_API_URL}/qq/h5Login`;
// JWT登录
export const JWT_TOKEN_URL = `${JWT_REST_API_URL}/token`;
// JWT验证Token
export const JWT_VALIDATE_URL = `${JWT_REST_API_URL}/token/validate`;
// 获取用户信息
export const USER_INFO_URL = `${WORDPRESS_REST_API_URL}/users/me`;
// 用户注册
export const USER_REGISTER = `${PLUGIN_REST_API_URL}/register/submit`;
// 用户重置密码
export const USER_RESET_PASSWORD = `${PLUGIN_REST_API_URL}/register/reset`;
// 更新用户邮箱
export const UPDATE_USER_EMAIL = `${PLUGIN_REST_API_URL}/register/updateEmail`;


/* 安全类API */
// 获取图形验证码
export const GRAPHIC_CAPTCHA_URL = `${PLUGIN_REST_API_URL}/register/getGraphicCaptcha`;
// 获取邮箱验证码
export const EMAIL_CAPTCHA_URL = `${PLUGIN_REST_API_URL}/register/getEmailCaptcha`;


/* 登录类API */
// 扫码获取用户二维码信息
export const QR_INFO_URL = `${PLUGIN_REST_API_URL}/login/getQRInfo`;
// 确认是否二维码登录
export const CONFIRM_QR_LOGIN = `${PLUGIN_REST_API_URL}/login/confirmLogin`;

/* 论坛类API */

// 论坛分类目录
export const FORUMS_CATEGORY_URL = `${PLUGIN_REST_API_URL}/forums`;
// 论坛话题列表
export const FORUMS_LIST_URL = `${PLUGIN_REST_API_URL}/forums/`;
// 论坛详情页面
export const FORUMS_POST_DETAIL_URL = `${PLUGIN_REST_API_URL}/forums/topic/`;
// 论坛评论
export const FORUMS_POST_COMMENT_URL = `${PLUGIN_REST_API_URL}/forums/reply/`;
// 论坛文章点赞
export const FORUMS_POST_LIKE_URL = `${PLUGIN_REST_API_URL}/forums/like`;
// 论坛发表帖子
export const FORUMS_POST_PUBLISH_URL = `${PLUGIN_REST_API_URL}/forums/topic`;

/* 文件上传类API*/

export const MEDIA_URL = `${WORDPRESS_REST_API_URL}/media`;
