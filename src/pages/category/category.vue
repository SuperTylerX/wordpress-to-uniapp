<template>
  <view class="category-wrap">
    <scroll-view class="left" :scroll-y="true">
      <view
        v-for="(item, index) in parentCategory"
        :key="index"
        class="parent-item"
        :class="{ active: item.id === currentParentId }"
        @tap="switchCategory(item.id)"
        >{{ item.name }}</view
      >
    </scroll-view>
    <scroll-view class="right" :scroll-y="true">
      <block v-for="(item, index) in childrenCategory[currentParentId]" :key="index">
        <view
          class="list-item"
          @tap="
            redirect({
              type: 'apppage',
              path: '/pages/list/list?categoryID=' + item.id
            })
          "
        >
          <view>
            <image :src="item.cover_image" class="cover" mode="aspectFill"></image>
          </view>
          <view class="content-title">
            <view class="topic-name">
              <text>{{ item.name }}</text>
            </view>
          </view>
          <view class="content-brief">
            <text>{{ item.description }}</text>
          </view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { defineComponent } from 'vue'

import { getCategoryList } from '@/api/category'
import { WEBSITE_NAME } from '@/config'
import { useConfigStore } from '@/store/config'
import type { Category } from '@/types/category'
import { redirect } from '@/utils'

export default defineComponent({
  data() {
    return {
      parentCategory: [] as Category[],
      childrenCategory: {} as Record<number, Category[]>,
      currentParentId: 0
    }
  },
  computed: {
    ...mapState(useConfigStore, ['config'])
  },
  methods: {
    redirect,
    async fetchCategory() {
      try {
        const categories = await getCategoryList({
          per_page: 100,
          orderby: 'id',
          order: 'asc'
        })
        const parentCategory = [] as Category[]
        const childrenCategory = {} as Record<number, Category[]>
        categories.forEach(item => {
          if (!item.cover_image) {
            item.cover_image = '/static/bg-list.jpg'
          }
          if (item.parent === 0) {
            parentCategory.push(item)
          } else {
            if (childrenCategory[item.parent]) {
              childrenCategory[item.parent].push(item)
            } else {
              childrenCategory[item.parent] = [item]
            }
          }
        })
        this.parentCategory = parentCategory
        this.childrenCategory = childrenCategory
        this.currentParentId = parentCategory[0]?.id
      } catch (e) {
        console.error(e)
      }
    },
    switchCategory(id: number) {
      this.currentParentId = id
    }
  },
  onLoad() {
    // #ifdef MP-QQ
    // eslint-disable-next-line
    // @ts-ignore
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
    this.fetchCategory()
  },
  onShareAppMessage() {
    return {
      title: `分享「${WEBSITE_NAME}」小程序 - 文章分类`,
      path: 'pages/category/category',
      imageUrl: this.config.shareImageUrl
    }
  },
  onShareTimeline() {
    return {
      title: `分享「${WEBSITE_NAME}」小程序 - 文章分类`,
      imageUrl: this.config.shareImageUrl
    }
  }
})
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
      color: #118fff;
      font-weight: 500;
      background: #f5f7f7;
    }

    .active::before {
      content: '';
      display: block;
      width: 3px;
      height: 50rpx;
      background: #118fff;
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

    .topic-img > image {
      width: 98rpx;
      height: 49rpx;
      display: block;
    }
  }
}
</style>
