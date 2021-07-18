<template>
	<view class="">
		<view class="wrap" v-show="!isLoading" @tap="resetComment">
			<view class="title">
				{{article.title.rendered}}
			</view>
			<view class="info">
				<u-icon class="icon" name="calendar" size="28"></u-icon>
				<text class="text">{{article.date.slice(0,10)}}</text>

				<u-icon class="icon" name="list-dot" size="28"></u-icon>
				<text class="text">{{article.category_name}}</text>

				<u-icon class="icon" name="chat" size="28"></u-icon>
				<text class="text">{{article.total_comments}}</text>

				<u-icon class="icon" name="thumb-up" size="28"></u-icon>
				<text class="text">{{article.like_count}}</text>

				<u-icon class="icon" name="eye" size="28"></u-icon>
				<text class="text">{{article.pageviews}}</text>
			</view>

			<!-- 文章内容 -->
			<view class="content">
				<!-- <u-parse :html="article.content.rendered" :tag-style="style" :selectable="true" @ready="articleReady"></u-parse> -->
				<mp-html :content="article.content.rendered" :tag-style="style" :selectable="true"
					@ready="articleReady"></mp-html>
			</view>

			<!-- 点赞 -->
			<view class="likes">
				<view class="button-wrap" @tap="likeHandler">
					<u-icon class="icon" name="thumb-up"></u-icon> 点个赞
				</view>
				<u-divider v-if="article.avatarurls.length !==0" half-width="30" height="80">共有
					{{article.avatarurls.length}} 人点赞
				</u-divider>
				<u-divider v-else half-width="30" height="80"> 还没有人点赞 </u-divider>
				<view class="avatar-wrap">
					<image class="avatar-item" :src="item.avatarurl" v-for="(item, index) in article.avatarurls"
						:key="index" mode="aspectFill"></image>
				</view>
			</view>

			<!-- 标签 -->
			<view class="tags">
				<u-tag class="tag-item" :text="`#${item.name}`" type="error" mode="light" v-for="(item,index) in tags"
					@tap="redirect({ 'type': 'apppage',
					path : '/pages/list/list?tagID=' + item.id } )" :key="index"></u-tag>
			</view>

			<!-- 猜你喜欢 -->
			<view class="relatedPost-wrap" v-if="relatedPost.length !== 0">
				<view class="subTitle">猜你喜欢</view>
				<view class="subTitle-line"></view>
				<view class="relatedPost-list">
					<view class="item" v-for="(item,index) in relatedPost" :key="index" @tap="redirect({ 'type': 'apppage',
					path : '/pages/post/post?id=' + item.id} )">
						<image class="item-image" :src="item.post_medium_image" mode="aspectFill"></image>
						<text class="item-title"> {{item.title.rendered}}</text>
					</view>
				</view>
			</view>

			<!-- 评论 -->
			<view class="comments-wrap" v-if="isCommentEnabled">
				<view class="subTitle">评论</view>
				<view class="subTitle-line"></view>
				<view class="comments-list">

					<u-divider v-if="commentsList.length == 0" half-width="30" height="160">暂无评论</u-divider>
					<!-- 0级回复 -->
					<block v-for="(item, index) in commentsList" :key="index">
						<view class="comment">

							<!-- 回复标题 -->
							<view class="comment-user" @tap.stop="replyTo(item)">
								<view class="comment-user-gravatar">
									<image :src="item.author_url" class="gravatarImg"></image>
								</view>
								<view class="comment-user-name">
									<view class="comment-name">{{item.author_name}}</view>
									<view class="comment-date">{{item.date}}</view>
								</view>
							</view>
							<!-- 回复内容 -->
							<view class="comment-summary" @tap.stop="replyTo(item)">
								{{item.content}}
							</view>

							<!-- 一级回复-->
							<view v-for="(item1, idx) in item.child" :key="idx" class="comment-content-bottom">
								<view class="reply-user" @tap.stop="replyTo(item1)">
									<text class="comment-name">{{item1.author_name}}</text>
									回复
									<text class="comment-name">{{item.author_name}}</text>
									：{{item1.content}}
								</view>


								<!-- 二级回复-->
								<view v-for="(item2, idx) in item1.child" :key="idx">
									<view class="reply-user" @tap.stop="replyTo(item2)">
										<text class="comment-name">{{item2.author_name}}</text>
										回复
										<text class="comment-name">{{item1.author_name}}</text>
										：{{item2.content}}
									</view>

									<!-- 三级回复-->
									<view v-for="(item3, idx) in item2.child" :key="idx">
										<view class="reply-user" @tap.stop="replyTo(item3)">
											<text class="comment-name">{{item3.author_name}}</text>
											回复
											<text class="comment-name">{{item2.author_name}}</text>
											：{{item3.content}}
										</view>

										<!-- 四级回复-->
										<view v-for="(item4, idx) in item3.child" :key="idx">
											<view class="reply-user" @tap.stop="replyTo(item4)">
												<text class="comment-name">{{item4.author_name}}</text>
												回复<text class="comment-name">{{item3.author_name}}</text>
												：{{item4.content}}
											</view>
										</view>
										<!-- 四级回复-->

									</view>
									<!-- 三级回复-->

								</view>
								<!-- 二级回复-->

							</view>
							<!-- 一级回复-->

						</view>
					</block>
				</view>
			</view>

			<!-- 底部评论框 -->
			<form @submit="reply" class="comments-bottom-wrap" @tap.stop=""
				v-if="isCommentEnabled && article.comment_status == 'open'">
				<view class="cu-bar">
					<image class="cu-avatar" :src="avatarUrl" mode="aspectFill"></image>
					<input class="solid-bottom" maxlength="300" cursor-spacing="10" type="text" confirm-type="send"
						:placeholder="myComment.placeholder" v-model="myComment.content"></input>
					<button class="cu-btn bg-blue shadow-blur" formType="submit">发送</button>
				</view>
			</form>

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
				postId: undefined,
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
				tags: [],
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
					"code": `color: red;
							background-color: #F8F8F8;
							padding: 0 10rpx;
							font-family : Consolas;
							font-size: 30rpx;
							`,
					// "pre": `color: red;
					// 		background-color: #F8F8F8;
					// 		border: 1px solid #FFFFFF;
					// 		padding: 0 10rpx;
					// 		font-family : Consolas;
					// 		font-size: 30rpx
					// 		`

				},
				relatedPost: [],
				commentsList: [],
				isLastPage: false, //评论是否到最后一页,
				myComment: {
					id: 0,
					userid: 0,
					placeholder: "评论...",
					content: ""
				}
			};
		},
		computed: {
			isLogin() {
				return this.$store.state.authStore.isLogin;
			},
			avatarUrl() {
				if (this.isLogin) {
					return this.$store.state.authStore.userInfo.avatarUrl;
				} else {
					return "/static/gravatar.png";
				}
			},
			isCommentEnabled() {
				return this.$store.state.configStore.wf_enable_comment_option == "1";
			}
		},
		async onLoad(option) {
			if (!option.id) return;
			this.isLoading = true;
			const postId = option.id;
			this.postId = postId;
			try {
				let article = await http.getPostDetail(postId).then(data => data.data);
				this.article = article;
				// 添加到阅读历史
				let history = uni.getStorageSync("history") || [];
				// 删去已有的
				history = history.filter(item => item.id !== postId);
				// 添加自己
				history.unshift({
					id: postId,
					post_medium_image: article.post_medium_image,
					title: article.title,
					date: article.date,
					total_comments: article.total_comments,
					like_count: article.like_count,
					pageviews: article.pageviews
				});
				// 去除超过20个的
				if (history.length > 20) {
					history = history.slice(0, 19);
				}
				uni.setStorageSync("history", history);

				// 获取文章标签
				http.getPostTag({ post: postId }).then(data => data.data).then(tags => {
					this.tags = tags;
				}).catch(e => {
					console.log(e);
				});

				// 获取猜你喜欢
				http.getGuessYouLike({
					per_page: 5,
					page: 1,
					exclude: postId,
					tags: article.tags.join(",")
				}).then(data => data.data).then(relatedPost => {
					this.relatedPost = relatedPost;
				}).catch(e => {
					console.log(e);
				});

				// 获取评论
				this.isLastPage = false;
				page = 1;
				this.fetchComments();
			} catch (e) {
				console.log(e);
			}
		},
		onReachBottom() {
			this.fetchComments();
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
			},
			// 拉取评论
			fetchComments() {
				if (this.isLastPage) return;

				http.getComments({
					postid: this.postId,
					limit: 10,
					page: page,
					order: "desc"
				}).then(data => data.data).then(data => {
					let commentsList = data.data.map(item => {
						return item;
					});
					if (commentsList.length < 10) {
						this.isLastPage = true;
					} else {
						page++;
					}
					this.commentsList = this.commentsList.concat(commentsList);
				}).catch(e => {
					console.log(e);
				});
			},
			// 选择回复对象
			replyTo(e) {
				this.myComment = {
					id: e.id,
					userid: e.userid,
					placeholder: "回复：" + e.author_name,
					content: ""
				};
				console.log(this.myComment);
			},
			// 重置我的评论内容
			resetComment() {
				this.myComment = {
					id: 0,
					userid: 0,
					placeholder: "评论...",
					content: ""
				};
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
					post: this.postId, //评论ID
					parent: this.myComment.id, //父评论ID
					content: this.myComment.content, // 评论内容
				};

				try {
					uni.showLoading({
						title: "评论提交中..."
					});
					const res = await http.postMyComment(queryObj, this.$store.state.authStore.token).then(data => data
						.data);


					if (res.status == 200) {
						uni.hideLoading();
						uni.showToast({
							title: res.message,
							icon: "none",
							duration: 2000
						});
						this.resetComment();
						page = 1;
						this.commentsList = [];
						this.isLastPage = false;
						this.fetchComments();

					} else {
						uni.showToast({
							title: "留言失败",
							icon: "none",
							duration: 2000,
							position: "bottom"
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			// 点赞处理
			async likeHandler() {
				if (this.$store.state.authStore.isLogin) {
					try {
						let res = await http.postLike({
							postid: this.postId
						}, this.$store.state.authStore.token).then(data => data.data);
						if (res.status == "200") {
							// 点赞成功
							this.article.avatarurls.push({
								avatarurl: this.avatarUrl
							});
						} else if (res.status == "501") {
							uni.showToast({
								title: "您已经点过赞啦！",
								icon: "none"
							});
						}
					} catch (e) {
						console.log(e)
					}

				} else {
					uni.navigateTo({
						url: "../login/login"
					});
					uni.showToast({
						title: "请先登录...",
						icon: "none"
					});
				}

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
		}

		.info {
			margin-top: 30rpx;
			color: #bbb;
			font-size: 28rpx;

			.icon {
				margin-right: 5rpx;
			}

			.text {
				margin-right: 20rpx;
			}
		}

		.content {
			margin-top: 30rpx;
			font-size: 35rpx;
			line-height: 2;

			code {
				color: red
			}

			pre {
				color: red
			}
		}

		// 标签样式
		.tags {
			display: flex;
			flex-wrap: wrap;
			margin-top: 80rpx;

			.tag-item {
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}
		}

		// 点赞样式
		.likes {
			display: flex;
			align-items: center;
			flex-direction: column;
			margin-top: 50rpx;

			.button-wrap {
				margin-bottom: 40rpx;
				border: 1rpx solid #0081FF;
				color: #0081FF;
				padding: 15rpx;
				width: 250rpx;
				font-size: 30rpx;
				text-align: center;
				border-radius: 1rem;
			}

			.icon {
				margin-right: 5rpx;
			}

			.avatar-wrap {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;

				.avatar-item {
					width: 60rpx;
					height: 60rpx;
					margin-right: 10rpx;
					margin-bottom: 10rpx;
					border-radius: 10rpx;
				}
			}
		}

		// 猜你喜欢
		.relatedPost-wrap {
			margin: 20rpx 0;

			.relatedPost-list {
				.item {
					display: flex;
					margin-bottom: 30rpx;

					.item-image {
						width: 250rpx;
						height: 140rpx;
						background-color: #F5F7F7;
						margin-right: 40rpx;
					}

					.item-title {
						flex: 1;
						font-size: 30rpx;
						line-height: 2;
					}
				}
			}
		}

		// 评论
		.comments-wrap {
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
					.comment-user-gravatar {
						position: relative;

						.gravatarImg {
							border-radius: 16rpx;
							height: 64rpx;
							width: 64rpx;
							margin-right: 20rpx;
						}

					}

					/* 评论用户昵称 */
					.comment-user-name {
						flex: 1;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.comment-name {
							color: #118FFF;
							font-weight: 500;
							flex: 1;
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
						color: #118FFF;
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
					background-color: #0082FF;
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
						content: " ";
						border: 1px solid rgba(0, 0, 0, .2);
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

		.subTitle {
			font-size: 30rpx;
			padding: 20rpx 0;
		}

		.subTitle-line {
			height: 1px;
			background-color: #e6e6e6;
			position: relative;
			margin-bottom: 30rpx;

			&:before {
				content: "";
				position: absolute;
				width: 50rpx;
				height: 4rpx;
				background: #959595;
				position: absolute;
				top: 0;
				left: 0;
			}
		}

		.footer {
			padding-bottom: 80rpx !important;
		}
	}
</style>
