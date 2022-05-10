/*
 * UniApp Wordpress 小程序
 * author: XiaoSaGe
 * 开源协议：MIT
 * Copyright (c) 2021 https://uni.supertyler.com
 */

// const HOST_DOMAIN = "www.watch-life.net";
const HOST_DOMAIN = "uni.supertyler.com";
// const HOST_DOMAIN = "uni.moetu.club";

const WEBSITE_NAME = "前端茶会";

const ROLES = {
	"subscriber": "订阅者",
	"contributor": "贡献者",
	"editor": "编辑",
	"administrator": "管理员"
};

// QQ H5登录配置信息
const QQ_H5_APPID = "101961309";
const QQ_H5_REDIRECT_URI = "http://h5.uni.supertyler.com/#/pages/login/login";


export default {
	HOST_DOMAIN,
	WEBSITE_NAME,
	ROLES,
	QQ_H5_APPID,
	QQ_H5_REDIRECT_URI
};
