<template>
  <!-- 列表template模板 -->
  <view class="articles-wrap">
    <view
      v-for="(item, index) in postsList"
      :key="index"
      class="article-item"
      @tap="redirect({ type: 'apppage', path: '/pages/post/post?id=' + item.id })"
    >
      <image mode="aspectFill" :src="item.post_medium_image" class="image"></image>
      <view class="article-disc">
        <view class="title">{{ item.title.rendered }}</view>
        <view class="info">
          <u-icon class="icon" name="calendar" size="12"></u-icon>
          <text class="desc">{{ item.date.slice(0, 10) }}</text>

          <u-icon class="icon" name="chat" size="12"></u-icon>
          <text class="desc">{{ item.total_comments }}</text>

          <u-icon class="icon" name="thumb-up" size="12"></u-icon>
          <text class="desc">{{ item.like_count }}</text>

          <u-icon class="icon" name="eye" size="12"></u-icon>
          <text class="desc">{{ item.pageviews }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Post } from '@/types/post'
import { redirect } from '@/utils'

withDefaults(
  defineProps<{
    postsList: Post[]
  }>(),
  {
    postsList: () => []
  }
)
</script>

<style lang="scss">
// 文章页面
.articles-wrap {
  margin: 20rpx 20rpx 0;

  .article-item {
    display: flex;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .image {
      width: 250rpx;
      height: 140rpx;
      background-color: #f5f7f7;
    }

    .article-disc {
      flex: 1;
      margin-left: 30rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        font-size: 30rpx;
      }

      .info {
        color: #bbb;
        font-size: 21rpx;
        display: flex;

        .icon {
          margin-right: 5rpx;
        }

        .desc {
          margin-right: 20rpx;
        }
      }
    }
  }
}
</style>
