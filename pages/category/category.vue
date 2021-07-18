<template>
	<view class="category-wrap">
		<scroll-view class="left" scroll-y="true">
			<view class="parent-item" v-for="(item, index) in parentCategory" :key="index"
				:class="{'active': item.id === currentParentId}" @tap="switchCategory(item.id)">{{item.name}}</view>
		</scroll-view>
		<scroll-view class="right" scroll-y="true">
			<block v-for="(item, index) in childrenCategory[currentParentId]" :key="index">
				<view class="list-item" @tap="redirect({
					type: 'apppage', path: '/pages/list/list?categoryID=' + item.id })">
					<view>
						<image :src="item.category_thumbnail_image" class="cover" mode="aspectFill"></image>
					</view>
					<view class="content-title">
						<view class="topic-name">
							<text>{{item.name}}</text>
						</view>
					</view>
					<view class="content-brief">
						<text>{{item.description}}</text>
					</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import http from "../../utils/http.js";

	export default {
		data() {
			return {
				parentCategory: [],
				childrenCategory: {},
				currentParentId: 0
			}
		},
		onLoad() {
			this.fetchCategory();
		},
		methods: {
			async fetchCategory() {
				let queryObj = {
					per_page: 100,
					orderby: "id",
					order: "asc"
				};
				try {
					const categories = await http.getCategory(queryObj).then(data => data.data);
					const parentCategory = [];
					const childrenCategory = {};
					categories.forEach(item => {
						if (!item.category_thumbnail_image) {
							item.category_thumbnail_image = "/static/bg-list.jpg";
						}
						if (item.parent === 0) {
							parentCategory.push(item);
						} else {
							if (childrenCategory[item.parent]) {
								childrenCategory[item.parent].push(item);
							} else {
								childrenCategory[item.parent] = [item];
							}
						}
					});
					this.parentCategory = parentCategory;
					this.childrenCategory = childrenCategory;
					this.currentParentId = parentCategory[0].id;

				} catch (e) {
					console.log(e);
				}
			},
			switchCategory(id) {
				this.currentParentId = id;
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}

	.category-wrap {
		height: 100vh;
		/* #ifdef H5 */
		height: 100%;
		/* #endif*/
		display: flex;

		.left {
			width: 250rpx;
			height: 100vh;
			/* #ifdef H5 */
			height: 100%;
			/* #endif*/
			background-color: white;
			font-size: 28rpx;

			.parent-item {
				height: 100rpx;
				line-height: 100rpx;
				padding: 0 24rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.active {
				position: relative;
				color: #118FFF;
				font-weight: 500;
				background: #fff;
				background: #f5f7f7;
			}

			.active::before {
				content: "";
				display: block;
				width: 3px;
				height: 50rpx;
				background: #118FFF;
				position: absolute;
				top: 25rpx;
				left: 0;
				border-top-right-radius: 3px;
				border-bottom-right-radius: 3px;
			}

		}

		.right {
			flex: 1;
			height: 100vh;
			/* #ifdef H5 */
			height: 100%;
			/* #endif*/
			padding: 10rpx 0 0;
			background: #f5f7f7;
			box-sizing: border-box;

			.list-item {
				position: relative;
				overflow: hidden;
				background: #fff;
				border-radius: 10rpx;
				box-shadow: 2px 2px 10px #eee;
				margin: 0 40rpx 40rpx;

				.cover {
					width: 100%;
					height: 200rpx;
					display: block;
				}
			}

			.content-title {
				padding: 20rpx 30rpx 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.content-title text {
				font-size: 30rpx;
				line-height: 1;
				font-weight: 500;
				color: #333;
			}

			.content-brief {
				width: 70%;
				/* margin: 0 auto; */
				padding: 0 0 30rpx 30rpx;
				font-size: 26rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #959595;
			}

			.topic-name {
				width: 55%;
			}

			.topic-img>image {
				width: 98rpx;
				height: 49rpx;
				display: block;
			}

		}
	}
</style>
