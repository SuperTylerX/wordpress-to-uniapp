<template>
	<view class="">
		<view class="wrap" v-show="!isLoading">
			<view class="title">
				{{article.title.rendered}}
			</view>

			<!-- 文章内容 -->
			<view class="content">
				<!-- <u-parse :html="article.content.rendered" :tag-style="style" :selectable="true" @ready="articleReady"></u-parse> -->
				<mp-html :content="article.content.rendered" :selectable="true" @ready="articleReady"></mp-html>
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
				}
			};
		},
		async onLoad(option) {
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
