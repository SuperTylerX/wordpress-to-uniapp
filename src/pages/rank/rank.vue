<template>
  <view>
    <u-loading-page :loading="isLoading"></u-loading-page>
    <view class="wrap">
      <view class="u-tabs-box">
        <u-tabs
          active-color="#118FFF"
          :list="list"
          :current="current"
          :scrollable="false"
          @change="change"
        >
        </u-tabs>
      </view>
      <swiper class="swiper-box" :current="swiperCurrent" @animationfinish="animationFinish">
        <swiper-item class="swiper-item">
          <scroll-view scroll-y style="height: 100%; width: 100%">
            <view class="page-box">
              <app-list :posts-list="hotViews"></app-list>
              <view v-if="hotViews.length == 0" class="center">
                <u-loading-icon mode="flower"></u-loading-icon>
              </view>
            </view>
            <app-footer v-if="!isLoading"></app-footer>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiper-item">
          <scroll-view scroll-y style="height: 100%; width: 100%">
            <view class="page-box">
              <app-list :posts-list="hotLikes"></app-list>
              <view v-if="hotViews.length == 0" class="center">
                <u-loading-icon mode="flower"></u-loading-icon>
              </view>
            </view>
            <app-footer v-if="!isLoading"></app-footer>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiper-item">
          <scroll-view scroll-y style="height: 100%; width: 100%">
            <view class="page-box">
              <app-list :posts-list="hotComments"></app-list>
              <view v-if="hotViews.length == 0" class="center">
                <u-loading-icon mode="flower"></u-loading-icon>
              </view>
            </view>
            <app-footer v-if="!isLoading"></app-footer>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script lang="ts">
import { mapState } from 'pinia'

import { getHotCommentPosts, getHotLikePosts, getHotViewPosts } from '@/api/post'
import { WEBSITE_NAME } from '@/config'
import { useConfigStore } from '@/store/config'
import type { Post } from '@/types/post'

export default {
  data() {
    return {
      list: [
        {
          name: '浏览数'
        },
        {
          name: '点赞数'
        },
        {
          name: '评论数'
        }
      ],
      current: 0,
      swiperCurrent: 0,
      hotViews: [] as Post[],
      hotLikes: [] as Post[],
      hotComments: [] as Post[],
      isLoading: true
    }
  },
  computed: {
    ...mapState(useConfigStore, ['config'])
  },
  onLoad() {
    // #ifdef MP-QQ
    qq.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    })
    // #endif
    // #ifdef MP-WEIXIN
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // #endif
    try {
      this.isLoading = true
      getHotViewPosts().then(hotViews => {
        this.hotViews = hotViews
        this.isLoading = false
      })
      getHotLikePosts().then(hotLikes => {
        this.hotLikes = hotLikes
      })
      getHotCommentPosts().then(hotComments => {
        this.hotComments = hotComments
      })
    } catch (e) {
      console.error(e)
    }
  },
  onShareAppMessage() {
    return {
      title: `分享「${WEBSITE_NAME}」小程序 - 热门文章`,
      path: 'pages/rank/rank',
      imageUrl: this.config.shareImageUrl
    }
  },
  onShareTimeline() {
    return {
      title: `分享「${WEBSITE_NAME}」小程序 - 热门文章`,
      imageUrl: this.config.shareImageUrl
    }
  },
  methods: {
    // tab栏切换
    change(target: { index: number }) {
      this.swiperCurrent = target.index
    },
    animationFinish({ detail: { current } }: { detail: { current: number } }) {
      this.swiperCurrent = current
      this.current = current
    }
  }
}
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
