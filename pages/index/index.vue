/*
* UniApp Wordpress 小程序
* author: SuperTylerX
* 开源协议：MIT
* Inspired by WordPres版微信小程序@jianbo
* GitHub: https://github.com/iamxjb/winxin-app-watch-life.net
* Copyright (c) 2021 https://uni.supertyler.com
*/

<template>
	<view>
		<!-- 幻灯片 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true"
			class="swiper-wrap">
			<swiper-item v-for="(item, index) in swipe_nav" :key="index" class="swiper-item" @tap="redirect(item)">
				<image mode="aspectFill" :src="item.image" class="image" />
				<view class="swiper-mask"></view>
				<text class="swiper-desc">
					{{item.title}}
				</text>
			</swiper-item>
		</swiper>

		<!-- 搜索框 -->
		<form @submit="formSubmit" id="search-form">
			<view class="search-box">
				<input class="search-input" confirm-type="search" placeholder="搜索你感兴趣的内容..." @confirm="formSubmit"
					v-model="searchText"></input>
				<button class="search-button" form-type="submit" size="mini" plain="true">
					<icon type="search" color="#959595" size="16"></icon>
				</button>
			</view>
		</form>

		<!-- 顶部导航 -->
		<view class="nav-wrap">
			<view class="nav-title">
				<view class="left">精选栏目</view>
				<view class="right">滑动查看</view>
			</view>
			<scroll-view scroll-x="true">
				<view class="nav-content">
					<view class="nav-item" v-for="(item, index) in selected_nav" :key="index" @tap="redirect(item)">
						<image :src="item.image" mode="scaleToFill"></image>
						<text>{{item.title}}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<u-gap bg-color="#F5F7F7" height="20"></u-gap>

		<view class="articles-top">
			<view class="left">最新文章</view>
		</view>

		<!-- 文章列表 -->
		<app-list :postsList="postsList"></app-list>
		<view class="center">
			<u-loading mode="flower" size="42" v-show="isLoading"></u-loading>
		</view>

		<app-footer></app-footer>
	</view>
</template>

<script>
	import http from "../../utils/http.js";
	import config from "../../utils/config.js";
	// 非响应式数据
	let page = 1; // 文章显示页号
	let Ids = "";

	export default {
		data() {
			return {
				postsList: [],
				isLastPage: false,
				searchText: "",
				isLoading: false
			};
		},
		computed: {
			selected_nav() {
				return this.$store.state.configStore.selected_nav;
			},
			swipe_nav() {
				return this.$store.state.configStore.swipe_nav;
			}
		},
		async onLoad() {
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
			await this.fetchCategoryIds();
			this.fetchArticles();
		},
		onReachBottom() {
			if (this.isLastPage) return;
			this.fetchArticles();
		},
		async onPullDownRefresh() {
			page = 1;
			this.postsList = [];
			this.isLastPage = false;

			await this.fetchCategoryIds();
			await this.fetchArticles();

			uni.stopPullDownRefresh();
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
			formSubmit() {
				if (this.searchText.length === 0) {
					uni.showToast({
						title: "请至少输入一个字符",
						icon: "none",
						position: "bottom"
					});
					return;
				}

				uni.navigateTo({
					url: "../list/list?search=" + this.searchText
				});
			},
			async fetchCategoryIds() {
				try {
					const shownIds = await http.getDisplayCategoryIds().then(data => data.data);
					Ids = shownIds.Ids;
				} catch (e) {
					console.log(e);
				}
			},
			async fetchArticles() {
				// 首先获取显示类目的ID
				try {
					let queryObj = {
						per_page: 10,
						orderby: "date",
						order: "desc",
						page: page
					};

					if (Ids) {
						queryObj.categories = Ids;
					}
					this.isLoading = true;
					const res = await http.getArticleList(queryObj).then(data => data.data);
					this.isLoading = false;
					if (Array.isArray(res)) {
						this.postsList = this.postsList.concat(res);
						page++;
					} else if (res.code == "rest_post_invalid_page_number") {
						this.isLastPage = true;
						console.log("最后一页了");
					}

				} catch (e) {
					console.log(e);
				}
			}
		}
	};
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>

<style lang="scss" scoped>
	// 顶部幻灯片部分
	.swiper-wrap {
		height: 350rpx;

		.swiper-item {
			position: relative;
			display: flex;
		}

		.image {
			flex: 1;
		}

		.swiper-mask {
			width: 100%;
			height: 150rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
		}

		.swiper-desc {
			width: 100%;
			position: absolute;
			bottom: 40rpx;
			left: 0;
			color: #ffffff;
			font-weight: bold;
			text-align: center;
		}
	}

	// 搜索框部分
	.search-box {
		display: flex;
		flex-direction: row;
		background-color: #f5f7f7;
		padding: 24rpx;

		.search-button {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			border: none;
			background-color: #fff;
			border-bottom-left-radius: 0;
			border-top-left-radius: 0;
			border-top-right-radius: 4px;
			border-bottom-right-radius: 4px;

			&::after {
				border: none;
			}
		}

		.search-input {
			flex: 9;
			background-color: #fff;
			padding: 32rpx 0 32rpx 32rpx;
			font-size: 30rpx;
			border-bottom-left-radius: 4px;
			border-top-left-radius: 4px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}

	// 顶部导航
	.nav-wrap {
		// border-bottom: 20rpx solid #F5F7F7;

		.nav-title {
			display: flex;
			justify-content: space-between;
			margin: 30rpx 30rpx 0 30rpx;

			.left {
				display: flex;
				align-items: center;
				font-size: 30rpx;
			}

			.right {
				display: flex;
				align-items: center;
				font-size: 25rpx;
				color: #959595
			}
		}

		.nav-content {
			display: flex;
			margin: 20rpx;
			flex-wrap: nowrap;

			.nav-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 140rpx;
				margin-right: 15rpx;

				image {
					width: 100rpx;
					height: 100rpx;
				}

				text {
					height: 80rpx;
					font-size: 25rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				// &:last-child {
				// 	margin-right: 0;
				// }
			}
		}
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.articles-top {
		margin: 30rpx 30rpx;
		font-size: 30rpx;
	}
</style>
