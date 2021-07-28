<template>
	<view class="">
		<view class="wrap" v-show="!isLoading">
			<view class="title">
				{{article.title.rendered}}
			</view>

			<!-- 文章内容 -->
			<view class="content">
				<!-- <u-parse :html="article.content.rendered" :tag-style="style" :selectable="true" @ready="articleReady"></u-parse> -->
				<mp-html :content="article.content.rendered" :selectable="true" @ready="articleReady"
					:tag-style="style"></mp-html>
			</view>

			<!-- 底部版权 -->
			<view class="footer">
				<app-footer></app-footer>
			</view>
		</view>

		<!-- 加载图 -->
		<view v-if="isLoading" class="loading-wrap">
			<image class="loading" src="../../static/loading.gif" mode="aspectFill"></image>
		</view>

	</view>
</template>

<script>
	import http from "../../utils/http.js";
	import config from "../../utils/config.js";

	// 评论页数
	let page = 1;

	export default {
		data() {
			return {
				pageId: undefined,
				isLoading: false,
				article: {
					title: {
						rendered: ""
					},
					date: "",
					content: {
						rendered: ""
					},
					avatarurls: [],
					comment_status: ""
				},
				style: {
					"img": `margin-bottom: 30rpx`,
					"p": `font-size: 28rpx;
						  margin-bottom: 10rpx;
					`,
					"li": `font-size: 28rpx`,
					"h1": `margin-bottom: 20rpx;
						font-size: 36rpx;
						border-left: 8rpx solid red;
						background-color: #F6F6F6;
						padding-left : 30rpx
						`,
					"h2": `margin-bottom: 20rpx;
						font-size: 34rpx;
						border-left: 8rpx solid green;
						background-color: #F6F6F6;
						padding-left : 30rpx
						`,
					"h3": `margin-bottom: 20rpx;
							font-size: 32rpx;
							border-left: 8rpx solid orange;
							background-color: #F6F6F6;
							padding-left : 30rpx
							`,
					"h4": `margin-bottom: 20rpx;
							font-size: 30rpx;
							border-left: 8rpx solid blue;
							background-color: #F6F6F6;
							padding-left : 30rpx
							`,
					"code": `font-family : Consolas;
							font-size: 30rpx;
							`
				},

			};
		},
		async onLoad(option) {
			// #ifdef MP-QQ
			qq.showShareMenu({
				showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
			});
			// #endif
			if (!option.id) return;
			this.isLoading = true;
			const pageId = option.id;
			this.pageId = pageId;
			try {
				let article = await http.getPageDetail(pageId).then(data => data.data);
				this.article = article;
			} catch (e) {
				console.log(e);
			}
		},
		onShareAppMessage(res) {
			return {
				title: `分享「${config.WEBSITE_NAME}」的文章：${this.article.title.rendered}`,
				path: 'pages/post/post?id=' + this.pageId,
				imageUrl: this.article.post_full_image,
			}
		},
		onShareTimeline() {
			return {
				title: this.article.title.rendered,
				query: {
					id: this.pageId
				},
				imageUrl: this.article.post_full_image
			}
		},
		methods: {
			// 文章加载完毕回调
			articleReady(args) {
				this.isLoading = false;
			}

		}
	};
</script>

<style lang="scss" scoped>
	.loading-wrap {
		display: flex;
		justify-content: center;
		padding: 300rpx 0;

		.loading {
			width: 600rpx;
			height: 420rpx;
			display: block;
		}
	}

	.wrap {
		margin: 30rpx;

		.title {
			font-size: 40rpx;
			font-weight: bold;
			text-align: center;
		}

		.content {
			margin-top: 30rpx;
			font-size: 35rpx;
			line-height: 2;
		}
	}
</style>
