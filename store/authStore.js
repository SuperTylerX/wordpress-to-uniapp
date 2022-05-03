import http from "../utils/http.js";
import * as unip from "../utils/uniPromisify.js";
import config from "../utils/config.js";

export default ({
	namespaced: true,
	state: {
		isLogin: false,
		login_type: "",
		js_code: "",
		userInfo: {},
		token: undefined
	},
	mutations: {
		update_js_code(state, payloads) {
			state.js_code = payloads.js_code;
		},
		update_userInfo(state, payloads) {
			state.userInfo = payloads.userInfo;
			if (payloads.login_type !== undefined) {
				state.login_type = payloads.login_type;
			}
			if (payloads.isLogin !== undefined) {
				state.isLogin = payloads.isLogin;
			}
		},
		update_userLoginInfo(state, payloads) {
			state.userInfo.openid = payloads.openid;
			state.userInfo.userId = payloads.userId;
			state.userInfo.levelName = payloads.levelName;
			state.token = payloads.token;
			state.isLogin = true;
		},
		logout(state) {
			state.isLogin = false;
			state.login_type = "";
			state.js_code = "";
			state.userInfo = {};
			state.token = "";
		},
		update_token(state, payloads) {
			state.token = payloads.token;
		}
	},
	actions: {
		// 小程序获取js_code
		async wxLogin({ commit }) {
			try {
				let res = await unip.login();
				let js_code = res.code;
				commit("update_js_code", {
					js_code
				});
			} catch (e) {
				console.log(e);
				uni.showToast({
					title: "获取js_coded失败"
				});
			}
		},
		// 小程序获取用户信息
		async wxGetUserInfo({ commit }) {
			try {
				const res = await unip.getUserProfile({
					desc: "获取您的头像和昵称信息用于登录",
				});
				commit("update_userInfo", {
					userInfo: {
						...res.userInfo,
						nickname: res.userInfo.nickName
					},
					login_type: "WECHAT"
				});
			} catch (e) {
				console.log(e);
				console.log("用户取消登录");
			}
		},
		// 小程序发送请求获取token
		async wxUserLoginRequest({ commit, state }) {
			try {
				const res = await http.wxUserLogin({
					avatarUrl: state.userInfo.avatarUrl,
					js_code: state.js_code,
					nickname: state.userInfo.nickname
				}).then(data => data.data);

				commit("update_userLoginInfo", {
					openid: res.openid,
					userId: res.userId,
					levelName: res.userLevel.levelName,
					token: res.token
				});

			} catch (e) {
				console.log(e);
			}
		},
		// 普通使用token进行登录
		async login({ commit, dispatch }, payloads) {
			const res = await http.getJWT({
				username: payloads.username,
				password: payloads.password
			});
			if (res.statusCode === 200) {
				const token = res.data.token;
				commit("update_token", {
					token
				});
				await dispatch("getUserInfo", { login_type: "APP" });
			} else if (res.statusCode === 403) {
				const errorMessage = res.data.message.replace(/<[^>]+>/g, "")
				uni.showToast({
					title: errorMessage,
					icon: "none",
					position: "bottom"
				});
				throw new Error(errorMessage);
			}
		},
		// 普通使用token获取用户信息
		async getUserInfo({ commit, state }, payloads) {
			const res = await http.getUserInfo(state.token).then(data => data.data);
			const avatarUrl = res.avatar || res.avatar_urls[24];
			const userInfo = {
				avatarUrl,
				nickname: res.nickname,
				levelName: config.ROLES[res.roles[0]],
				userId: res.id
			};
			commit("update_userInfo", {
				userInfo: userInfo,
				login_type: payloads.login_type,
				isLogin: true
			});
		},
		// 验证Token可用性
		async validateToken({ commit, dispatch, state }, payloads) {
			const res = await http.validateJWT(state.token).then(data => data.data);
			if (res.data.status === 200) {
				dispatch("getUserInfo", payloads);
			} else {
				uni.removeStorageSync("token");
			}
		},
		async qqAppLogin({ commit, dispatch, state }, payloads) {

			try {
				const authResult = await unip.login({
					"provider": "qq"
				});

				if (authResult.errMsg != "login:ok") {
					uni.showToast({
						title: "获取登录权限失败",
						icon: "none"
					});
					return;
				}

				const access_token = authResult.authResult.access_token;

				const userInfoRes = await unip.getUserProfile({
					provider: "qq"
				});

				if (userInfoRes.errMsg != "getUserProfile:ok") {
					uni.showToast({
						title: "获取用户信息失败",
						icon: "none"
					});
					return;
				}

				const userInfo = {
					avatarUrl: userInfoRes.userInfo.figureurl_2,
					nickname: userInfoRes.userInfo.nickname,
					access_token
				};
				commit("update_userInfo", { userInfo });

				const res = await http.qqAppUserLogin(userInfo).then(data => data.data);

				commit("update_userLoginInfo", {
					openid: res.openid,
					userId: res.userId,
					levelName: res.userLevel.levelName,
					token: res.token
				});

			} catch (e) {
				console.log(e);
			}



		}
	}
});
