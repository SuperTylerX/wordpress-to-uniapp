<template>
  <view class="">
    <view v-show="!isLoading" class="wrap">
      <view class="title">
        {{ article.title.rendered }}
      </view>

      <!-- 文章内容 -->
      <view class="content">
        <mp-html
          :content="article.content.rendered"
          :selectable="true"
          :tag-style="style"
          @ready="articleReady"
        ></mp-html>
      </view>

      <!-- 底部版权 -->
      <view class="footer">
        <app-footer></app-footer>
      </view>
    </view>

    <!-- 加载图 -->
    <view v-if="isLoading" class="loading-wrap">
      <u-skeleton class="item" rows="10" loading :rows-height="[18, 200, 18]"></u-skeleton>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { getPage } from '@/api/post'
import { DefaultPost } from '@/constants'

export default defineComponent({
  data() {
    return {
      pageId: undefined,
      isLoading: false,
      article: { ...DefaultPost },
      style: {
        img: 'margin-bottom: 30rpx',
        p: `font-size: 28rpx;
						  margin-bottom: 10rpx;
					`,
        li: 'font-size: 28rpx',
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
      }
    }
  },
  async onLoad(option) {
    if (!option) {
      return
    }
    // #ifdef MP-QQ
    qq.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    })
    // #endif
    if (!option.id) return
    this.isLoading = true
    const pageId = option.id
    this.pageId = pageId
    try {
      this.article = await getPage(pageId)
    } catch (e) {
      console.error(e)
    }
  },
  onShareAppMessage() {
    return {
      title: this.article.title.rendered,
      path: 'pages/post/post?id=' + this.pageId,
      imageUrl: this.article.post_full_image
    }
  },
  onShareTimeline() {
    return {
      title: this.article.title.rendered,
      imageUrl: this.article.post_full_image
    }
  },
  methods: {
    // 文章加载完毕回调
    articleReady() {
      this.isLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.loading-wrap {
  padding: 30rpx;
}

.wrap {
  margin: 30rpx;

  .title {
    font-size: 40rpx;
    font-weight: bold;
    text-align: center;
  }

  .content {
    margin-top: 30rpx;
    font-size: 35rpx;
    line-height: 2;
  }
}
</style>
