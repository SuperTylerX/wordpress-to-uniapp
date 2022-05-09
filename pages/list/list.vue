<template>
	<view>
		<!-- 文章分类 -->
		<view class="topic-common-list" v-if="isCategoryPage">
			<view class="topic-list-item">
				<image :src="cover" class="cover" mode="aspectFill"></image>
				<view class="topic-item-content">
					<view class="topic-content-brief">
						<text>{{category.description}}</text>
					</view>
					<view class="topic-content-num">
						<text>共有 {{category.count}} 篇文章</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 标签列表 -->
		<view class="topic-common-list" v-if="isTagPage">
			<view class="topic-list-item">
				<image :src="cover" class="cover" mode="aspectFill"></image>
				<view class="topic-item-content">
					<view class="topic-content-brief">
						<text>#{{tag.name}}</text>
					</view>
					<view class="topic-content-num">
						<text>共收录 {{tag.count}} 篇文章</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 搜索 -->
		<view class="search_box" v-if="isSearchPage">
			<view class="topic-list-item">
				<image mode="aspectFill" src="/static/bg-search.jpg" class="cover"></image>
				<view class="topic-item-content">
					<view class="topic-content-brief">
						<text>关于“{{searchKey}}”的搜索结果</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 阅读历史 -->
		<view class="search_box" v-if="isHistoryPage">
			<view class="topic-list-item">
				<image mode="aspectFill" src="/static/bg-list.jpg" class="cover"></image>
				<view class="topic-item-content">
					<view class="topic-content-brief">
						<text>阅读历史</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 收藏文章 -->
		<view class="search_box" v-if="isLikePage">
			<view class="topic-list-item">
				<image mode="aspectFill" src="/static/bg-list.jpg" class="cover"></image>
				<view class="topic-item-content">
					<view class="topic-content-brief">
						<text>点赞文章</text>
					</view>
				</view>
			</view>
		</view>


		<!-- 无网络状态 -->
		<!-- 	<view class="showerror" v-if="showerror">
			<image src="/static/images/fail_nowifi.png" style="height:100rpx;width:100rpx"></image>
			<view class="errortext">
				<view>暂时无法访问网络</view>
				<view>
					<button class="more-button" @tap="reload" size="mini">重新加载</button>
				</view>
			</view>
		</view> -->

		<!-- 文章列表 -->
		<view class="" style="padding-top: 20rpx;">
			<app-list :postsList="postsList"></app-list>
			<!-- <u-divider half-width="30" height="80"> 空空如也 </u-divider> -->
			<view class="empty" v-if="postsList.length == 0">
				<u-empty :text="text" :mode="mode"></u-empty>
			</view>
		</view>



		<!-- 版权 -->
		<app-footer></app-footer>
	</view>
</template>

<script>
	import * as http from "../../utils/http.js";

	let page = 1;

	export default {
		data() {
			return {
				isCategoryPage: false,
				isTagPage: false,
				isSearchPage: false,
				isHistoryPage: false,
				isLikePage: false,

				isLastPage: false,
				postsList: [],
				cover: "/static/bg-list.jpg",

				// 搜索页面
				searchKey: "",

				// 分类页面
				categoryID: undefined,
				category: {
					description: "",
					name: "",
					count: 0
				},

				// 标签页面
				TagID: undefined,
				tag: {
					name: "",
					count: 0
				}

			};
		},
		computed: {
			mode() {
				if (this.isCategoryPage || this.isTagPage || this.isHistoryPage || this.isLikePage) {
					return "list";
				} else if (this.isSearchPage) {
					return "search";
				}
			},
			text() {
				if (this.isCategoryPage || this.isTagPage || this.isHistoryPage || this.isLikePage) {
					return "空空如也";
				} else if (this.isSearchPage) {
					return "搜索结果为空";
				}
			}
		},
		onLoad(options) {
			page = 1;
			// 如果是搜索页
			if (options.search) {
				uni.setNavigationBarTitle({
					title: "搜索"
				});
				this.isSearchPage = true;
				this.searchKey = options.search;
			} else if (options.categoryID) {
				this.categoryID = options.categoryID;
				this.isCategoryPage = true;
				this.getCategoryMeta();
			} else if (options.tagID) {
				this.tagID = options.tagID;
				this.isTagPage = true;
				this.getTagMeta();
			} else if (options.history) {
				this.isHistoryPage = true;
				const postsList = uni.getStorageSync("history") || [];
				this.postsList = postsList;
				return;
			} else if (options.like) {
				this.isLikePage = true;
				this.fetchLikePosts();
				return;
			}

			this.fetchPosts();

		},
		async onPullDownRefresh() {
			if (this.isHistoryPage) {
				uni.stopPullDownRefresh();
				return;
			}
			page = 1;
			this.postsList = [];
			this.isLastPage = false;
			if (this.isLikePage) {
				await this.fetchLikePosts();
				uni.stopPullDownRefresh();
				return;
			}
			await this.fetchPosts();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.isLastPage) return;
			if (this.isHistoryPage || this.isLikePage) return;
			this.fetchPosts();
		},
		methods: {
			async fetchPosts() {

				const queryObj = {
					per_page: 10,
					orderby: "date",
					order: "desc",
					page
				};

				if (this.searchKey) {
					queryObj.search = this.searchKey;
				} else if (this.categoryID) {
					queryObj.categories = this.categoryID;
				} else if (this.tagID) {
					queryObj.tags = this.tagID;
				}

				const res = await http.getArticleList(queryObj);
				if (res.statusCode == 200) {
					const postsList = res.data;
					this.postsList = this.postsList.concat(postsList);
					page++;
				} else {
					if (res.statusCode == 400 && res.data.code == "rest_post_invalid_page_number") {
						this.isLastPage = true;
					}
				}

			},
			async getCategoryMeta() {
				http.getCategoryMeta(this.categoryID).then(data => data.data).then(res => {
					this.category.description = res.description;
					this.category.name = res.name;
					this.category.count = res.count;
					if (res.category_thumbnail_image) {
						this.cover = res.category_thumbnail_image;
					}

					uni.setNavigationBarTitle({
						title: this.category.name
					});
				});
			},
			async getTagMeta() {
				http.getTagMeta(this.tagID).then(data => data.data).then(res => {
					this.tag.name = res.name;
					this.tag.count = res.count;
					// 	if (res.category_thumbnail_image) {
					// 		this.cover = res.category_thumbnail_image
					// 	}
					uni.setNavigationBarTitle({
						title: this.tag.name
					});
				});
			},
			async fetchLikePosts() {
				try {
					const res = await http.getLikePosts(this.$store.state.authStore.token).then(data => data.data);
					if (res.status == 200) {
						this.postsList = this.postsList.concat(res.data.map(item => {
							item.title = {
								rendered: item.title
							};
							return item;
						}));
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	};
</script>

<style lang="scss">
	.topic-list-item {
		position: relative;
		overflow: hidden;
		background: #f4f6f9;

		.cover {
			display: block;
			width: 100%;
			height: 240rpx;
			filter: brightness(88%);
		}

		.topic-item-content {
			position: absolute;
			z-index: 2;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			vertical-align: middle;
			width: 90%;

			.topic-content-brief {
				font-size: 30rpx;
				font-weight: 500;
				line-height: 1.4;
				color: #fff;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				margin-bottom: 16rpx;
			}

			.topic-content-num {
				font-size: 24rpx;
				line-height: 24rpx;
				color: #fff;
				margin-bottom: 24rpx;
			}
		}

	}

	.empty {
		height: 60vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
