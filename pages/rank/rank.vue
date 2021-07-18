<template>
	<view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper active-color="#118FFF" ref="tabs" :list="list" :current="current" @change="change"
					:is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%; width: 100%;">
						<view class="page-box">
							<app-list :postsList="hotViews"></app-list>
							<view class="center" v-if="hotViews.length==0">
								<u-loading mode="flower"></u-loading>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page-box">
							<app-list :postsList="hotLikes"></app-list>
							<view class="center" v-if="hotViews.length==0">
								<u-loading mode="flower"></u-loading>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page-box">
							<app-list :postsList="hotComments"></app-list>
							<view class="center" v-if="hotViews.length==0">
								<u-loading mode="flower"></u-loading>
							</view>
						</view>
					</scroll-view>
				</swiper-item>

			</swiper>
		</view>
	</view>
</template>

<script>
	import http from "../../utils/http.js";
	export default {
		data() {
			return {
				list: [{
						name: "浏览数"
					},
					{
						name: "点赞数"
					},
					{
						name: "评论数"
					}
				],
				current: 0,
				swiperCurrent: 0,
				hotViews: [],
				hotLikes: [],
				hotComments: []
			};
		},
		onLoad() {
			try {
				http.getHotViewPosts().then(data => data.data).then(hotViews => {
					this.hotViews = hotViews.map(item => {
						item.title = {
							rendered: item.post_title
						};
						item.date = item.post_date;
						item.total_comments = item.comment_total;
						item.id = item.post_id;
						return item;
					});
				});
				http.getHotLikePosts().then(data => data.data).then(hotLikes => {
					this.hotLikes = hotLikes.map(item => {
						item.title = {
							rendered: item.post_title
						};
						item.date = item.post_date;
						item.total_comments = item.comment_total;
						item.id = item.post_id;
						return item;
					});
				});
				http.getHotCommentPosts().then(data => data.data).then(hotComments => {
					this.hotComments = hotComments.map(item => {
						item.title = {
							rendered: item.post_title
						};
						item.date = item.post_date;
						item.total_comments = item.comment_total;
						item.id = item.post_id;
						return item;
					});
				});

			} catch (e) {
				console.log(e)
			}
		},
		methods: {
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	};
</script>

<style lang="scss" scoped>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #f2f2f2;
	}



	/* #endif */
	.u-tabs-box {
		box-shadow: 0px 4px 8px #f7f7f7;
	}

	.wrap {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;

		.center {
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}
</style>
