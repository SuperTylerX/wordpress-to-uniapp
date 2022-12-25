/*
 * UniApp Wordpress 小程序
 * author: XiaoSaGe
 * 开源协议：MIT
 * Copyright (c) 2021 https://uni.supertyler.com
 */

let promisify = func => (args = {}) => new Promise((resolve, reject) => {
	func(Object.assign(args, {
		success: resolve,
		fail: reject,
	}));
});

export const request = promisify(uni.request);
// 百度小程序不允许出现swan.login，需要条件去除
// #ifndef MP-BAIDU
export const login = promisify(uni.login);
// #endif
export const getUserProfile = promisify(uni.getUserProfile);
export const showActionSheet = promisify(uni.showActionSheet);
export const uploadFile = promisify(uni.uploadFile);
export const getSystemInfo = promisify(uni.getSystemInfo);
export const showModal = promisify(uni.showModal);
export const navigateTo = promisify(uni.navigateTo);


// 百度私有API
export const getLoginCode = promisify(swan.getLoginCode);
