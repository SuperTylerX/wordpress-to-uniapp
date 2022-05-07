<template>
	<view>
		<view v-for="(item, idx) in parent.child" :key="idx">
			<view class="reply-user" @tap.stop="replyTo(item)">
				<text class="comment-name">{{ item.author_name }}</text>
				回复
				<text class="comment-name">{{ parent.author_name }}</text>
				：{{ item.content }}
				<app-reply :parent="item" @replyTo="replyTo"></app-reply>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "appReply",
		props: ["parent"],
		methods: {
			replyTo(item) {
				this.$emit("replyTo", item);
			}
		}
	};
</script>

<style lang="scss" scope>
	.reply-user {
		font-size: 28rpx;
		line-height: 1.8;
		color: #333;
	}

	.comment-name {
		color: #118fff;
		font-weight: 500;
	}
</style>
