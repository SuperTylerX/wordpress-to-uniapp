<template>
	<view class="wrap">
		<view class="top">
			<view class="header">注册</view>

			<form @submit="register">
				<view class="input-wrap">
					<view class="nickname input-item">
						<u-icon class="icon" size="22" name="account"></u-icon>
						<input class="input" type="text" value="" confirm-type="next" placeholder="请输入昵称"
							name="nickname" v-model="form.nickname" maxlength="20" />
					</view>
					<view class="email input-item">
						<u-icon class="icon" size="22" name="email"></u-icon>
						<input class="input" type="text" confirm-type="next" placeholder="请输入邮箱" name="email"
							v-model="form.email" />
					</view>
					<view class="password input-item">
						<u-icon class="icon" size="22" name="lock"></u-icon>
						<input class="input" type="password" confirm-type="next" placeholder="请输入密码" name="password"
							v-model="form.password" maxlength="20" />
					</view>
					<view class="password input-item">
						<u-icon class="icon" size="22" name="lock"></u-icon>
						<input class="input" type="password" confirm-type="next" placeholder="请重复密码" name="repassword"
							v-model="form.repassword" maxlength="20" />
					</view>

					<view class="graphicCaptcha input-item">
						<u-icon class="icon" size="22" name="info-circle"></u-icon>
						<input class="input" type="text" confirm-type="next" placeholder="请输入图形验证码" name="code"
							v-model="graphicCaptchaComputed" maxlength="4" />
						<image :src="captchaImg" class="captchaImg" mode="scaleToFill" @click="refreshGraphicCaptcha">
						</image>
					</view>

					<view class="emailCaptcha input-item">
						<u-icon class="icon" size="22" name="chat"></u-icon>
						<input class="input" type="text" confirm-type="done" placeholder="请输入邮箱验证码" @confirm="register"
							name="code" v-model="form.emailCaptcha" maxlength="6" />
						<view class="fetch-btn" v-if="showFetchMailCaptcha" @click="getEmailCaptcha">点击获取验证码</view>
						<view class="waitting" v-else>{{ timer }}秒后重新获取</view>
					</view>
				</view>

				<button class="button" type="primary" form-type="submit">注册</button>
			</form>
		</view>

		<view class="footer">
			<app-footer />
		</view>
	</view>
</template>

<script>
	import { getGraphicCaptcha, getEmailCaptcha, userRegister } from "../../utils/http.js";

	const sleep = time => new Promise(resolve => setTimeout(resolve, time));

	export default {
		data() {
			return {
				form: {
					nickname: "",
					password: "",
					repassword: "",
					graphicCaptcha: "",
					emailCaptcha: ""
				},
				isPassFocus: false,
				showFetchMailCaptcha: true,
				timer: 60,
				captchaImg: "",
				token: ""
			};
		},
		computed: {
			graphicCaptchaComputed: {
				get: function() {
					return this.form.graphicCaptcha;
				},
				set: function(val) {
					this.form.graphicCaptcha = val.toUpperCase();
				}
			}
		},
		methods: {
			async refreshGraphicCaptcha() {
				// 获取图形验证码
				const args = {
					token: this.token === "" ? null : this.token
				};
				try {
					const {
						data: { image, token }
					} = await getGraphicCaptcha(args);

					this.captchaImg = image;
					this.token = token;
				} catch (e) {
					console.error(e);
				}
			},
			async getEmailCaptcha() {
				const reqParamsObj = {
					email: this.form.email,
					graphicCaptcha: this.graphicCaptchaComputed,
					token: this.token
				};

				/* 验证一下输入是否合法 */
				// 验证邮箱格式
				if (!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(reqParamsObj
						.email)) {
					uni.showToast({
						title: "邮箱格式有误",
						icon: "error"
					});
					return;
				}
				// 验证图形验证码长度
				if (reqParamsObj.graphicCaptcha.length !== 4) {
					uni.showToast({
						title: "图形验证码长度有误",
						icon: "none"
					});
					return;
				}

				uni.showToast({
					title: "请稍后...",
					icon: "loading",
					duration: 999999
				});
				try {
					const {
						data: { code, message }
					} = await getEmailCaptcha(reqParamsObj);

					if (code !== "200") {
						uni.showToast({
							title: message,
							icon: "error"
						});
						if (code === "4001" || code === "4002") {
							// token过期，重新获取验证码
							this.refreshGraphicCaptcha();
							this.graphicCaptchaComputed = "";
						}
						return;
					}
				} catch (e) {
					console.error(e);
					uni.showToast({
						title: "请检查网络",
						icon: "error"
					});
					return;
				}

				uni.showToast({
					title: "发送成功, 请检查您的邮箱！",
					icon: "none",
					position: "bottom"
				});

				this.showFetchMailCaptcha = false;
				for (let i = 60; i >= 0; i--) {
					this.timer = i;
					await sleep(1000);
				}
				this.showFetchMailCaptcha = true;
			},
			async register() {
				/* 验证一下输入是否合法 */
				// 检查密码是否相同
				if (this.form.password !== this.form.repassword) {
					uni.showToast({
						title: "输入密码不一致",
						icon: "error"
					});
					return;
				}
				const reqParamsObj = {
					nickname: this.form.nickname,
					email: this.form.email,
					password: this.form.password,
					graphicCaptcha: this.graphicCaptchaComputed,
					emailCaptcha: this.form.emailCaptcha,
					token: this.token
				};

				// 验证邮箱格式
				if (!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(reqParamsObj
						.email)) {
					uni.showToast({
						title: "邮箱格式有误",
						icon: "error"
					});
					return;
				}
				// 验证密码长度
				if (reqParamsObj.password.length < 6) {
					uni.showToast({
						title: "密码长度过短",
						icon: "none"
					});
					return;
				}
				// 验证图形验证码长度
				if (reqParamsObj.graphicCaptcha.length !== 4) {
					uni.showToast({
						title: "图形验证码长度有误",
						icon: "none"
					});
					return;
				}
				// 验证邮箱验证码长度
				if (reqParamsObj.emailCaptcha.length !== 6) {
					uni.showToast({
						title: "邮箱验证码长度有误",
						icon: "none"
					});
					return;
				}

				uni.showToast({
					title: "请稍后...",
					icon: "loading",
					duration: 999999
				});
				try {
					const {
						data: { code, message }
					} = await userRegister(reqParamsObj);

					if (code !== "200") {
						uni.showToast({
							title: message,
							icon: "error"
						});
						if (code === "4001" || code === "4002") {
							// token过期，重新获取验证码
							this.refreshGraphicCaptcha();
							this.graphicCaptchaComputed = "";
							this.form.emailCaptcha = "";
						}
						return;
					}
				} catch (e) {
					console.error(e);
					uni.showToast({
						title: "请检查网络",
						icon: "error"
					});
					return;
				}

				uni.showToast({
					title: "注册成功",
					icon: "success"
				});
				// 成功注册，使用用户名密码进行登录
				await this.$store.dispatch("authStore/login", { username: this.form.email, password: this.form.password });
				// 加入本地存储用于二次登录
				uni.setStorageSync("userInfo", this.$store.state.authStore.userInfo);
				uni.setStorageSync("token", this.$store.state.authStore.token);
				uni.setStorageSync("login_type", "APP");

				uni.hideToast();

				// 返回首页
				uni.switchTab({
					url: "/pages/index/index"
				});
			}
		},
		async onLoad(option) {
			await this.refreshGraphicCaptcha();
		}
	};
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
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
				margin-top: 40rpx;
				align-items: center;

				.icon {
					width: 70rpx;
				}

				.input {
					flex: 1;
				}

				.fetch-btn {
					color: #007aff;
					cursor: pointer;
				}

				.waitting {
					color: #cccccc;
				}

				.captchaImg {
					height: 40px;
					width: 120px;
				}

				&.graphicCaptcha {
					margin-top: 20rpx;
				}
			}
		}

		.button {
			margin-top: 100rpx;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 45rpx;
			background-color: #007aff;
		}

		.footer {
			margin-top: 30rpx;
		}
	}
</style>
