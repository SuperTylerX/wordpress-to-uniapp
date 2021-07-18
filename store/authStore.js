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
		async wxLogin({ commit }) {
			try {
				let res = await unip.login();
				let js_code = res.code;
				commit("update_js_code", {
					js_code
				});
			} catch (e) {
				console.log(e);
			}
		},
		async wxGetUserInfo({ commit }) {
			try {
				const res = await unip.getUserProfile({
					desc: "获取您的头像和昵称信息用于登录",
				});
				commit("update_userInfo", {
					userInfo: res.userInfo,
					login_type: "WECHAT"
				});
			} catch (e) {
				console.log(e);
				console.log("用户取消登录");
			}
		},
		async wxUserLoginRequest({ commit, state }) {
			try {
				const res = await http.wxUserLogin({
					avatarUrl: state.userInfo.avatarUrl,
					js_code: state.js_code,
					nickname: state.userInfo.nickName
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
		async login({ commit, dispatch }, payloads) {
			try {
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
					uni.showToast({
						title: res.data.message.replace(/<[^>]+>/g, ""),
						icon: "none",
						position: "bottom"
					});
				}
			} catch (e) {
				console.log(e);
			}
		},
		async getUserInfo({ commit, state }, payloads) {
			const res = await http.getUserInfo(state.token).then(data => data.data);
			const avatarUrl = res.avatar || res.avatar_urls[24];
			const userInfo = {
				avatarUrl,
				nickName: res.nickname,
				levelName: config.ROLES[res.roles[0]],
				userId: res.id
			};
			commit("update_userInfo", {
				userInfo: userInfo,
				login_type: payloads.login_type,
				isLogin: true
			});
		},
		async validateToken({ commit, dispatch, state }, payloads) {
			const res = await http.validateJWT(state.token).then(data => data.data);
			if (res.data.status === 200) {
				dispatch("getUserInfo", payloads);
			} else {
				uni.removeStorageSync("token");
			}
		}

	}
});
