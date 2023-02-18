/*
 * UniApp Wordpress 小程序
 * Author: SuperTylerX
 * 开源协议：MIT
 * Copyright (c) 2021 https://uni.supertyler.com
 */

import * as unip from "../utils/uniPromisify.js";
import * as API from "../utils/api.js";
import { request } from "@/utils/request.js";


export function getHomeConfig() {
	return unip.request({
		url: API.HOME_CONFIG_URL
	});
}

export function getDisplayCategoryIds() {
	return unip.request({
		url: API.DISPLAY_CATEGORY_IDS_URL
	});
}

export function getArticleList(queryObj) {
	return unip.request({
		url: API.ARTICLE_LIST_URL + uni.$u.queryParams(queryObj)
	});
}

export function getCategory(queryObj) {
	return unip.request({
		url: API.CATEGORY_URL + uni.$u.queryParams(queryObj)
	});
}

export function getHotCommentPosts() {
	return unip.request({
		url: API.HOT_COMMENT_POST_URL
	});
}

export function getHotViewPosts() {
	return unip.request({
		url: API.HOT_VIEW_POST_URL
	});
}

export function getHotLikePosts() {
	return unip.request({
		url: API.HOT_LIKE_POST_URL
	});
}

export function getPostDetail(postId) {
	return unip.request({
		url: API.POST_DETAIL_URL + "/" + postId
	});
}

export function getPostTag(queryObj) {
	return unip.request({
		url: API.POST_TAG_URL + uni.$u.queryParams(queryObj)
	});
}

export function getGuessYouLike(queryObj) {
	return unip.request({
		url: API.ARTICLE_LIST_URL + uni.$u.queryParams(queryObj)
	});
}

export function getComments(queryObj) {
	return unip.request({
		url: API.POST_COMMENT_URL + uni.$u.queryParams(queryObj)
	});
}

// 小程序用户登录
export function wxUserLogin(queryObj) {

	let url = "";
	// #ifdef MP-WEIXIN
	url = API.WECHAT_USER_LOGIN;
	// #endif
	// #ifdef MP-QQ
	url = API.QQ_MINIAPP_USER_LOGIN;
	// #endif
	// #ifdef MP-TOUTIAO
	url = API.TOUTIAO_MINIAPP_USER_LOGIN;
	// #endif
	// #ifdef MP-BAIDU
	url = API.BAIDU_MINIAPP_USER_LOGIN;
	// #endif

	return unip.request({
		url,
		method: "POST",
		data: queryObj
	});
}
// QQ APP用户登录
export function qqAppUserLogin(queryObj) {
	const url = API.QQ_APP_USER_LOGIN;
	return unip.request({
		url,
		method: "POST",
		data: queryObj
	});
}
// QQ H5用户登录
export function qqH5UserLogin(queryObj) {
	const url = API.QQ_H5_USER_LOGIN;
	return unip.request({
		url,
		method: "POST",
		data: queryObj
	});
}

// 点赞
export function postLike(queryObj, token) {
	return unip.request({
		url: API.POST_LIKE_URL,
		method: "POST",
		data: queryObj,
		header: {
			"Authorization": "Bearer " + token,
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
}

// 获取JWT token
export function getJWT(queryObj) {
	return unip.request({
		url: API.JWT_TOKEN_URL,
		method: "POST",
		data: queryObj
	});
}

// 验证JWT
export function validateJWT(token) {
	return unip.request({
		url: API.JWT_VALIDATE_URL,
		method: "POST",
		header: {
			Authorization: "Bearer " + token
		}
	});
}

// 获取用户信息
export function getUserInfo(token) {
	return request({
		url: API.USER_INFO_URL,
		method: "POST",
		header: {
			Authorization: "Bearer " + token
		}
	});
}

// 获取分类元信息
export function getCategoryMeta(categoryID) {
	return unip.request({
		url: API.CATEGORY_META_URL + "/" + categoryID
	});
}

// 获取标签元信息
export function getTagMeta(tagID) {
	return unip.request({
		url: API.POST_TAG_URL + "/" + tagID
	});
}

// 获取评论
export function getMyComments(token) {
	return unip.request({
		url: API.GET_MY_COMMENTS_URL,
		header: {
			Authorization: "Bearer " + token
		}
	});
}

// 提交评论
export function postMyComment(queryObj, token) {
	return request({
		url: API.POST_MY_COMMENTS_URL,
		method: "POST",
		data: queryObj,
		header: {
			"Authorization": "Bearer " + token,
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
}

// 删除评论
export function deleteMyComment(commentId, token) {
	return unip.request({
		url: API.DELETE_MY_COMMENTS_URL,
		method: "DELETE",
		data: {
			commentId
		},
		header: {
			"Authorization": "Bearer " + token,
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
}

// 获取我的点赞评论
export function getLikePosts(token) {
	return unip.request({
		url: API.GET_MY_LIKE_URL,
		method: "POST",
		header: {
			"Authorization": "Bearer " + token,
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
}

// 获取页面详情
export function getPageDetail(pageId) {
	return unip.request({
		url: API.PAGE_DETAIL_URL + "/" + pageId
	});
}


// 获取二维码
export function getQRCode(postid, path) {
	let url = API.WEIXIN_QR_CODE_URL;

	return unip.request({
		url,
		data: {
			postid,
			path
		},
		method: "POST",
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
}

// 获取论坛分类目录
export function getForumCategories() {

	return unip.request({
		url: API.FORUMS_CATEGORY_URL
	});
}

// 获取论坛话题列表
export function getForumTopicList({
	id,
	page,
	per_page
}) {

	const token = uni.getStorageSync("token");

	return unip.request({
		url: API.FORUMS_LIST_URL + id,
		method: "GET",
		data: {
			page,
			per_page
		},
		header: {
			Authorization: token ? "Bearer " + token : ""
		}
	});
}

// 获取论坛文章详情
export function getForumTopicDetail(id) {

	const token = uni.getStorageSync("token");

	return unip.request({
		url: API.FORUMS_POST_DETAIL_URL + id,
		method: "GET",
		header: {
			Authorization: token ? "Bearer " + token : ""
		}
	});
}
// 获取论坛文章的评论
export function getForumTopicComment({
	id,
	page,
	per_page,
	order
}) {

	return unip.request({
		url: API.FORUMS_POST_COMMENT_URL + id,
		method: "GET",
		data: {
			page,
			per_page,
			order
		}
	});
}

// 发布论坛帖子
export function postForumPost({
	forum_id,
	content,
	tags,
	images,
	platform
}) {
	// 获取token
	const token = uni.getStorageSync("token");
	return request({
		url: API.FORUMS_POST_PUBLISH_URL,
		method: "POST",
		data: {
			forum_id,
			content,
			tags,
			images,
			platform
		},
		header: {
			Authorization: "Bearer " + token
		}
	});
}

// 发表论坛评论
export function postForumReply({
	topic_id,
	reply_to_id,
	content,
	platform
}) {
	// 获取token
	const token = uni.getStorageSync("token");

	return unip.request({
		url: API.FORUMS_POST_COMMENT_URL,
		method: "POST",
		data: {
			topic_id,
			reply_to_id,
			content,
			platform
		},
		header: {
			Authorization: "Bearer " + token
		}

	});
}

// 给论坛文章点赞
export function forumPostLike({
	id,
	isLike
}) {

	// 获取token
	const token = uni.getStorageSync("token");

	return unip.request({
		url: API.FORUMS_POST_LIKE_URL,
		method: "POST",
		data: {
			id,
			isLike
		},
		header: {
			Authorization: "Bearer " + token
		}
	});
}

// 获取图形验证码
export function getGraphicCaptcha({
	token
}) {
	return unip.request({
		url: API.GRAPHIC_CAPTCHA_URL,
		method: "POST",
		data: token ? {
			token
		} : null,
		withCredentials: true
	});
}

// 获取邮箱验证码
export function getEmailCaptcha({
	email,
	graphicCaptcha,
	token
}) {
	return unip.request({
		url: API.EMAIL_CAPTCHA_URL,
		method: "POST",
		data: {
			email,
			graphicCaptcha,
			token
		}
	});

}

// 用户注册
export function userRegister({
	nickname,
	email,
	password,
	graphicCaptcha,
	emailCaptcha,
	token
}) {
	return unip.request({
		url: API.USER_REGISTER,
		method: "POST",
		data: {
			nickname,
			email,
			password,
			graphicCaptcha,
			emailCaptcha,
			token
		}
	});
}


// 用户注册
export function userResetPassword({
	email,
	password,
	graphicCaptcha,
	emailCaptcha,
	token
}) {
	return unip.request({
		url: API.USER_RESET_PASSWORD,
		method: "POST",
		data: {
			email,
			password,
			graphicCaptcha,
			emailCaptcha,
			token
		}
	});
}

export function updateUserEmail({
	email,
	graphicCaptcha,
	emailCaptcha,
	token
}) {

	// 获取token
	const AuthToken = uni.getStorageSync("token");

	return request({
		url: API.UPDATE_USER_EMAIL,
		method: "POST",
		data: {
			email,
			graphicCaptcha,
			emailCaptcha,
			token
		},
		header: {
			Authorization: "Bearer " + AuthToken
		}
	});
}

// 文件上传
export function uploadFile({
	filePath
}) {

	// 获取token
	const token = uni.getStorageSync("token");

	return unip.uploadFile({
		url: API.MEDIA_URL,
		filePath,
		name: "file",
		header: {
			Authorization: "Bearer " + token
		}
	});
}

export function deleteFile({
	id
}) {
	// 获取token
	const token = uni.getStorageSync("token");

	return unip.request({
		url: API.MEDIA_URL + "/" + id,
		method: "DELETE",
		data: {
			force: true
		},
		header: {
			Authorization: "Bearer " + token
		}
	});
}

// 获取用户二维码信息
export const getQRInfo = (token) => {
	// 获取token
	const AuthToken = uni.getStorageSync("token");
	return request({
		url: API.QR_INFO_URL,
		method: "POST",
		data: {
			token
		},
		header: {
			Authorization: "Bearer " + AuthToken
		}
	});
};

// 确认用户二维码登录
export const confirmQRLogin = (token, isContinue) => {

	// 获取token
	const AuthToken = uni.getStorageSync("token");
	return request({
		url: API.CONFIRM_QR_LOGIN,
		method: "POST",
		data: {
			token,
			isContinue
		},
		header: {
			Authorization: "Bearer " + AuthToken
		}
	});
};
