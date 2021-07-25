<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30" @tap="login">
			<view class="u-m-r-40">
				<u-avatar :src="userInfo.avatarUrl" size="120" v-if="isLogin"></u-avatar>
				<u-avatar src="/static/gravatar.png" size="120" v-else></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20" v-if="isLogin">{{userInfo.nickname}}</view>
				<view class="u-font-18 u-p-b-20" v-else>游客</view>
				<view class="u-font-14 u-tips-color" v-if="isLogin">{{userInfo.levelName}}</view>
				<view class="u-font-14 u-tips-color" v-else>登录</view>
			</view>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="file-text-fill" title="阅读历史" @tap="redirect({
					type: 'apppage',
					path: '/pages/list/list?history=true'
				})"></u-cell-item>
				<u-cell-item icon="star-fill" title="我的收藏" @tap="goTo('like')"></u-cell-item>
				<u-cell-item icon="chat-fill" title="我的评论" @tap="goTo('comment')"></u-cell-item>
				<!-- <u-cell-item icon="edit-pen-fill" title="我的投稿"></u-cell-item> -->
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<!-- <u-cell-item icon="setting-fill" title="关于我们"></u-cell-item> -->
				<u-cell-item icon="person-delete-fill" title="退出登录" @tap="logout"></u-cell-item>
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
				return this.$store.state.authStore.isLogin
			},
			login_type() {
				return this.$store.state.authStore.login_type
			},
			js_code() {
				return this.$store.state.authStore.js_code
			},
			userInfo() {
				return this.$store.state.authStore.userInfo
			}
		},
		onLoad() {
			// #ifdef MP-QQ
			qq.showShareMenu({
				showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
			});
			// #endif
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
		},
		onShareAppMessage(res) {
			return {
				title: `分享「${config.WEBSITE_NAME}」小程序`,
				path: "pages/index/index",
				imageUrl: this.$store.state.configStore.shareImageUrl,
			}
		},
		onShareTimeline() {
			return {
				title: `分享「${config.WEBSITE_NAME}」小程序`,
				imageUrl: this.$store.state.configStore.shareImageUrl
			}
		},
		methods: {
			login() {
				if (this.$store.state.authStore.isLogin) return;
				uni.navigateTo({
					url: "../login/login"
				})
			},
			logout() {
				uni.showToast({
					title: "退出成功"
				})
				this.$store.commit("authStore/logout");
				uni.clearStorageSync("login_type");
				uni.clearStorageSync("userInfo");
			},
			goTo(option) {
				if (!this.$store.state.authStore.isLogin) {
					uni.navigateTo({
						url: "../login/login"
					})
					return;
				}

				switch (option) {
					case "like":
						this.redirect({
							type: 'apppage',
							path: '/pages/list/list?like=true'
						})
						break;
					case "comment":
						this.redirect({
							type: 'apppage',
							path: '/pages/comment/comment'
						})
						break;
				}



			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #ededed;
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
	}
</style>
