/*
 * UniApp Wordpress 小程序
 * Author: SuperTylerX
 * 开源协议：MIT
 * Copyright (c) 2021 https://uni.supertyler.com
 */

import * as unip from "../utils/uniPromisify.js";
import * as API from "../utils/api.js";
import queryParams from "../uview-ui/libs/function/queryParams.js";

function getHomeConfig() {
	return unip.request({
		url: API.HOME_CONFIG_URL
	});
}

function getDisplayCategoryIds() {
	return unip.request({
		url: API.DISPLAY_CATEGORY_IDS_URL
	});
}

function getArticleList(queryObj) {
	return unip.request({
		url: API.ARTICLE_LIST_URL + queryParams(queryObj)
	});
}

function getCategory(queryObj) {
	return unip.request({
		url: API.CATEGORY_URL + queryParams(queryObj)
	});
}

function getHotCommentPosts() {
	return unip.request({
		url: API.HOT_COMMENT_POST_URL
	});
}

function getHotViewPosts() {
	return unip.request({
		url: API.HOT_VIEW_POST_URL
	});
}

function getHotLikePosts() {
	return unip.request({
		url: API.HOT_LIKE_POST_URL
	});
}

function getPostDetail(postId) {
	return unip.request({
		url: API.POST_DETAIL_URL + "/" + postId
	});
}

function getPostTag(queryObj) {
	return unip.request({
		url: API.POST_TAG_URL + queryParams(queryObj)
	});
}

function getGuessYouLike(queryObj) {
	return unip.request({
		url: API.ARTICLE_LIST_URL + queryParams(queryObj)
	});
}

function getComments(queryObj) {
	return unip.request({
		url: API.POST_COMMENT_URL + queryParams(queryObj)
	});
}

// 微信用户登录
function wxUserLogin(queryObj) {

	let url = "";
	// #ifdef MP-WEIXIN
	url = API.WECHAT_USER_LOGIN;
	// #endif
	// #ifdef MP-QQ
	url = API.QQ_MINIAPP_USER_LOGIN;
	// #endif

	return unip.request({
		url,
		method: "POST",
		data: queryObj
	});
}
// QQ APP用户登录
function qqAppUserLogin(queryObj) {
	const url = API.QQ_APP_USER_LOGIN;
	return unip.request({
		url,
		method: "POST",
		data: queryObj
	});
}
// QQ H5用户登录
function qqH5UserLogin(queryObj) {
	const url = API.QQ_H5_USER_LOGIN;
	return unip.request({
		url,
		method: "POST",
		data: queryObj
	});
}

// 点赞
function postLike(queryObj, token) {
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
function getJWT(queryObj) {
	return unip.request({
		url: API.JWT_TOKEN_URL,
		method: "POST",
		data: queryObj
	});
}

// 验证JWT
function validateJWT(token) {
	return unip.request({
		url: API.JWT_VALIDATE_URL,
		method: "POST",
		header: {
			Authorization: "Bearer " + token
		}
	});
}

// 获取用户信息
function getUserInfo(token) {
	return unip.request({
		url: API.USER_INFO_URL,
		method: "POST",
		header: {
			Authorization: "Bearer " + token
		}
	});
}

// 获取分类元信息
function getCategoryMeta(categoryID) {
	return unip.request({
		url: API.CATEGORY_META_URL + "/" + categoryID
	});
}

// 获取标签元信息
function getTagMeta(tagID) {
	return unip.request({
		url: API.POST_TAG_URL + "/" + tagID
	});
}

// 获取评论
function getMyComments(token) {
	return unip.request({
		url: API.GET_MY_COMMENTS_URL,
		header: {
			Authorization: "Bearer " + token
		}
	});
}

// 提交评论
function postMyComment(queryObj, token) {
	return unip.request({
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
function deleteMyComment(commentId, token) {
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
function getLikePosts(token) {
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
function getPageDetail(pageId) {
	return unip.request({
		url: API.PAGE_DETAIL_URL + "/" + pageId
	});
}


// 获取二维码
function getQRCode(postid, path) {
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

export default {
	getHomeConfig,
	getDisplayCategoryIds,
	getArticleList,
	getCategory,
	getHotCommentPosts,
	getHotViewPosts,
	getHotLikePosts,
	getPostDetail,
	getPostTag,
	getGuessYouLike,
	getComments,
	wxUserLogin,
	postLike,
	getJWT,
	validateJWT,
	getUserInfo,
	getCategoryMeta,
	getTagMeta,
	getMyComments,
	postMyComment,
	deleteMyComment,
	getLikePosts,
	getPageDetail,
	qqAppUserLogin,
	getQRCode,
	qqH5UserLogin
};
