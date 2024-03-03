<template>
  <view>
    <u-navbar :safe-area-inset-top="true" :placeholder="true" :border="true">
      <template #left>
        <!-- 若编译环境为小程序，让出最右侧胶囊位置 -->
        <!-- #ifdef MP -->
        <view style="width: 500rpx">
          <u-tabs :list="categories" @click="switchCategory"></u-tabs>
        </view>
        <!-- 编译环境为H5或者APP，按完全宽度显示 -->
        <!-- #endif -->
        <!-- #ifndef MP-->
        <view>
          <u-tabs :list="categories" @click="switchCategory"></u-tabs>
        </view>
        <!-- #endif -->
      </template>
    </u-navbar>

    <view v-if="page !== 1 || (isLoading && !isNetworkError)" class="list">
      <!-- 超级置顶 -->
      <view v-for="item in super_stickies" :key="item.id" class="sticky" @tap="goToTopic(item)">
        <image
          v-if="item.all_img.length !== 0"
          :src="item.all_img[0]"
          mode="aspectFill"
          class="image"
        ></image>
        <view class="title">
          <view style="display: inline-flex">
            <u-tag text="置顶" type="error" plain plain-fill size="mini"></u-tag>
          </view>
          <text style="margin-left: 20rpx">{{ item.title }}</text>
        </view>
      </view>

      <!-- 普通置顶 -->
      <view v-for="item in stickies" :key="item.id" class="sticky" @tap="goToTopic(item)">
        <image
          v-if="item.all_img.length !== 0"
          :src="item.all_img[0]"
          mode="aspectFill"
          class="image"
        ></image>
        <view class="title">
          <view style="display: inline-flex">
            <u-tag text="置顶" type="error" plain plain-fill size="mini"></u-tag>
          </view>
          <text style="margin-left: 20rpx">{{ item.title }}</text>
        </view>
      </view>

      <!-- 普通帖子 -->
      <view v-for="item in topics" :key="item.id" class="topic" @tap="goToTopic(item)">
        <view class="info">
          <u-avatar shape="square" :src="item.author_avatar" size="40"></u-avatar>
          <view class="right">
            <view class="name">{{ item.author_name }}</view>
            <view class="date">{{ item.post_date }}</view>
          </view>
        </view>
        <view class="content">
          <view class="text">{{ item.excerpt }}</view>
          <view class="images">
            <app-album
              v-if="item.all_img.length !== 0"
              :urls="item.all_img"
              multiple-size="205rpx"
              single-size="400rpx"
            ></app-album>
          </view>
          <view class="buttons" @tap.stop="">
            <view class="item">
              <u-button :custom-style="{ border: 'none' }" plain @click="likeTopic(item)">
                <u-icon
                  :name="item.is_user_favorite ? 'heart-fill' : 'heart'"
                  :color="item.is_user_favorite ? '#D54529' : '#636363'"
                  size="18"
                ></u-icon>
                <text :style="{ color: item.is_user_favorite ? '#D54529' : '#636363' }">{{
                  item.like_count
                }}</text>
              </u-button>
            </view>
            <view class="item">
              <u-button :custom-style="{ border: 'none' }" plain @click="readComment(item)">
                <u-icon name="chat" color="#636363" size="18"></u-icon>
                <text>{{ item.reply_count }}</text>
              </u-button>
            </view>
            <view class="item">
              <button type="default" open-type="share" :data-item="item" @tap="forwardTopic(item)">
                <u-icon name="share-square" color="#636363" size="18"></u-icon>
                <text>分享</text>
              </button>
            </view>
          </view>
        </view>
      </view>

      <u-empty
        v-if="
          !isLoading && topics.length === 0 && super_stickies.length === 0 && stickies.length === 0
        "
        icon="/static/no-data.png"
        :margin-top="60"
        text="暂无帖子"
      ></u-empty>
    </view>

    <view v-if="isLoading && page == 1" class="skeleton">
      <view class="item">
        <u-skeleton rows="4" title loading rows-width="95%" avatar></u-skeleton>
      </view>
      <view class="item">
        <u-skeleton rows="4" title loading rows-width="95%" avatar></u-skeleton>
      </view>
      <view class="item">
        <u-skeleton rows="4" title loading rows-width="95%" avatar></u-skeleton>
      </view>
    </view>

    <view v-if="!isLoading && isNetworkError" class="error">
      <u-empty icon="/static/no-network.png" text="网络连接失败"></u-empty>
    </view>

    <app-footer
      v-if="
        !isNetworkError &&
        !(topics.length === 0 && super_stickies.length === 0 && stickies.length === 0)
      "
    />

    <!-- 发布按钮 -->
    <view v-if="(!isLoading || page !== 1) && !isNetworkError && isCommentEnabled" class="add">
      <button class="button" color="#118fff" @tap="goToPublish">
        <image class="img" src="/static/add.png" mode="scaleToFill"></image>
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import { getPlatform, redirect } from '@/utils'
import { mapState } from 'pinia'
import { useUserStore } from '@/store/user'
import { forumPostLike, getForumCategories, getForumTopicList } from '@/api/forum'
import { useConfigStore } from '@/store/config'
import type { ForumCategory, Topic } from '@/types/forum'
import { WEBSITE_NAME } from '@/config'

let tempTopic: Topic | null = null
export default {
  data() {
    return {
      isLoading: true,
      categories: [] as ForumCategory[],
      super_stickies: [] as Topic[],
      stickies: [] as Topic[],
      topics: [] as Topic[],
      total_pages: 1,
      currentCategoryId: 0,
      isNetworkError: false,
      page: 1
    }
  },
  computed: {
    ...mapState(useUserStore, ['token']),
    ...mapState(useConfigStore, ['config', 'isCommentEnabled']),
    isLogin() {
      return !!this.token
    }
  },
  methods: {
    async switchCategory({ id: categoryId }: { id: number }) {
      this.currentCategoryId = categoryId
      this.refreshPostList()
    },
    async refreshPostList() {
      this.page = 1
      this.total_pages = 1
      this.super_stickies = []
      this.stickies = []
      this.topics = []
      await this.fetchPostList(this.currentCategoryId)
    },
    async fetchPostList(id: number) {
      if (this.page > this.total_pages) {
        return
      }
      try {
        this.isLoading = true
        this.isNetworkError = false
        const { topics, super_stickies, stickies, total_pages } = await getForumTopicList({
          id,
          page: this.page,
          per_page: 10
        })
        uni.stopPullDownRefresh()
        this.topics = [...this.topics, ...topics]
        this.super_stickies = super_stickies
        this.stickies = stickies
        this.total_pages = total_pages
        this.page++
      } catch (e) {
        console.error(e)
        this.isNetworkError = true
      } finally {
        this.isLoading = false
      }
    },
    goToTopic(item: Topic) {
      const { id } = item
      redirect({ type: 'apppage', path: './post?id=' + id })
      tempTopic = item
    },
    readComment(item: Topic) {
      const { id } = item
      redirect({ type: 'apppage', path: './post?id=' + id + '&mode=comment' })
      tempTopic = item
    },
    forwardTopic(item: Topic) {
      if (getPlatform() === 'H5') {
        tempTopic = item
        return
      }
    },
    likeTopic(item: Topic) {
      // 判断用户是否登录
      if (!this.isLogin) {
        uni.showToast({
          title: '请先登录',
          icon: 'error',
          duration: 1000
        })

        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }, 1000)
        return
      }

      const { id, is_user_favorite } = item
      if (is_user_favorite) {
        // 取消该文章点赞
        item.is_user_favorite = false
        item.like_count -= 1
      } else {
        // 给该文章点赞
        item.is_user_favorite = true
        item.like_count += 1
      }
      try {
        forumPostLike({ id, isLike: item.is_user_favorite })
      } catch (e) {
        console.error(e)
      }
    },
    goToPublish() {
      if (!this.isLogin) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      } else {
        redirect({ type: 'apppage', path: './publish' })
      }
    }
  },
  async onLoad() {
    try {
      let categories = await getForumCategories()
      categories = categories.sort((a, b) => a.order - b.order) // 按order排序
      this.categories = categories
      if (categories.length === 0) return
      const { id } = categories[0]
      this.currentCategoryId = id
      this.fetchPostList(id)
    } catch (e) {
      console.error(e)
      this.isNetworkError = true
      this.isLoading = false
    }

    uni.$on('forumLike', ({ is_user_favorite, like_count }) => {
      if (!tempTopic) {
        return
      }
      tempTopic.is_user_favorite = is_user_favorite
      tempTopic.like_count = like_count
    })
    uni.$on('forumListRefresh', () => {
      this.refreshPostList()
    })
  },
  onReachBottom() {
    if (this.currentCategoryId === 0) {
      return
    }
    this.fetchPostList(this.currentCategoryId)
  },
  onUnload() {
    uni.$off('forumLike')
    uni.$off('forumListRefresh')
  },
  async onPullDownRefresh() {
    await this.refreshPostList()
    uni.stopPullDownRefresh()
  },
  onShareAppMessage(options) {
    const configStore = useConfigStore()
    if (options.from === 'button') {
      const topic = options.target.dataset.item as Topic

      return {
        title: topic?.title,
        path: `/pages/forum/post?id=${topic?.id}`,
        imageUrl: topic?.all_img[0] || configStore.config.shareImageUrl
      }
    }
    return {
      title: `来「${WEBSITE_NAME}」圈子看看有什么新鲜事吧`,
      path: '/pages/forum/index',
      imageUrl: configStore.config.shareImageUrl
    }
  },
  onShareTimeline() {
    return {
      title: `来「${WEBSITE_NAME}」圈子看看有什么新鲜事吧`
    }
  }
}
</script>

<style>
page {
  background-color: #f4f7f6;
}
</style>

<style lang="scss" scoped>
.top-tabs {
  background-color: #ffffff;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.07),
    0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.list {
  margin-top: 20rpx;
  padding: 0 20rpx;

  .sticky {
    padding: 30rpx 30rpx;
    display: flex;
    background-color: #ffffff;
    position: relative;
    margin-bottom: 30rpx;
    border-radius: 10rpx;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    .image {
      width: 200rpx;
      height: 150rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .title {
      flex: 1;
      line-height: 45rpx;
      font-size: 30rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .sticky-label {
      margin-right: 20rpx;
    }
  }

  .topic {
    padding: 30rpx 30rpx 10rpx;
    background-color: #ffffff;
    position: relative;
    margin-bottom: 30rpx;
    border-radius: 10rpx;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    .info {
      display: flex;

      .avatar {
        width: 50rpx;
        height: 50rpx;
      }

      .right {
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name {
          font-size: 30rpx;
          font-weight: bold;
        }

        .date {
          font-size: 25rpx;
          color: #959595;
        }
      }
    }

    .content {
      margin-top: 20rpx;

      .text {
        line-height: 45rpx;
        font-size: 30rpx;
      }

      .images {
        margin-top: 20rpx;
      }

      .buttons {
        margin-top: 30rpx;
        display: flex;
        justify-content: space-around;
        color: #636363;
        font-size: 25rpx;

        .item {
          flex: 1;

          button {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            background: none;
            border: none;
            color: #636363;
            font-size: 25rpx;
            height: 100%;

            // 移除边框
            &::after {
              border: none;
            }
          }
        }
      }
    }
  }
}

.skeleton {
  margin: 20rpx 20rpx;

  .item {
    margin-bottom: 30rpx;
    background-color: #ffffff;
    padding: 30rpx;
    border-radius: 10rpx;
  }
}

.add::v-deep {
  position: fixed;
  right: 30rpx;
  /* #ifdef H5 */
  bottom: 180rpx;
  /* #endif */
  /* #ifndef H5 */
  bottom: 40rpx;
  /* #endif */
  width: 80rpx;
  height: 80rpx;
  box-shadow:
    0 3px 5px -1px rgba(0, 0, 0, 0.02),
    0 6px 10px 0 rgba(0, 0, 0, 0.14),
    0 1px 18px 0 rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  overflow: hidden;

  .button {
    height: 100% !important;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 !important;
    background: #118fff;

    &:active {
      background: #0c6abc;
    }

    .img {
      height: 60%;
      width: 60%;
    }
  }
}
</style>
