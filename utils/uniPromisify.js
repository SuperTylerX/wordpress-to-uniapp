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
export const login = promisify(uni.login);
export const getUserProfile = promisify(uni.getUserProfile);
export const showActionSheet = promisify(uni.showActionSheet);
