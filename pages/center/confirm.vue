<template>
	<view>
		<div class="monitor_img">
			<image src="../../static/monitor.svg"></image>
		</div>

		<view class="p1">电脑端登录确认</view>
		<view class="p2">为确保账号安全，请确认是您本人操作</view>

		<view class="btn_wrap">
			<u-button type="primary" @click="confirmLogin(true)">确认登录电脑端</u-button>
			<u-button @click="confirmLogin(false)">取消</u-button>
		</view>
	</view>
</template>

<script>
	import { getQRInfo, confirmQRLogin } from "@/utils/http.js";
	import * as unip from "@/utils/uniPromisify.js";

	export default {
		data() {
			return {
				token: "",
				expire_time: ""
			};
		},
		methods: {
			async getQRInfo() {
				try {
					const res = await getQRInfo(this.token);
					// 判断二维码是否过期和是否有效
					const now = Date.now();
					if (res.expire_time - now < 5 * 1000 || res.status !== 1) {
						this.invalidToken();
						return;
					}
					this.expire_time = res.expire_time;

				} catch (e) {
					console.error(e);
					this.invalidToken();
				}
			},
			async confirmLogin(isContinue) {
				try {
					await confirmQRLogin(this.token, isContinue);
					await unip.navigateBack();
					uni.showToast({
						icon: isContinue ? "success" : "error",
						title: isContinue ? "已确认登录" : "已取消登录"
					});
				} catch (e) {
					console.error(e);
					this.invalidToken();
				}
			},
			async invalidToken() {
				await unip.navigateBack();
				uni.showToast({
					icon: "error",
					title: "二维码无效"
				});
			}
		},
		onLoad(options) {
			const { token } = options;
			this.token = token;

			if (!token) {
				uni.showToast({
					icon: "error",
					title: "二维码无效"
				});
				uni.navigateBack();
			}
			this.getQRInfo();
		}
	};
</script>

<style lang="scss" scoped>
	.monitor_img {
		margin: 20rpx 0;
		display: flex;
		justify-content: center;

		image {
			width: 300rpx;
			height: 300rpx;
		}

	}

	.p1 {
		font-size: 40rpx;
		font-weight: bold;
		text-align: center;
		line-height: 100rpx;
	}

	.p2 {
		font-size: 30rpx;
		text-align: center;
		color: #ababab;
	}

	.btn_wrap {
		margin-top: 100rpx;
		padding: 0 10px;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
</style>
