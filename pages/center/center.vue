<template>
	<view>
		<div class="user-box" @tap="login">
			<view class="u-m-r-40">
				<div v-if="isLogin">
					<u-avatar :src="userInfo.avatarUrl" size="60"></u-avatar>
				</div>
				<div v-else>
					<u-avatar src="/static/gravatar.png" size="60"></u-avatar>
				</div>
			</view>
			<view class="right">
				<view class="name" v-if="isLogin">{{userInfo.nickname}}</view>
				<view class="name " v-else>游客</view>

				<view class="role" v-if="isLogin">{{userInfo.levelName}}</view>
				<view class="role" v-else>登录</view>
			</view>
		</div>


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

		.right {
			margin-left: 50rpx;

			.name {
				font-size: 35rpx;
				font-weight: 600;
			}

			.role {
				font-size: 30rpx;
				margin-top: 20rpx;
				color: #B2B6B9;
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
