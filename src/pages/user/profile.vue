<template>
  <view>
    <view class="back-wrapper" @click="goBack()">
      <u-icon name="arrow-left" color="#fff"></u-icon>
    </view>

    <view class="bg-wrapper">
      <image :src="user.avatarUrl" class="cover" mode="aspectFill"></image>

      <view class="bg-content">
        <view class="image-line">
          <image :src="user.avatarUrl" class="avatar" mode="aspectFill"></image>

          <view class="username-wrapper">
            <view class="username">
              {{ user.nickname }}

              <view v-if="user.role" class="role">{{ user.role }}</view>
            </view>
            <view class="id">ID: {{ user.userId }}</view>
          </view>

          <view style="margin-left: auto">
            <u-button
              v-if="isSelf"
              type="primary"
              icon="edit-pen"
              shape="circle"
              @click="goToEditPage"
            >
              修改
            </u-button>
          </view>
        </view>

        <view class="user-meta-wrapper">
          <view>注册时间: {{ user.registered.substr(0, 10) }}</view>
        </view>
        <view class="description">{{
          user.description ? user.description : '这位小可爱还什么也没有写哦...'
        }}</view>
      </view>
    </view>

    <view v-show="isTabFixed" class="sticky-wrapper">
      <view class="top-nav">
        <image :src="user.avatarUrl" class="top-avatar" mode="aspectFill"></image>

        <view>{{ user.nickname }}</view>
      </view>
    </view>

    <view class="tab" :class="{ fixedTab: isTabFixed }">
      <u-tabs :current="tab" :list="tabList" :scrollable="false" @change="changeTab"></u-tabs>
    </view>

    <swiper style="height: 100vh; background-color: #fff" :current="tab" @change="changeSwiper">
      <swiper-item>
        <scroll-view style="height: 100vh" scroll-y @scrolltolower="loadNextPage()">
          <app-list :posts-list="postsList"></app-list>

          <view v-if="postsList.length === 0" class="empty">
            <u-empty icon="/static/no-data.png" text="暂无投稿"></u-empty>
          </view>

          <app-footer></app-footer>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <scroll-view style="height: 100vh" scroll-y @scrolltolower="loadNextPage()">
          <app-comment :comment-list="commentsList"></app-comment>

          <view v-if="commentsList.length === 0" class="empty">
            <u-empty icon="/static/no-data.png" text="暂无评论"></u-empty>
          </view>
          <app-footer></app-footer>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts">
import { getWebsiteUserProfile } from '@/api/user'
import { getCommentListByUserId } from '@/api/comment'
import { getPostList } from '@/api/post'
import type { CommentListItem } from '@/types/comment'
import type { Post } from '@/types/post'
import { mapState } from 'pinia'
import { useUserStore } from '@/store/user'
import { useConfigStore } from '@/store/config'
import { useSystemStore } from '@/store/systemStore'
import { WEBSITE_NAME } from '@/config'

const pageList = [1, 1]
export default {
  data() {
    return {
      scrollTop: 0,
      tab: 0,
      user: {
        avatarUrl: '',
        role: '',
        nickname: '',
        description: '',
        userId: 0,
        registered: '',
        location: {
          city_name: '',
          country_name: '',
          region_name: ''
        }
      },
      postsList: [] as Post[],
      commentsList: [] as CommentListItem[],
      favouriteList: [] as Post[]
    }
  },
  computed: {
    ...mapState(useUserStore, ['userInfo']),
    ...mapState(useConfigStore, ['config']),
    ...mapState(useSystemStore, ['systemInfo']),
    isTabFixed() {
      return this.scrollTop > 550 - 100 - Number(this.systemInfo.statusBarHeight)
    },
    isSelf() {
      return this.userInfo.id === this.user.userId
    },
    tabList() {
      return [
        {
          name: '文章',
          id: 0
        },
        {
          name: '评论',
          id: 1
        }
      ]
    }
  },
  onPageScroll({ scrollTop }) {
    const pxToRpx = (px: number | string) => {
      const screenWidth = this.systemInfo.screenWidth
      return (750 * Number(px)) / screenWidth
    }
    this.scrollTop = pxToRpx(scrollTop)
  },
  onLoad(options) {
    if (!options) {
      return
    }
    const userId = Number(options.userId)
    if (!userId) {
      uni.showToast({
        icon: 'error',
        title: '未知用户'
      })
      return
    }

    // 获取用户资料
    this.getWebsiteUserProfile(userId)

    // 获取用户文章
    this.getUserPosts(userId)

    // 获取用户评论
    this.getUserComments(userId)
  },
  methods: {
    changeTab(e: { index: number }) {
      this.tab = e.index
    },
    changeSwiper(e: { detail: { current: number } }) {
      this.tab = e.detail.current
    },
    goToEditPage() {
      uni.navigateTo({
        url: '/pages/my/profile',
        fail(result) {
          console.error(result)
        }
      })
    },
    loadNextPage() {
      // 判断是在文章页还是评论页
      if (this.tab === 0) {
        pageList[0]++
        this.getUserPosts(this.user.userId)
      } else if (this.tab === 1) {
        pageList[1]++
        this.getUserComments(this.user.userId)
      }
    },
    goBack() {
      uni.navigateBack()
    },
    async getWebsiteUserProfile(userId: number) {
      try {
        this.user = await getWebsiteUserProfile(userId)
      } catch (e) {
        console.error(e)
      }
    },
    async getUserComments(userId: number) {
      try {
        const res = await getCommentListByUserId({
          page: pageList[1],
          userId,
          limit: 10,
          order: 'desc'
        })
        const commentsList = res.data
        this.commentsList = [...this.commentsList, ...commentsList]
      } catch (e) {
        console.error(e)
      }
    },
    async getUserPosts(userId: number) {
      try {
        const res = await getPostList({
          author: userId,
          page: pageList[0]
        })

        this.postsList = [...this.postsList, ...(res as Post[])]
      } catch (e) {
        console.error(e)
      }
    }
  },
  onShareAppMessage() {
    return {
      title: `${this.user.nickname}的个人主页 - ${WEBSITE_NAME}`,
      path: `/pages/user/profile?userId=${this.user.userId}`,
      imageUrl: this.user.avatarUrl
    }
  },
  onShareTimeline() {
    return {
      title: `${this.user.nickname}的个人主页 - ${WEBSITE_NAME}`,
      imageUrl: this.user.avatarUrl
    }
  }
}
</script>

<style scoped lang="scss">
.back-wrapper {
  position: fixed;
  top: calc(var(--status-bar-height) + 20rpx);
  left: 15rpx;
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background-color: #afafaf88;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.sticky-wrapper {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(var(--status-bar-height) + 100rpx);
  z-index: 999;

  .top-nav {
    display: flex;
    gap: 10px;
    align-items: center;
    position: absolute;
    left: 110rpx;
    bottom: 0;
    height: 80rpx;

    .top-avatar {
      height: 70rpx;
      width: 70rpx;
      border-radius: 50%;
    }
  }
}

.tab {
  border-bottom: 1rpx solid #a1b2c3;
  // 下方加上阴影
}
.fixedTab {
  position: fixed;
  top: calc(var(--status-bar-height) + 100rpx);
  left: 0;
  background-color: #fff;
  width: 100%;
  z-index: 999;
}

.bg-wrapper {
  position: relative;
  overflow: hidden;

  .cover {
    display: block;
    width: 100%;
    height: 500rpx;
    filter: brightness(88%) blur(8px);
    transform: scale(1.2);
    overflow: hidden;
  }

  .bg-content {
    position: absolute;
    top: 150rpx;
    padding: 0 40rpx;
    width: 100%;
    box-sizing: border-box;

    .image-line {
      display: flex;
      gap: 40rpx;
      align-items: center;

      .avatar {
        width: 150rpx;
        height: 150rpx;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .username-wrapper {
        display: flex;
        flex-direction: column;
        gap: 10rpx;
        justify-content: center;

        .username {
          color: #fff;
          font-size: 38rpx;
          display: flex;
          gap: 10px;
          align-items: center;

          .role {
            font-size: 28rpx;
            background-color: rgb(225, 179, 42);
            color: #fff;
            margin-left: 10rpx;
            padding: 0 20rpx;
            border-radius: 10px;
            flex-shrink: 0;
            height: 50rpx;
            display: flex;
            align-items: center;
          }
        }

        .id {
          color: #fff;
          font-size: 28rpx;
        }
      }
    }

    .user-meta-wrapper {
      margin-top: 15rpx;
      display: flex;
      gap: 30rpx;
      color: #fff;
      font-size: 28rpx;
    }

    .description {
      margin-top: 15rpx;
      color: #fff;
      font-size: 28rpx;
      padding: 10rpx 20rpx;
      background-color: #afafaf55;
      border-radius: 10rpx;
      line-height: 50rpx;
      height: 120rpx;
      box-sizing: border-box;
      // 最多显示两行，超出显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}

.empty {
  height: 50vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .img {
    height: 300rpx;
    width: 300rpx;
  }

  .desc {
    color: #ccc;
  }
}
</style>
