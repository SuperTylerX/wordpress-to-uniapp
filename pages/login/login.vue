<template>
	<view class="wrap">
		<view class="top">
			<view class="header">登录</view>

			<form @submit="login">
				<view class="input-wrap">
					<view class="username input-item">
						<u-icon class="icon" size="22" name="account"></u-icon>
						<input class="input" type="text" value="" confirm-type="next" placeholder="请输入用户名/邮箱"
							@confirm="isPassFocus = true" name="username" v-model="loginInput.username" />
					</view>
					<view class="password input-item">
						<u-icon class="icon" size="22" name="lock"></u-icon>
						<input class="input" value="" type="password" confirm-type="done" placeholder="请输入密码"
							:focus="isPassFocus" @blur="isPassFocus = false" @confirm="login" name="password"
							v-model="loginInput.password" />
					</view>
				</view>

				<view class="more-options">
					<view class="forgot-pass"><text class="color" @tap="forgetPassOrRegister(1)">忘记密码</text></view>
					<view class="register">
						没有账号？
						<text class="color" @tap="forgetPassOrRegister(2)">注册</text>
					</view>
				</view>

				<button class="button" type="primary" form-type="submit">登录</button>
			</form>

			<!-- #ifdef MP-WEIXIN-->
			<view class="thrid-login" @tap="miniAppLogin">
				<u-icon class="icon" size="60" name="weixin-fill" color="#62b900"></u-icon>
				<text class="disc">微信登录</text>
			</view>
			<!-- #endif -->

			<!-- #ifdef MP-QQ || H5 || APP-PLUS -->
			<button type="default" plain="true" class="thrid-login" open-type="getUserInfo" @getuserinfo="miniAppLogin"
				@tap="qqlogin">
				<u-icon class="icon" size="30" name="qq-fill" color="#4BC1E8"></u-icon>
				<text class="disc">QQ登录</text>
			</button>
			<!-- #endif -->
		</view>

		<view class="footer">
			<app-footer></app-footer>
		</view>
	</view>
</template>

<script>
	import config from "../../utils/config.js";
	import utils from "../../utils/utils.js";
	import * as http from "../../utils/http.js";

	export default {
		data() {
			return {
				loginInput: {
					username: "",
					password: ""
				},
				isPassFocus: false
			};
		},
		onLoad(option) {
			// #ifdef H5
			const regres = location.hash.match(/access_token=([^&]*)/i);
			if (!regres) return;
			const access_token = regres[1];
			console.log(access_token);
			http.qqH5UserLogin({
				access_token
			}).then(data => {
				if (data.statusCode == 200) {
					const res = data.data;
					const token = res.token;
					this.$store.commit("authStore/update_token", { token });
					this.$store.dispatch("authStore/getUserInfo", { login_type: "H5" });
					// 加入本地存储用于二次登录
					uni.setStorageSync("userInfo", this.$store.state.authStore.userInfo);
					uni.setStorageSync("token", this.$store.state.authStore.token);
					uni.setStorageSync("login_type", "H5");

					uni.hideToast();
					uni.switchTab({
						url: "/pages/index/index"
					});
				} else {
					uni.showToast({
						title: "登录失败",
						icon: "none",
						duration: 3000
					});
				}
			});

			// #endif
		},
		methods: {
			// 小程序端登录
			miniAppLogin() {
				let userinfoP = this.$store.dispatch("authStore/wxGetUserInfo");
				let loginP = this.$store.dispatch("authStore/wxLogin");

				Promise.all([userinfoP, loginP]).then(async () => {
					// 如果userInfo 获取不到，说明用户拒绝登录授权，那么取消登录
					if (this.$store.state.authStore.userInfo.nickname === undefined) return;
					try {
						uni.showToast({
							title: "登录中",
							icon: "loading"
						});
						await this.$store.dispatch("authStore/wxUserLoginRequest");
						// 加入本地存储用于二次登录
						uni.setStorageSync("userInfo", this.$store.state.authStore.userInfo);
						uni.setStorageSync("token", this.$store.state.authStore.token);
						uni.setStorageSync("login_type", "WECHAT");

						uni.hideToast();
						uni.navigateBack({});
					} catch (e) {
						console.error(e);
					}
				});
			},

			// 普通用户名密码登录
			async login(e) {
				if (this.loginInput.username === "") {
					uni.showToast({
						title: "用户名为空",
						icon: "none",
						position: "bottom"
					});
					return;
				}
				if (this.loginInput.password === "") {
					uni.showToast({
						title: "密码为空",
						icon: "none",
						position: "bottom"
					});
					return;
				}
				try {
					uni.showToast({
						title: "登录中",
						icon: "loading"
					});
					await this.$store.dispatch("authStore/login", this.loginInput);

					// 加入本地存储用于二次登录
					uni.setStorageSync("userInfo", this.$store.state.authStore.userInfo);
					uni.setStorageSync("token", this.$store.state.authStore.token);
					uni.setStorageSync("login_type", "APP");

					uni.hideToast();
					uni.navigateBack();
				} catch (e) {
					console.error(e);
				}
			},

			// QQ在APP端登录
			async qqlogin() {
				// #ifdef APP-PLUS
				try {
					uni.showToast({
						title: "登录中",
						icon: "loading"
					});
					await this.$store.dispatch("authStore/qqAppLogin");
					// 加入本地存储用于二次登录
					uni.setStorageSync("userInfo", this.$store.state.authStore.userInfo);
					uni.setStorageSync("token", this.$store.state.authStore.token);
					uni.setStorageSync("login_type", "APP-QQ");

					uni.hideToast();
					uni.navigateBack();
				} catch (e) {
					console.error(e);
				}
				// #endif

				// #ifdef H5
				// QC.Login.showPopup({
				// 	"appId": "101961309",
				// 	"redirectURI": "http://h5.uni.supertyler.com/#/pages/login/login"
				// });
				window.location = `https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=716027609&pt_3rd_aid=${
				config.QQ_H5_APPID
			}&daid=383&pt_skey_valid=0&style=35&s_url=https%3A%2F%2Fconnect.qq.com&refer_cgi=authorize&which=&client_id=${
				config.QQ_H5_APPID
			}&response_type=token&scope=all&redirect_uri=${encodeURIComponent(config.QQ_H5_REDIRECT_URI)}`;

				// #endif
			},

			forgetPassOrRegister(option) {
				// if ((utils.getPlatform() == "MP-WEIXIN" &&
				// 		this.$store.state.configStore.wf_weixin_enterprise_minapp == "0") ||
				// 	(utils.getPlatform() == "MP-QQ" &&
				// 		this.$store.state.configStore.wf_qq_enterprise_minapp == "0")
				// ) {
				// 	uni.showToast({
				// 		title: "尚不支持此功能",
				// 		icon: "none",
				// 		duration: 3000
				// 	})
				// 	return;
				// }

				if (option == 1) {
					uni.navigateTo({
						url: "./reset"
					});
				} else if (option == 2) {
					if (this.$store.state.configStore.is_user_registration_enable) {
						uni.navigateTo({
							url: "./register"
						});
					} else {
						uni.showToast({
							title: "抱歉，网站已关闭邮箱注册！",
							icon: "none",
							position: "bottom"
						});
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		background-color: #ffffff;
	}

	.wrap {
		margin: 0 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 100%;

		.header {
			padding-top: 30rpx;
			font-size: 50rpx;
			font-weight: bold;
		}

		.input-wrap {
			margin-top: 80rpx;

			.input-item {
				display: flex;
				padding: 20rpx;
				border-bottom: 1px solid #eee;
				flex-direction: row;

				.icon {
					width: 70rpx;
				}

				.input {
					flex: 1;
				}

				&.password {
					margin-top: 40rpx;
				}
			}
		}

		.more-options {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-top: 30rpx;

			.register {
				flex-direction: row;
			}

			.color {
				color: #007aff;
			}
		}

		.button {
			margin-top: 100rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 45rpx;
			background-color: #007aff;
		}

		.thrid-login {
			margin-top: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			.icon {
				border: 1px solid #e2e3e3;
				padding: 15rpx;
				border-radius: 50%;
			}

			.disc {
				margin-top: 10rpx;
				color: #bcbcbc;
				font-size: 28rpx;
			}
		}

		button.thrid-login {
			border: transparent;
		}

		.footer {
			margin-top: 30rpx;
		}
	}
</style>
