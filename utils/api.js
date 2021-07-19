/*
 * UniApp Wordpress 小程序
 * author: XiaoSaGe
 * 开源协议：MIT
 * Copyright (c) 2021 https://uni.supertyler.com
 */

import Config from "./config.js";

const BASE_URL = `https://${Config.HOST_DOMAIN}`;
const WORDPRESS_REST_API_URL = `${BASE_URL}/wp-json/wp/v2`;
const PLUGIN_REST_API_URL = `${BASE_URL}/wp-json/watch-life-net/v1`;
const JWT_REST_API_URL = `${BASE_URL}/wp-json/jwt-auth/v1`;



// 配置文件，首页幻灯与导航
const HOME_CONFIG_URL = `${PLUGIN_REST_API_URL}/options/homeconfig`;



/* 文章类API*/

// 获取文章列表
const ARTICLE_LIST_URL = `${PLUGIN_REST_API_URL}/posts`;
// 获取评论热门
const HOT_COMMENT_POST_URL = `${PLUGIN_REST_API_URL}/post/hotpostthisyear`;
// 获取浏览热门
const HOT_VIEW_POST_URL = `${PLUGIN_REST_API_URL}/post/pageviewsthisyear`;
// 获取点赞热门
const HOT_LIKE_POST_URL = `${PLUGIN_REST_API_URL}/post/likethisyear`;
// 获取文章详情
const POST_DETAIL_URL = `${PLUGIN_REST_API_URL}/posts`;
// 点赞
const POST_LIKE_URL = `${PLUGIN_REST_API_URL}/post/like`;
// 获取我的点赞
const GET_MY_LIKE_URL = `${PLUGIN_REST_API_URL}/post/mylike`;
// 获取文章标签
const POST_TAG_URL = `${WORDPRESS_REST_API_URL}/tags`;
// 获取页面
const PAGE_DETAIL_URL = `${WORDPRESS_REST_API_URL}/pages`;


/* 分类 API */

// 显示分类的ID
const DISPLAY_CATEGORY_IDS_URL = `${PLUGIN_REST_API_URL}/category/ids`;
// 获取分类列表
const CATEGORY_URL = `${WORDPRESS_REST_API_URL}/categories`;
// 获取分类元信息
const CATEGORY_META_URL = `${WORDPRESS_REST_API_URL}/categories`;



/* 评论类API*/

// 获取我的评论
const COMMENTS_URL = `${WORDPRESS_REST_API_URL}/comments`;
// 获取某篇文章的评论
const POST_COMMENT_URL = `${PLUGIN_REST_API_URL}/comment/getcomments`;
// 添加我的评论
const POST_MY_COMMENTS_URL = `${PLUGIN_REST_API_URL}/comment/add`;
// 获取我的评论
const GET_MY_COMMENTS_URL = `${PLUGIN_REST_API_URL}/comment/get`;
// 删除我的评论
const DELETE_MY_COMMENTS_URL = `${PLUGIN_REST_API_URL}/comment/delete`;



/* 登录类API*/

// 微信用户登录
const WECHAT_USER_LOGIN = `${PLUGIN_REST_API_URL}/weixin/userlogin`;
// QQ小程序用户登录
const QQ_MINIAPP_USER_LOGIN = `${PLUGIN_REST_API_URL}/qq/miniAppLogin`;
// QQAPP用户登录
const QQ_APP_USER_LOGIN = `${PLUGIN_REST_API_URL}/qq/appLogin`;
// JWT登录
const JWT_TOKEN_URL = `${JWT_REST_API_URL}/token`;
// JWT验证Token
const JWT_VALIDATE_URL = `${JWT_REST_API_URL}/token/validate`;
// 获取用户信息
const USER_INFO_URL = `${WORDPRESS_REST_API_URL}/users/me`;

export {
	HOME_CONFIG_URL,
	DISPLAY_CATEGORY_IDS_URL,
	ARTICLE_LIST_URL,
	CATEGORY_URL,
	HOT_COMMENT_POST_URL,
	HOT_VIEW_POST_URL,
	HOT_LIKE_POST_URL,
	POST_DETAIL_URL,
	POST_TAG_URL,
	POST_COMMENT_URL,
	WECHAT_USER_LOGIN,
	QQ_MINIAPP_USER_LOGIN,
	QQ_APP_USER_LOGIN,
	POST_LIKE_URL,
	JWT_TOKEN_URL,
	JWT_VALIDATE_URL,
	USER_INFO_URL,
	CATEGORY_META_URL,
	COMMENTS_URL,
	POST_MY_COMMENTS_URL,
	GET_MY_COMMENTS_URL,
	DELETE_MY_COMMENTS_URL,
	GET_MY_LIKE_URL,
	PAGE_DETAIL_URL
};
