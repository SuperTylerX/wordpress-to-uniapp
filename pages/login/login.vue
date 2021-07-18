<template>
	<view class="wrap">
		<view class="header">
			登录
		</view>

		<form @submit="login">
			<view class="input-wrap">
				<view class="username input-item">
					<u-icon class="icon" size="40" name="account"></u-icon>
					<input class="input" type="text" value="" confirm-type="next" placeholder="请输入用户名/邮箱"
						@confirm="isPassFocus= true" name="username" v-model="loginInput.username" />
				</view>
				<view class="password input-item">
					<u-icon class="icon" size="40" name="lock"></u-icon>
					<input class="input" value="" type="password" confirm-type="done" placeholder="请输入密码"
						:focus="isPassFocus" @blur="isPassFocus = false" @confirm="login" name="password"
						v-model="loginInput.password" />
				</view>
			</view>

			<view class="more-options">
				<view class="forgot-pass"><text class="color" @tap="redirect({
					type: 'webpage',
					url: lostpasswordUrl
				})">忘记密码</text></view>
				<view class="register">没有账号？<text class="color" @tap="redirect({
					type: 'webpage',
					url: registerUrl
				})">注册</text></view>
			</view>

			<button class="button" type="primary" form-type="submit">登录</button>
		</form>


		<view class="wechat" @tap="wechatLogin">
			<u-icon class="icon" size="60" name="weixin-fill" color="#62b900"></u-icon>
			<text class="disc"> 微信登录 </text>
		</view>

		<view class="footer">
			<app-footer></app-footer>
		</view>
	</view>
</template>

<script>
	import config from "../../utils/config.js";

	export default {
		data() {
			return {
				loginInput: {
					username: "",
					password: ""
				},
				isPassFocus: false,
			};
		},
		computed: {
			lostpasswordUrl() {
				return "https://" + config.HOST_DOMAIN + "/wp-login.php?action=lostpassword";
			},
			registerUrl() {
				return "https://" + config.HOST_DOMAIN + "/wp-login.php?action=register";
			}
		},
		methods: {
			wechatLogin() {
				let userinfoP = this.$store.dispatch("authStore/wxGetUserInfo");
				let loginP = this.$store.dispatch("authStore/wxLogin");

				Promise.all([userinfoP, loginP]).then(async () => {
					// 如果userInfo 获取不到，说明用户拒绝登录授权，那么取消登录
					if (this.$store.state.authStore.userInfo.nickName === undefined) return;
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
						uni.navigateBack({

						});
					} catch (e) {
						console.log(e);
					}

				});
			},
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
					console.log(e);
				}

			}
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		margin: 0 30rpx;

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
				color: #007AFF;
			}
		}

		.button {
			margin-top: 100rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 45rpx;
			background-color: #007AFF;
		}

		.wechat {
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
				margin-top: 15rpx;
				color: #BCBCBC;
			}
		}

		.footer {
			position: fixed;
			bottom: 40rpx;
			left: 0;
			width: 100%;
		}
	}
</style>
