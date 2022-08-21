<template>
	<view class="wrap">
		<u-navbar title="发布话题" :safeAreaInsetTop="true" :border="true" :placeholder="true" @leftClick="leftClick">
			<!-- #ifndef MP -->
			<view slot="right">
				<u-button type="default" style="padding: 0" :disabled="!canSubmit" @tap="submit"><text
						class="publish-btn">发布</text></u-button>
			</view>
			<!-- #endif -->
		</u-navbar>

		<view class="textarea" @tap="focus = true">
			<u--textarea v-model="textarea" border="none" :autoHeight="true" :foucus="true" placeholder="分享新鲜事..."
				maxlength="-1" :focus="focus" @blur="focus = false"></u--textarea>
		</view>

		<view class="upload">
			<u-upload :fileList="imgList" @afterRead="afterRead" @delete="deleteImg" name="imgList" multiple
				:maxCount="9" width="100" height="100"></u-upload>
		</view>

		<view class="">
			<u-cell-group>
				<picker :value="pickerIndex" :range="topicCategory" range-key="name" @change="changeCateory">
					<u-cell title="话题分类" size="large" :isLink="true" arrow-direction="right"
						:value="topicCategory.length === 0 ? '' : topicCategory[pickerIndex].name"></u-cell>
				</picker>
			</u-cell-group>
			<view class="form-item">
				<view class="left">话题标签</view>
				<view class="right"><input type="text" v-model="tags" class="tag-input" placeholder="(可选) 多个标签以、或,分割" />
				</view>
			</view>
			<u-line></u-line>
			<!-- 			<view class="hot-tags">
				<view class="">
					热门标签
				</view>
				<view class="">
					
				</view>
			</view> -->
			<!-- #ifdef MP -->
			<view class="submit-btn-wrap"><button type="primary" :disabled="!canSubmit" @tap="submit">发布</button></view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import * as http from "@/utils/http.js";
	import { getPlatform } from "@/utils/utils.js";

	export default {
		data() {
			return {
				textarea: "",
				imgList: [],
				focus: false,
				topicCategory: [],
				pickerIndex: 0,
				tags: "",
				isSubmitting: false
			};
		},
		methods: {
			async fetchCategory() {
				try {
					this.topicCategory = await http.getForumCategories().then(data => data.data);
				} catch (e) {
					console.error(e);
				}
			},
			changeCateory(e) {
				this.pickerIndex = e.detail.value;
			},
			// 删除图片
			deleteImg(event) {
				this.imgList.splice(event.index, 1);
				const id = event.file.id;
				id && http.deleteFile({ id }); // 静默删除，不显示结果
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let { file: list } = event;

				let fileListLen = this.imgList.length;

				list.forEach(item => {
					this.imgList.push({
						...item,
						status: "uploading",
						message: "上传中"
					});
				});

				for (let i = 0; i < list.length; i++) {
					try {
						const result = await http.uploadFile({ filePath: list[i].url });
						if (result.statusCode === 403) {
							throw result;
						}
						const res = JSON.parse(result.data);
						let item = this.imgList[fileListLen];
						this.imgList.splice(
							fileListLen,
							1,
							Object.assign(item, {
								status: "success",
								message: "",
								id: res.id,
								remoteUrl: res.source_url
							})
						);
						fileListLen++;
					} catch (e) {
						console.error(e);
						let item = this.imgList[fileListLen];
						this.imgList.splice(
							fileListLen,
							1,
							Object.assign(item, {
								status: "failed",
								message: "上传失败"
							})
						);
						fileListLen++;
					}
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
			async submit() {
				const forum_id = this.topicCategory[this.pickerIndex].id;
				const content = this.textarea;
				const tags = this.tags.split(/,|、/);
				const images = this.imgList.map(item => item.remoteUrl);
				const platform = getPlatform();

				this.isSubmitting = true;
				try {
					uni.showLoading({
						title: "帖子发布中..."
					});
					const res = await http.postForumPost({ forum_id, content, tags, images, platform });
					uni.hideLoading();
					uni.showToast({
						title: res.message,
						icon: res.code === "1" ? "success" : "none",
						position: res.code === "1" ? "center" : "bottom",
						duration: 2000
					});
					uni.$emit("forumListRefresh");
					setTimeout(uni.navigateBack, 2000);
				} catch (e) {
					console.error(e);
					uni.hideLoading();

					// 判断是网络错误还是服务器错误
					if (e.statusCode) {
						uni.showToast({
							title: e.data.message,
							// #ifdef H5 || APP || MP-WEIXIN
							icon: "error",
							// #endif
							// #ifndef H5 || APP || MP-WEIXIN
							icon: "none",
							// #endif
							duration: 2000,
							duration: 2000,
						});
					} else {
						uni.showToast({
							title: "网络连接异常，发表失败",
							icon: "none",
							duration: 2000,
							position: "bottom"
						});
					}
					this.isSubmitting = false;
				}
			}
		},
		computed: {
			canSubmit() {
				// 输入框有文字且所有图片都是success状态
				return !this.isSubmitting && this.textarea.length !== 0 && this.imgList.filter(item => item.status !==
					"success").length === 0;
			}
		},
		onLoad() {
			this.fetchCategory();
		},
		onShow() {
			if (!this.$store.state.authStore.isLogin) {
				uni.redirectTo({
					url: "../login/login"
				});
			}
		}
	};
</script>

<style lang="scss" scope>
	.publish-btn {
		color: #3c9cff;
	}

	.textarea {
		padding: 10rpx 10rpx;
		min-height: 300rpx;
	}

	.upload {
		padding: 10rpx 30rpx;
	}

	.form-item {
		height: 100rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		display: flex;

		.left {
			width: 160rpx;
			line-height: 80rpx;
		}

		.right {
			flex: 1;
			display: flex;
			align-items: center;

			.tag-input {
				font-size: 30rpx;
				color: #606266;
				width: 100%;
			}
		}
	}

	.submit-btn-wrap {
		padding: 30rpx;
		margin-top: 30rpx;
	}
</style>
