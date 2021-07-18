<template>
	<view class="copyright">
		<view>© 2020 - {{new Date().getFullYear()}} {{websiteName}} {{domain}}</view>
	</view>
</template>

<script>
	import config from "../../utils/config.js";

	export default {
		name: "app-footer",
		data() {
			return {
				domain: config.HOST_DOMAIN,
				websiteName: config.WEBSITE_NAME
			}
		}
	}
</script>

<style scoped>
	.copyright {
		font-size: 26rpx;
		line-height: 1.6;
		font-weight: 400;
		text-align: center;
		color: #c4c4c4;
		margin-top: 48rpx;
		padding-bottom: 60rpx;
	}
</style>
