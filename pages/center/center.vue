<template>
	<view>
		<view class="user-box" @tap="login">
			<view class="u-m-r-40">
				<view v-if="isLogin">
					<u-avatar :src="userInfo.avatarUrl" size="60"></u-avatar>
				</view>
				<view v-else>
					<u-avatar src="/static/gravatar.png" size="60"></u-avatar>
				</view>
			</view>
			<view class="right">
				<view>
					<view class="name" v-if="isLogin">{{userInfo.nickname}}</view>
					<view class="name " v-else>游客</view>

					<view class="role" v-if="isLogin">{{userInfo.levelName}}</view>
					<view class="role" v-else>登录</view>
				</view>
				<view v-if="isLogin" class="scan" @click.stop="scanQR">
					<u-icon name="scan" color="#aaaaaa" size="30"></u-icon>
				</view>
			</view>
		</view>


		<view class="menus">
			<u-cell-group>
				<u-cell class="menu-cell" icon="file-text-fill" title="阅读历史" @tap="redirect({
					type: 'apppage',
					path: '/pages/list/list?history=true'
				})" :isLink="true" size="large" :clickable="true"></u-cell>
				<u-cell class="menu-cell" icon="star-fill" title="我的收藏" @tap="goTo('like')" :isLink="true" size="large"
					:clickable="true">
				</u-cell>
				<u-cell class="menu-cell" icon="chat-fill" title="我的评论" @tap="goTo('comment')" :isLink="true"
					size="large" :clickable="true"></u-cell>
				<!-- <u-cell icon="edit-pen-fill" title="我的投稿"></u-cell> -->
			</u-cell-group>
		</view>

		<view class="menus-2">
			<u-cell-group>
				<!-- <u-cell icon="setting-fill" title="关于我们"></u-cell> -->
				<u-cell class="menu-cell" icon="person-delete-fill" title="退出登录" @tap="logout" :isLink="true"
					size="large" :clickable="true"></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import config from "../../utils/config.js";
	import * as unip from "../../utils/uniPromisify.js";

	export default {
		data() {
			return {
				show: true
			};
		},
		computed: {
			isLogin() {
				return this.$store.state.authStore.isLogin;
			},
			login_type() {
				return this.$store.state.authStore.login_type;
			},
			js_code() {
				return this.$store.state.authStore.js_code;
			},
			userInfo() {
				return this.$store.state.authStore.userInfo;
			}
		},
		onLoad() {
			// #ifdef MP-QQ
			qq.showShareMenu({
				showShareItems: ["qq", "qzone", "wechatFriends", "wechatMoment"]
			});
			// #endif
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ["shareAppMessage", "shareTimeline"]
			});
			// #endif
		},
		onShareAppMessage(res) {
			return {
				title: `分享「${config.WEBSITE_NAME}」小程序`,
				path: "pages/index/index",
				imageUrl: this.$store.state.configStore.shareImageUrl,
			};
		},
		onShareTimeline() {
			return {
				title: `分享「${config.WEBSITE_NAME}」小程序`,
				imageUrl: this.$store.state.configStore.shareImageUrl
			};
		},
		methods: {
			login() {
				uni.navigateTo({
					url: this.isLogin ? "./profile" : "../login/login"
				});
			},
			logout() {
				uni.showToast({
					title: "退出成功"
				});
				this.$store.commit("authStore/logout");
				uni.clearStorageSync("login_type");
				uni.clearStorageSync("userInfo");
			},
			goTo(option) {
				if (!this.$store.state.authStore.isLogin) {
					uni.navigateTo({
						url: "../login/login"
					});
					return;
				}

				switch (option) {
					case "like":
						this.redirect({
							type: "apppage",
							path: "/pages/list/list?like=true"
						});
						break;
					case "comment":
						this.redirect({
							type: "apppage",
							path: "/pages/comment/comment"
						});
						break;
				}

			},
			async scanQR() {
				try {
					const { result } = await unip.scanCode();
					const code = JSON.parse(result);
					if (!code.token) {
						throw new Error("无法识别的二维码");
					}

					const { token } = code;
					uni.navigateTo({
						url: "./confirm?token=" + token,
						fail: (e) => {
							console.log(e);
						}
					});

				} catch (e) {
					console.error(e);
					if (e.errMsg == "scanCode:fail cancel") {
						return;
					}
					uni.showToast({
						icon: "error",
						title: "二维码未识别"
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #F4F7F6;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
		display: flex;
		padding: 30rpx 30rpx 60rpx;
		gap: 50rpx;

		.right {
			flex: 1;
			position: relative;

			.name {
				font-size: 35rpx;
				font-weight: 600;
			}

			.role {
				font-size: 30rpx;
				margin-top: 20rpx;
				color: #B2B6B9;
			}

			.scan {
				position: absolute;
				top: 30rpx;
				right: 20rpx;
			}
		}
	}

	.menus {
		margin-top: 20rpx;
		background-color: #fff;
	}

	.menus-2 {
		margin-top: 20rpx;
		background-color: #fff;
	}
</style>
