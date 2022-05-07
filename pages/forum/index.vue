<template>
	<view>
		<u-navbar :safeAreaInsetTop="true" :placeholder="true" :border="true">
			<view slot="left">
				<!-- 若编译环境为小程序，让出最右侧胶囊位置 -->
				<!-- #ifdef MP -->
				<view style="width: 500rpx">
					<u-tabs :list="categories" @click="switchCategory"></u-tabs>
				</view>
				<!-- 编译环境为H5或者APP，按完全宽度显示 -->
				<!-- #endif -->
				<!-- #ifndef MP-->
				<view>
					<u-tabs :list="categories" @click="switchCategory"></u-tabs>
				</view>
				<!-- #endif -->
			</view>
		</u-navbar>

		<view class="list" v-if="page !== 1 || (isLoading && !isNetworkError)">
			<!-- 超级置顶 -->
			<view class="sticky" v-for="(item, index) in super_stickies" :key="item.id" @tap="goToTopic(item.id)">
				<image :src="item.all_img[0]" v-if="item.all_img.length !== 0" mode="aspectFill" class="image"></image>
				<view class="title">
					<view style="display: inline-flex;">
						<u-tag text="置顶" type="error" plain plainFill size="mini"></u-tag>
					</view>
					<text style="margin-left:20rpx">{{ item.title }}</text>
				</view>
			</view>

			<!-- 普通置顶 -->
			<view class="sticky" v-for="(item, index) in stickies" :key="item.id" @tap="goToTopic(item.id)">
				<image :src="item.all_img[0]" v-if="item.all_img.length !== 0" mode="aspectFill" class="image"></image>
				<div class="title">
					<view style="display: inline-flex;">
						<u-tag text="置顶" type="error" plain plainFill size="mini"></u-tag>
					</view>
					<text style="margin-left:20rpx">{{ item.title }}</text>
				</div>
			</view>

			<!-- 普通帖子 -->
			<view class="topic" v-for="(item, index) in topics" :key="item.id" @tap="goToTopic(item)">
				<view class="info">
					<u-avatar shape="square" :src="item.author_avatar" size="40"></u-avatar>
					<view class="right">
						<view class="name">{{ item.author_name }}</view>
						<view class="date">{{ item.post_date }}</view>
					</view>
				</view>
				<view class="content">
					<view class="text">{{ item.excerpt }}</view>
					<view class="images">
						<u-album :urls="item.all_img" multipleSize="205rpx" singleSize="400rpx"></u-album>
					</view>
					<view class="buttons">
						<u-button class="item heart" type="default" @tap.native.stop="likeTopic(item)">
							<u-icon :name="item.is_user_favorite ? 'heart-fill' : 'heart'"
								:color="item.is_user_favorite ? '#D54529' : '#636363'" size="18"></u-icon>
							<text
								:style="{ color: item.is_user_favorite ? '#D54529' : '#636363' }">{{ item.like_count }}</text>
						</u-button>
						<u-button class="item chat" type="default">
							<u-icon name="chat" color="#636363" size="18"></u-icon>
							<text>{{ item.reply_count }}</text>
						</u-button>
						<u-button class="item forward" type="default" @tap.native.stop="forwardTopic(item.id)">
							<u-icon name="share-square" color="#636363" size="18"></u-icon>
							<text>分享</text>
						</u-button>
					</view>
				</view>
			</view>
		</view>

		<view class="skeleton" v-if="isLoading && page == 1">
			<view class="item">
				<u-skeleton rows="4" title loading rowsWidth="95%" avatar></u-skeleton>
			</view>
			<view class="item">
				<u-skeleton rows="4" title loading rowsWidth="95%" avatar></u-skeleton>
			</view>
			<view class="item">
				<u-skeleton rows="4" title loading rowsWidth="95%" avatar></u-skeleton>
			</view>
		</view>

		<view class="error" v-if="!isLoading && isNetworkError">
			<u-empty icon="/static/network-error.png" text="网络连接失败"></u-empty>
		</view>

		<app-footer v-if="!isNetworkError" />

		<!-- 发布按钮 -->
		<view class="add" v-if="!isLoading && !isNetworkError">
			<button class="button" color="#118fff" @tap="goToPublish">
				<image class="img" src="../../static/add.png" mode="scaleToFill"></image>
			</button>
		</view>
	</view>
</template>
<script>
	import http from "../../utils/http.js";

	let tempTopic = {};

	export default {
		data() {
			return {
				isLoading: true,
				categories: [],
				super_stickies: [],
				stickies: [],
				topics: [],
				total_pages: 1,
				currentCategoryId: 0,
				isNetworkError: false,
				page: 1
			};
		},
		methods: {
			async switchCategory({ id: categoryId }) {
				this.currentCategoryId = categoryId;
				this.refreshPostList();
			},
			async refreshPostList() {
				this.page = 1;
				this.total_pages = 1;
				this.super_stickies = [];
				this.stickies = [];
				this.topics = [];
				await this.fetchPostList(this.currentCategoryId);
			},
			async fetchPostList(id) {
				if (this.page > this.total_pages) {
					return;
				}
				try {
					this.isLoading = true;
					this.isNetworkError = false;
					const { topics, super_stickies, stickies, total_pages } = await http
						.getForumTopicList({
							id,
							page: this.page,
							per_page: 10
						})
						.then(data => data.data);
					this.topics = [...this.topics, ...topics];
					this.super_stickies = super_stickies;
					this.stickies = stickies;
					this.total_pages = total_pages;
					this.page++;
				} catch (e) {
					console.error(e);
					this.isNetworkError = true;
				} finally {
					this.isLoading = false;
				}
			},
			goToTopic(item) {
				const { id } = item;
				this.redirect({ type: "apppage", path: "./post?id=" + id });
				tempTopic = item;
			},
			forwardTopic(id) {
				console.log(id);
			},
			likeTopic(item) {
				// 判断用户是否登录
				if (!this.$store.state.authStore.token) {
					uni.showToast({
						title: "请先登录",
						icon: "error",
						duration: 1000
					});

					setTimeout(() => {
						uni.navigateTo({
							url: "../login/login"
						});
					}, 1000);
					return;
				}

				const { id, is_user_favorite } = item;
				if (is_user_favorite) {
					// 取消该文章点赞
					item.is_user_favorite = false;
					item.like_count -= 1;
				} else {
					// 给该文章点赞
					item.is_user_favorite = true;
					item.like_count += 1;
				}
				try {
					http.forumPostLike({ id, isLike: item.is_user_favorite });
				} catch (e) {
					console.error(e);
				}
			},
			goToPublish() {
				if (!this.$store.state.authStore.isLogin) {
					uni.navigateTo({
						url: "../login/login"
					});
				} else {
					this.redirect({ type: "apppage", path: "./publish" });
				}
			}
		},
		async onLoad() {
			try {
				let categories = await http.getForumCategories().then(data => data.data);
				categories = categories.sort((a, b) => b.order - a.order); // 按order排序
				this.categories = categories;
				if (categories.length === 0) return;
				let { id } = categories[0];
				this.currentCategoryId = id;
				this.fetchPostList(id);
			} catch (e) {
				console.error(e);
				this.isNetworkError = true;
				this.isLoading = false;
			}

			uni.$on("forumLike", ({ is_user_favorite, like_count }) => {
				tempTopic.is_user_favorite = is_user_favorite;
				tempTopic.like_count = like_count;
			});
			uni.$on("forumListRefresh", () => {
				this.refreshPostList();
			});
		},
		onReachBottom() {
			if (this.currentCategoryId === 0) {
				return;
			}
			this.fetchPostList(this.currentCategoryId);
		},
		onUnload() {
			uni.$off("forumLike");
			uni.$off("forumListRefresh");
		},
		async onPullDownRefresh() {
			await this.refreshPostList();
			uni.stopPullDownRefresh();
		}
	};
</script>

<style lang="scss" scope>
	page {
		background-color: #f4f7f6;
	}

	.top-tabs {
		background-color: #ffffff;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	}

	.list {
		margin-top: 20rpx;
		padding: 0 20rpx;

		.sticky {
			padding: 30rpx 30rpx;
			display: flex;
			background-color: #ffffff;
			position: relative;
			margin-bottom: 30rpx;
			border-radius: 10rpx;
			// box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.05);

			.image {
				width: 200rpx;
				height: 150rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}

			.title {
				flex: 1;
				line-height: 45rpx;
				font-size: 30rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}

			.sticky-label {
				margin-right: 20rpx;
			}
		}

		.topic {
			padding: 30rpx 30rpx 10rpx;
			background-color: #ffffff;
			position: relative;
			margin-bottom: 30rpx;
			border-radius: 10rpx;
			// box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.05);

			.info {
				display: flex;

				.avatar {
					width: 50rpx;
					height: 50rpx;
				}

				.right {
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.name {
						font-size: 30rpx;
						font-weight: bold;
					}

					.date {
						font-size: 25rpx;
					}
				}
			}

			.content {
				margin-top: 20rpx;

				.text {
					line-height: 45rpx;
					font-size: 30rpx;
				}

				.images {
					margin-top: 20rpx;
				}

				.buttons {
					margin-top: 30rpx;
					display: flex;
					justify-content: space-around;
					color: #636363;
					font-size: 25rpx;

					.item {
						display: flex;
						height: 80rpx;

						text {
							margin-left: 5rpx;
						}
					}
				}
			}
		}
	}

	.skeleton {
		margin: 20rpx 20rpx;

		.item {
			margin-bottom: 30rpx;
			padding: 30rpx 30rpx 10rpx;
			background-color: #ffffff;
			padding: 30rpx;
			border-radius: 10rpx;
		}
	}

	.add::v-deep {
		position: fixed;
		right: 30rpx;
		/* #ifdef H5 */
		bottom: 180rpx;
		/* #endif */
		/* #ifndef H5 */
		bottom: 40rpx;
		/* #endif */
		width: 100rpx;
		height: 100rpx;
		box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.02), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
		border-radius: 50%;
		overflow: hidden;

		.button {
			height: 100% !important;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 !important;
			background: #118fff;

			&:active {
				background: #0c6abc;
			}

			.img {
				height: 80%;
				width: 80%;
			}
		}
	}
</style>
