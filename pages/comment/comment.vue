<template>
	<view class="wrap">
		<view class="search_box">
			<view class="topic-list-item">
				<image mode="aspectFill" src="/static/bg-list.jpg" class="cover"></image>
				<view class="topic-item-content">
					<view class="topic-content-brief">
						<text>我的评论</text>
					</view>
				</view>
			</view>
		</view>

		<view class="empty" v-if="commentsList.length == 0">
			<u-empty text="尚未评论" mode="message"></u-empty>
		</view>

		<view v-else class="comment-item " :class="item.isHover ? 'u-cell-hover' : ''"
			v-for="(item, index) in commentsList" :key="index" @longpress="popDelete(item.id)" @tap="redirect({
					type: 'apppage',
					path: '/pages/post/post?id=' + item.post
				})" hover-class="u-cell-hover">
			<view class="commmet-user">
				<view class="comment-avatar">
					<image :src="item.author_avatar_urls[24]" mode="aspectFill" class="image"></image>
				</view>
				<view class="comment-info">
					<view class="comment-author">
						{{item.author_name}}
					</view>
					<view class="comment-date">
						{{item.date}}
					</view>
				</view>
			</view>
			<view class="comment-content">
				<rich-text :nodes="item.content.rendered"></rich-text>
			</view>

			<view class="comment-article">
				原文：「{{item.post_title}}」
			</view>
		</view>

		<app-footer></app-footer>
	</view>

</template>

<script>
	import http from "../../utils/http.js";
	import * as unip from "../../utils/uniPromisify.js";
	let page = 1;

	export default {
		data() {
			return {
				commentsList: []
			};
		},
		onLoad() {
			this.fetchComment();
		},
		methods: {
			fetchComment() {
				http.getMyComments(this.$store.state.authStore.token).then(data => data.data).then(res => {
					if (res.status == "200") {
						const commentsList = res.data;
						this.commentsList = commentsList.map(item => {
							item.date = this.$u.timeFormat(item.date, "yyyy-mm-dd hh:MM");
							item.author_avatar_urls = {
								"24": this.$store.state.authStore.userInfo.avatarUrl
							};
							item.author_name = this.$store.state.authStore.userInfo.nickname;
							item.content = {
								rendered: item.comment_content
							};
							return item;
						});
					}
				});

			},
			popDelete(id) {
				unip.showActionSheet({
					itemList: ["删除评论"]
				}).then(data => {
					if (data.tapIndex == 0) {
						http.deleteMyComment(id, this.$store.state.authStore.token).then(res => {
							if (res.statusCode === 200) {
								uni.showToast({
									title: "删除成功"
								});
								this.commentsList = [];
								page = 1;
								this.fetchComment();

							} else {
								uni.showToast({
									title: "删除失败"
								});
							}
						});


					}
				}).catch(e => {
					console.log("取消选中菜单");
				});
			}
		}
	};
</script>

<style lang="scss">
	.wrap {
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

		.comment-item {
			padding: 30rpx 30rpx 0;

			.commmet-user {
				display: flex;

				.comment-avatar {
					.image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 1rem;
					}
				}

				.comment-info {
					margin-left: 30rpx;
					height: 80rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.comment-author {
						font-size: 30rpx;
					}

					.comment-date {
						font-size: 23rpx;
						color: #A3A3A3;
					}
				}

			}

			.comment-content {
				margin-left: 110rpx;
				margin-top: 15rpx;
			}

			.comment-article {
				margin-left: 110rpx;
				margin-top: 15rpx;
				background-color: #F9FAFB;
				padding: 15rpx;
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
