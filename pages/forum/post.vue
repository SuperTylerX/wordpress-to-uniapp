<template>
	<view>
		<u-navbar class="nav-bar" title="圈子" :safeAreaInsetTop="true" :placeholder="true" @leftClick="leftClick"
			:border="true"></u-navbar>
		<view class="skeleton" v-if="isLoading">
			<u-skeleton class="item" title loading rowsWidth="95%" avatar></u-skeleton>
			<u-skeleton class="item" rows="10" loading></u-skeleton>
		</view>
		<view class="wrap" v-show="!isLoading" @tap="resetMyComment">
			<view class="info">
				<u-avatar shape="square" :src="post.author_avatar" size="40"></u-avatar>
				<view class="right">
					<view class="name">{{ post.author_name }}</view>
					<view class="date">{{ post.post_date }}</view>
				</view>
			</view>
			<view class="content">
				<mp-html :content="post.content" :tag-style="style" :selectable="true" @ready="isLoading = false">
				</mp-html>
			</view>

			<!-- 标签 -->
			<view class="tags">
				<view class="tag-item" v-for="(item, index) in post.tags" :key="item.id">
					<u-tag :text="`#${item.name}`" type="error" plain plainFill></u-tag>
				</view>
			</view>

			<view class="operation">
				<view class="views">阅读 {{ post.views }}</view>

				<view class="like" @tap="likePost">
					<!-- <u-icon :name="is_user_favorite ? 'thumb-up-fill' : 'thumb-up'" :color="is_user_favorite ? '#d10000' : '#828282'"
								size="22"></u-icon> -->
					<view class="heart" :class="{ 'is-active': post.is_user_favorite }"></view>
					<text
						:style="{ color: post.is_user_favorite ? '#d10000' : '#828282', marginLeft: '-25rpx' }">{{ post.like_count }}</text>
				</view>
			</view>

			<view class="seprateor"></view>
			<!-- 评论 -->
			<view class="comments-wrap" v-if="isCommentEnabled && post.status === 'publish'">
				<view class="top">
					<view class="subTitle">评论</view>
					<view class="right">
						<view class="item" :class="{ cur: order === 'desc' }" @tap="changeOrder('desc')">最新</view>
						<view class="item" :class="{ cur: order === 'asc' }" @tap="changeOrder('asc')">最早</view>
					</view>
				</view>
				<view class="subTitle-line"></view>
				<view class="comments-list">
					<view style="margin: 120rpx 190rpx" v-if="commentList.length == 0">
						<u-empty icon="/static/no-message.png" text="暂无评论"></u-empty>
					</view>

					<!-- 0级回复 -->
					<block v-for="(item, index) in commentList" :key="index">
						<view class="comment">
							<!-- 回复标题 -->
							<view class="comment-user" @tap.stop="replyTo(item)">
								<view class="comment-user-avatar">
									<image :src="item.author_avatar" class="avatarImg"></image>
								</view>
								<view class="comment-meta">
									<view class="comment-user-meta">
										<view class="name">{{ item.author_name }}</view>
										<view class="location">
											{{item.location ? `${item.location.country_name}${item.location.region_name}网友` : '' }}
										</view>
									</view>
									<view class="comment-date">{{ item.post_date }}</view>
								</view>
							</view>
							<!-- 回复内容 -->
							<view class="comment-summary" @tap.stop="replyTo(item)">{{ item.content }}</view>

							<!-- 一级回复-->
							<view v-for="(item1, idx) in item.child" :key="idx" class="comment-content-bottom">
								<view class="reply-user" @tap.stop="replyTo(item1)">
									<text class="comment-name">{{ item1.author_name }}</text>
									：{{ item1.content }}
								</view>

								<!-- 使用组件递归生成回复树 -->
								<app-reply :parent="item1" @replyTo="replyTo"></app-reply>
							</view>
							<!-- 一级回复-->
						</view>
					</block>
				</view>
			</view>

			<!-- 底部评论框 -->
			<form @submit="reply" class="comments-bottom-wrap" @tap.stop="" v-if="isCommentEnabled">
				<view class="cu-bar">
					<image class="cu-avatar" :src="avatarUrl" mode="aspectFill"></image>
					<input class="solid-bottom" maxlength="300" cursor-spacing="10" type="text" confirm-type="send"
						:placeholder="myComment.placeholder" v-model="myComment.content" />
					<button class="cu-btn bg-blue shadow-blur" formType="submit">发送</button>
				</view>
			</form>

			<!-- 底部版权 -->
			<view class="footer">
				<app-footer></app-footer>
			</view>
		</view>
	</view>
</template>

<script>
	import { getForumTopicDetail, getForumTopicComment, postForumReply, forumPostLike } from "../../utils/http.js";
	import { getPlatform } from "@/utils/utils.js";

	let page = 1;

	export default {
		data() {
			return {
				id: 0,
				isLoading: true,
				post: {
					all_img: [],
					author_avatar: "",
					author_id: 0,
					author_name: "",
					content: "",
					enableComment: false,
					id: 0,
					is_sticky: false,
					is_super_sticky: false,
					post_date: "",
					reply_count: 0,
					title: "",
					views: 0,
					permalink: "",
					tags: [],
					like_count: 0,
					status: "publish",
					is_user_favorite: false
				},
				style: {
					img: "margin-bottom: 30rpx",
					p: `font-size: 30rpx;
					line-height: 1.5em;
						  margin-bottom: 10rpx;
					`,
					li: "font-size: 28rpx",
					h1: `margin-bottom: 20rpx;
						font-size: 36rpx;
						border-left: 8rpx solid red;
						background-color: #F6F6F6;
						padding-left : 30rpx
						`,
					h2: `margin-bottom: 20rpx;
						font-size: 34rpx;
						border-left: 8rpx solid green;
						background-color: #F6F6F6;
						padding-left : 30rpx
						`,
					h3: `margin-bottom: 20rpx;
							font-size: 32rpx;
							border-left: 8rpx solid orange;
							background-color: #F6F6F6;
							padding-left : 30rpx
							`,
					h4: `margin-bottom: 20rpx;
							font-size: 30rpx;
							border-left: 8rpx solid blue;
							background-color: #F6F6F6;
							padding-left : 30rpx
							`,
					code: `font-family : Consolas;
							font-size: 30rpx;
							`
				},
				isLastPage: false,
				commentList: [],
				myComment: {
					id: 0,
					userid: 0,
					placeholder: "评论...",
					content: ""
				},
				order: "desc"
			};
		},
		computed: {
			isLogin() {
				return this.$store.state.authStore.isLogin;
			},
			isCommentEnabled() {
				// #ifdef MP-QQ
				return this.$store.state.configStore.wf_enable_qq_comment_option == "1";
				// #endif
				// #ifdef MP-WEIXIN
				return this.$store.state.configStore.wf_enable_comment_option == "1";
				// #endif
				// #ifdef H5
				return this.$store.state.configStore.uni_enable_h5_comment_option;
				// #endif
				// #ifndef MP-QQ || MP-WEIXIN || H5
				return true;
				// #endif
			},
			avatarUrl() {
				if (this.isLogin) {
					return this.$store.state.authStore.userInfo.avatarUrl;
				} else {
					return "/static/gravatar.png";
				}
			}
		},
		methods: {
			async fetchPostDetail() {
				try {
					this.post = await getForumTopicDetail(this.id).then(data => data.data);
					this.fetchPostReply();
				} catch (e) {
					console.error(e);
				}
			},
			async fetchPostReply() {
				if (this.isLastPage) return;

				const per_page = 10;
				try {
					// 获取评论
					const replies = await getForumTopicComment({ id: this.id, page, per_page, order: this.order })
						.then(data => data.data);
					this.commentList = [...this.commentList, ...replies];
					page++;
					if (replies < per_page) {
						this.isLastPage = true;
					}
				} catch (e) {
					console.error(e);
				}
			},
			likePost() {
				// 判断用户是否登录
				if (!this.$store.state.authStore.token) {
					uni.showToast({
						title: "请先登录",
						icon: "none",
						position: "bottom"
					});

					setTimeout(() => {
						uni.navigateTo({
							url: "../login/login"
						});
					}, 1500);
					return;
				}

				if (this.post.is_user_favorite) {
					// 本来是喜欢，现在取消喜欢
					this.post.is_user_favorite = !this.post.is_user_favorite;
					this.post.like_count -= 1;
				} else {
					// 喜欢
					this.post.is_user_favorite = !this.post.is_user_favorite;
					this.post.like_count += 1;
				}
				try {
					forumPostLike({ id: this.id, isLike: this.post.is_user_favorite });

					uni.$emit("forumLike", {
						is_user_favorite: this.post.is_user_favorite,
						like_count: this.post.like_count
					});
				} catch (e) {
					console.error(e);
				}
			},
			leftClick() {
				const pages = getCurrentPages();
				if (pages[pages.length - 2] && pages[pages.length - 2].route === "pages/forum/index") {
					uni.navigateBack();
				} else {
					uni.switchTab({
						url: "../forum/index"
					});
				}
			},
			// 选择回复对象
			replyTo(e) {
				this.myComment = {
					id: e.id,
					userid: e.userid,
					placeholder: "回复：" + e.author_name,
					content: ""
				};
			},
			// 重置我的评论内容
			resetMyComment() {
				this.myComment = {
					id: 0,
					userid: 0,
					placeholder: "评论...",
					content: ""
				};
			},
			reset() {
				page = 1;
				this.commentList = [];
				this.isLastPage = false;
				this.resetMyComment();
			},
			// 提交评论
			async reply() {
				// 如果未登录，重定向至登录界面
				if (!this.$store.state.authStore.isLogin) {
					uni.navigateTo({
						url: "../login/login"
					});
					return;
				}

				//检查是否填写评论内容
				if (this.myComment.content.length === 0) {
					wx.showToast({
						title: "没有填写评论内容",
						icon: "none",
						duration: 2000
					});
					return;
				}

				const queryObj = {
					topic_id: this.id, //评论ID
					reply_to_id: this.myComment.id, //父评论ID
					content: this.myComment.content, // 评论内容，
					platform: getPlatform()
				};

				try {
					uni.showLoading({
						title: "评论提交中..."
					});
					const res = await postForumReply(queryObj).then(data => data.data);

					uni.hideLoading();
					uni.showToast({
						title: res.message,
						// #ifdef H5 || APP || MP-WEIXIN
						icon: "error",
						// #endif
						// #ifndef H5 || APP || MP-WEIXIN
						icon: "none",
						// #endif
						duration: 2000
					});
					this.reset();
					this.fetchPostReply();
				} catch (e) {
					console.error(e);
					uni.showToast({
						title: "发表失败",
						icon: "none",
						duration: 2000,
						position: "bottom"
					});
				}
			},
			changeOrder(order) {
				this.order = order;
				this.reset();
				this.fetchPostReply();
			}
		},
		onLoad({ id }) {
			if (!id) {
				return;
			}
			this.id = Number(id);
			this.reset();
			this.fetchPostDetail();
		},
		async onPullDownRefresh() {
			this.reset();
			await this.fetchPostDetail();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.fetchPostReply();
		}
	};
</script>

<style lang="scss" scope>
	.nav-bar {
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	}

	.skeleton {
		padding: 30rpx 30rpx;

		.item {
			margin-top: 30rpx;

			&:first-child {
				margin-top: 0;
			}
		}
	}

	.wrap {
		.info {
			display: flex;
			padding: 40rpx 30rpx;

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
			padding: 0 30rpx;
		}

		.tags {
			display: flex;
			flex-wrap: wrap;
			margin-top: 20rpx;
			padding: 0 30rpx;

			.tag-item {
				margin-right: 15rpx;
			}
		}

		.operation {
			margin-top: 40rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;

			.views {
				color: #828282;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 28rpx;
			}

			.like {
				display: flex;
				gap: 5rpx;
				color: #828282;
				align-items: center;
				font-size: 28rpx;
			}
		}

		.seprateor {
			height: 15rpx;
			background-color: #f4f7f6;
		}

		.heart {
			width: 100rpx;
			height: 100rpx;
			background: url('@/static/heart.png') no-repeat;
			background-size: 2900rpx 100rpx;
			background-position: 0 0;
			cursor: pointer;

			&.is-active {
				background-position: -2800rpx 0;
				transition: background-position 1s steps(28);
			}
		}

		// 评论
		.comments-wrap {
			padding: 0 30rpx;

			.comment {
				margin: 0 0 60rpx;

				/* 评论区用户名 */
				.comment-user {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 28rpx;
					color: #333;
				
					/* 评论用户头像 */
					.comment-user-avatar {
						position: relative;
				
						.avatarImg {
							border-radius: 16rpx;
							height: 64rpx;
							width: 64rpx;
							margin-right: 20rpx;
						}
					}
				
					/* 评论用户昵称 */
					.comment-meta {
						flex: 1;
						display: flex;
						justify-content: space-between;
						align-items: center;
				
						.comment-user-meta {
							font-weight: 500;
							flex: 1;
							line-height: 38rpx;
				
							.name {
								color: #118fff;
							}
				
							.location {
								color: #959595;
								font-weight: normal;
								font-size: 20rpx;
							}
						}

						/* 评论日期颜色 */
						.comment-date {
							color: #959595;
							font-size: 24rpx;
							line-height: 1.2;
							font-weight: normal;
							outline: none;
							color: #959595;
							width: 150rpx;
							text-align: right;
						}
					}
				}

				.comment-summary {
					color: #333;
					font-size: 30rpx;
					line-height: 1.8;
					margin-left: 80rpx;
					margin-bottom: 16rpx;
				}

				.comment-content-bottom {
					background-color: #f9fafb;
					margin-left: 80rpx;
					padding: 0 24rpx;

					&:nth-child(3) {
						padding-top: 24rpx;
					}

					&:last-child {
						padding-bottom: 24rpx;
					}

					.reply-user {
						font-size: 28rpx;
						line-height: 1.8;
						color: #333;
					}

					.comment-name {
						color: #118fff;
						font-weight: 500;
					}
				}
			}
		}

		// 底部评论
		.comments-bottom-wrap {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 100;
			background-color: white;
			box-shadow: 0 0 6px rgba(30, 20, 20, 0.1);

			.cu-bar {
				padding: 0 10px;
				display: flex;
				position: relative;
				align-items: center;
				min-height: 50px;
				justify-content: space-between;

				.cu-avatar {
					font-variant: small-caps;
					margin: 0;
					padding: 0;
					display: inline-flex;
					text-align: center;
					justify-content: center;
					align-items: center;
					color: var(--white);
					white-space: nowrap;
					position: relative;
					width: 32px;
					height: 32px;
					background-size: cover;
					background-position: center;
					vertical-align: middle;
					font-size: 1.5em;
					border-radius: 50%;
				}

				.solid-bottom {
					overflow: initial;
					line-height: 32px;
					height: 32px;
					min-height: 32px;
					flex: 1;
					font-size: 15px;
					margin: 0 10px;
					border-bottom: 1px solid rgba(0, 0, 0, 0.1);
				}

				.cu-btn {
					background-color: #0082ff;
					color: #ffffff;
					position: relative;
					border: 0px;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					padding: 0 15px;
					font-size: 14px;
					height: 32px;
					line-height: 1;
					text-align: center;
					text-decoration: none;
					overflow: visible;
					margin-left: initial;
					margin-right: initial;

					&::before {
						content: ' ';
						border: 1px solid rgba(0, 0, 0, 0.2);
						box-sizing: border-box;
						display: block;
						background: inherit;
						position: absolute;
						width: 100%;
						height: 100%;
						z-index: -1;
						transform-origin: 0 0;
						border-radius: inherit;
						transform: scale(1, 1);
						top: 2px;
						left: 2px;
						filter: blur(3px);
						opacity: 0.6;
					}
				}
			}
		}

		.top {
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #f4f7f6;

			.subTitle {
				font-size: 30rpx;
				padding: 20rpx 0;
			}

			.right {
				display: flex;
				justify-content: center;
				align-items: center;
				color: #959595;
				font-size: 23rpx;

				.item {
					margin-left: 40rpx;

					&.cur {
						color: #333;
					}

					&:last-child {
						position: relative;

						&:before {
							content: '';
							border-left: 1px solid #ccc;
							position: absolute;
							top: 8rpx;
							left: -20rpx;
							height: 20rpx;
						}
					}
				}
			}
		}

		.subTitle-line {
			position: relative;
			margin-bottom: 30rpx;

			&:before {
				content: '';
				position: absolute;
				width: 50rpx;
				height: 4rpx;
				background: #959595;
				position: absolute;
				top: -5rpx;
				left: 0;
			}
		}

		.footer {
			padding-bottom: 80rpx !important;
		}
	}

	.fixed-btns {
		position: fixed;
		bottom: 120rpx;
		right: 30rpx;

		.btn {
			width: 80rpx;
			height: 80rpx;
			border: 1px solid #d9d9d9;
			box-shadow: 5rpx 5rpx 19rpx #d9d9d9, -5rpx -5rpx 19rpx #ffffff;
			background-color: rgba($color: #fff, $alpha: 0.8);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 30rpx;
		}
	}
</style>
