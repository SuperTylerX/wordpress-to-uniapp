<template>
  <view>
    <u-navbar
      class="nav-bar"
      title="圈子"
      :safe-area-inset-top="true"
      :placeholder="true"
      :border="true"
      @left-click="leftClick"
    ></u-navbar>
    <view v-if="isLoading" class="skeleton">
      <u-skeleton class="item" title loading rows-width="95%" avatar></u-skeleton>
      <u-skeleton class="item" rows="10" loading></u-skeleton>
    </view>
    <view v-show="!isLoading" class="wrap" @tap="resetMyComment">
      <view class="info">
        <u-avatar shape="square" :src="post.author_avatar" size="40"></u-avatar>
        <view class="right">
          <view class="name">{{ post.author_name }}</view>
          <view class="date">{{ post.post_date }}</view>
        </view>
      </view>
      <view class="content">
        <mp-html
          :content="post.content"
          :tag-style="style"
          :selectable="true"
          @ready="isLoading = false"
        >
        </mp-html>
      </view>

      <!-- 标签 -->
      <view class="tags">
        <view v-for="item in post.tags" :key="item.id" class="tag-item">
          <u-tag :text="`#${item.name}`" type="error" plain plain-fill></u-tag>
        </view>
      </view>

      <view class="operation">
        <view class="views">阅读 {{ post.views }}</view>

        <view class="like" @tap="likePost">
          <!--          <u-icon-->
          <!--            :name="is_user_favorite ? 'thumb-up-fill' : 'thumb-up'"-->
          <!--            :color="is_user_favorite ? '#d10000' : '#828282'"-->
          <!--            size="22"-->
          <!--          ></u-icon>-->
          <view class="heart" :class="{ 'is-active': post.is_user_favorite }"></view>
          <view
            :style="{ color: post.is_user_favorite ? '#d10000' : '#828282', marginLeft: '-25rpx' }"
            >{{ post.like_count }}</view
          >
        </view>
      </view>

      <view class="separator"></view>
      <!-- 评论 -->
      <view v-if="isCommentEnabled && post.status === 'publish'" class="comments-wrap">
        <view class="top">
          <view class="subTitle">评论</view>
          <view class="right">
            <view class="item" :class="{ cur: order === 'desc' }" @tap="changeOrder('desc')"
              >最新</view
            >
            <view class="item" :class="{ cur: order === 'asc' }" @tap="changeOrder('asc')"
              >最早</view
            >
          </view>
        </view>
        <view class="subTitle-line"></view>
        <view class="comments-list">
          <view v-if="commentList.length == 0" style="margin: 120rpx 190rpx">
            <u-empty icon="/static/no-message.png" text="暂无评论"></u-empty>
          </view>

          <!-- 0级回复 -->
          <template v-for="(item, index) in commentList" :key="index">
            <view class="comment">
              <!-- 回复标题 -->
              <view class="comment-user" @tap.stop="replyTo(item)">
                <view class="comment-user-avatar">
                  <image :src="item.author_avatar" class="avatarImg"></image>
                </view>
                <view class="comment-meta">
                  <view class="comment-user-meta">
                    <view class="name">{{ item.author_name }}</view>
                    <view class="location">
                      {{
                        item.location
                          ? `${item.location.country_name}${item.location.region_name}网友`
                          : ''
                      }}
                    </view>
                  </view>
                  <view class="comment-date">{{ item.date }}</view>
                </view>
              </view>
              <!-- 回复内容 -->
              <view class="comment-summary" @tap.stop="replyTo(item)">{{ item.content }}</view>

              <!-- 一级回复-->
              <view v-for="(item1, idx) in item.child" :key="idx" class="comment-content-bottom">
                <view class="reply-user" @tap.stop="replyTo(item1)">
                  <text class="comment-name">{{ item1.author_name }}</text>
                  ：{{ item1.content }}
                </view>

                <!-- 使用组件递归生成回复树 -->
                <app-reply :parent="item1" @reply-to="replyTo"></app-reply>
              </view>
              <!-- 一级回复-->
            </view>
          </template>
        </view>
      </view>

      <!-- 底部评论框 -->
      <form v-if="isCommentEnabled" class="comments-bottom-wrap" @submit="reply" @tap.stop="">
        <view class="cu-bar">
          <image class="cu-avatar" :src="avatarUrl" mode="aspectFill"></image>
          <input
            v-model="myComment.content"
            class="solid-bottom"
            :maxlength="300"
            :cursor-spacing="10"
            type="text"
            confirm-type="send"
            :placeholder="myComment.placeholder"
          />
          <button class="cu-btn bg-blue shadow-blur" formType="submit">发送</button>
        </view>
      </form>

      <!-- 底部版权 -->
      <view class="footer">
        <app-footer></app-footer>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import {
  getForumTopicDetail,
  getForumTopicComment,
  postForumReply,
  forumPostLike
} from '@/api/forum'
import { getPlatform } from '@/utils/utils'
import { mapState } from 'pinia'
import { useUserStore } from '@/store/user'
import { useConfigStore } from '@/store/config'
import { DEFAULT_AVATAR_URL } from '@/config'
import type { TopicDetail } from '@/types/forum'
import type { Comment } from '@/types/comment'

let page = 1

export default {
  data() {
    return {
      id: 0,
      isLoading: true,
      post: {
        all_img: [],
        author_avatar: '',
        author_id: 0,
        author_name: '',
        content: '',
        is_comment_enabled: false,
        id: 0,
        is_sticky: false,
        is_super_sticky: false,
        post_date: '',
        reply_count: 0,
        title: '',
        views: 0,
        permalink: '',
        tags: [],
        like_count: 0,
        status: 'publish',
        is_user_favorite: false
      } as TopicDetail,
      style: {
        img: 'margin-bottom: 30rpx',
        p: `font-size: 30rpx;
					line-height: 1.5em;
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
      },
      isLastPage: false,
      commentList: [] as Comment[],
      myComment: {
        id: 0,
        userid: 0,
        placeholder: '评论...',
        content: ''
      },
      order: 'desc' as 'desc' | 'asc'
    }
  },
  computed: {
    ...mapState(useUserStore, ['token', 'userInfo']),
    ...mapState(useConfigStore, ['config', 'isCommentEnabled']),
    isLogin() {
      return !!this.token
    },
    avatarUrl() {
      if (this.isLogin) {
        return this.userInfo.avatar
      } else {
        return DEFAULT_AVATAR_URL
      }
    }
  },
  methods: {
    async fetchPostDetail() {
      try {
        this.post = await getForumTopicDetail(this.id)
      } catch (e) {
        console.error(e)
      }
    },
    async fetchPostReply() {
      if (this.isLastPage) return

      const per_page = 10
      try {
        // 获取评论
        const replies = await getForumTopicComment({
          id: this.id,
          page,
          per_page,
          order: this.order
        })
        this.commentList = [...this.commentList, ...replies]
        page++
        if (replies.length === 0) {
          this.isLastPage = true
        }
      } catch (e) {
        console.error(e)
      }
    },
    likePost() {
      // 判断用户是否登录
      if (!this.isLogin) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          position: 'bottom'
        })

        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }, 1500)
        return
      }

      if (this.post.is_user_favorite) {
        // 本来是喜欢，现在取消喜欢
        this.post.is_user_favorite = !this.post.is_user_favorite
        this.post.like_count -= 1
      } else {
        // 喜欢
        this.post.is_user_favorite = !this.post.is_user_favorite
        this.post.like_count += 1
      }
      try {
        forumPostLike({ id: this.id, isLike: this.post.is_user_favorite })

        uni.$emit('forumLike', {
          is_user_favorite: this.post.is_user_favorite,
          like_count: this.post.like_count
        })
      } catch (e) {
        console.error(e)
      }
    },
    leftClick() {
      const pages = getCurrentPages()
      if (pages[pages.length - 2] && pages[pages.length - 2].route === 'pages/forum/index') {
        uni.navigateBack()
      } else {
        uni.switchTab({
          url: '/pages/forum/index'
        })
      }
    },
    // 选择回复对象
    replyTo(e: Comment) {
      this.myComment = {
        id: e.id,
        userid: e.userid,
        placeholder: '回复：' + e.author_name,
        content: ''
      }
    },
    // 重置我的评论内容
    resetMyComment() {
      this.myComment = {
        id: 0,
        userid: 0,
        placeholder: '评论...',
        content: ''
      }
    },
    reset() {
      page = 1
      this.commentList = []
      this.isLastPage = false
      this.resetMyComment()
    },
    // 提交评论
    async reply() {
      // 如果未登录，重定向至登录界面
      if (!this.isLogin) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
        return
      }

      //检查是否填写评论内容
      if (this.myComment.content.length === 0) {
        uni.showToast({
          title: '没有填写评论内容',
          icon: 'none',
          duration: 2000
        })
        return
      }

      const queryObj = {
        topic_id: this.id, //评论ID
        reply_to_id: this.myComment.id, //父评论ID
        content: this.myComment.content, // 评论内容，
        platform: getPlatform()
      }

      try {
        uni.showLoading({
          title: '评论提交中...'
        })
        const res = await postForumReply(queryObj)

        uni.hideLoading()
        uni.showToast({
          title: res.message,
          icon: 'error',
          duration: 2000
        })
        this.reset()
        this.fetchPostReply()
      } catch (e) {
        console.error(e)
        uni.showToast({
          title: '发表失败',
          icon: 'none',
          duration: 2000,
          position: 'bottom'
        })
      }
    },
    changeOrder(order: 'desc' | 'asc') {
      this.order = order
      this.reset()
      this.fetchPostReply()
    }
  },
  async onLoad(options) {
    if (!options) {
      return
    }
    const { id, mode } = options
    if (!id) {
      return
    }
    this.id = Number(id)
    this.reset()
    await this.fetchPostDetail()
    await this.fetchPostReply()
    setTimeout(() => {
      if (mode === 'comment') {
        uni.pageScrollTo({
          selector: '.operation',
          duration: 100
        })
      }
    }, 1000)
  },
  async onPullDownRefresh() {
    this.reset()
    await this.fetchPostDetail()
    await this.fetchPostReply()
    uni.stopPullDownRefresh()
  },
  onReachBottom() {
    this.fetchPostReply()
  },
  onShareAppMessage() {
    const configStore = useConfigStore()
    return {
      title: this.post.title,
      path: `/pages/forum/post?id=${this.id}`,
      imageUrl: this.post.all_img[0] || configStore.config.shareImageUrl
    }
  },
  onShareTimeline() {
    return {
      title: this.post.title
    }
  }
}
</script>

<style>
page {
  background-color: #fff;
}
</style>

<style lang="scss" scoped>
.nav-bar {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.07),
    0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.skeleton {
  padding: 30rpx 30rpx;

  .item {
    margin-top: 30rpx;

    &:first-child {
      margin-top: 0;
    }
  }
}

.wrap {
  .info {
    display: flex;
    padding: 40rpx 30rpx;

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
    padding: 0 30rpx;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20rpx;
    padding: 0 30rpx;
    gap: 10rpx;
  }

  .operation {
    margin-top: 40rpx;
    display: flex;
    justify-content: space-between;
    padding: 0 30rpx;

    .views {
      color: #828282;
      height: 100rpx;
      line-height: 100rpx;
      font-size: 28rpx;
    }

    .like {
      display: flex;
      gap: 5rpx;
      flex-direction: row;
      color: #828282;
      align-items: center;
      font-size: 28rpx;

      .heart {
        width: 100rpx;
        height: 100rpx;
        background: url('@/static/heart.png') no-repeat 0 0;
        background-size: 2900rpx 100rpx;
        cursor: pointer;

        &.is-active {
          background-position: -2800rpx 0;
          transition: background-position 1s steps(28);
        }
      }
    }
  }

  .separator {
    height: 15rpx;
    background-color: #f4f7f6;
  }

  // 评论
  .comments-wrap {
    padding: 0 30rpx;

    .comment {
      margin: 0 0 60rpx;

      /* 评论区用户名 */
      .comment-user {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        color: #333;

        /* 评论用户头像 */
        .comment-user-avatar {
          position: relative;

          .avatarImg {
            border-radius: 16rpx;
            height: 64rpx;
            width: 64rpx;
            margin-right: 20rpx;
          }
        }

        /* 评论用户昵称 */
        .comment-meta {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .comment-user-meta {
            font-weight: 500;
            flex: 1;
            line-height: 38rpx;

            .name {
              color: #118fff;
            }

            .location {
              color: #959595;
              font-weight: normal;
              font-size: 20rpx;
            }
          }

          /* 评论日期颜色 */
          .comment-date {
            color: #959595;
            font-size: 24rpx;
            line-height: 1.2;
            font-weight: normal;
            outline: none;
            width: 150rpx;
            text-align: right;
          }
        }
      }

      .comment-summary {
        color: #333;
        font-size: 30rpx;
        line-height: 1.8;
        margin-left: 80rpx;
        margin-bottom: 16rpx;
      }

      .comment-content-bottom {
        background-color: #f9fafb;
        margin-left: 80rpx;
        padding: 0 24rpx;

        &:nth-child(3) {
          padding-top: 24rpx;
        }

        &:last-child {
          padding-bottom: 24rpx;
        }

        .reply-user {
          font-size: 28rpx;
          line-height: 1.8;
          color: #333;
        }

        .comment-name {
          color: #118fff;
          font-weight: 500;
        }
      }
    }
  }

  // 底部评论
  .comments-bottom-wrap {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    background-color: white;
    box-shadow: 0 0 6px rgba(30, 20, 20, 0.1);

    .cu-bar {
      padding: 0 10px;
      display: flex;
      position: relative;
      align-items: center;
      min-height: 50px;
      justify-content: space-between;

      .cu-avatar {
        font-variant: small-caps;
        margin: 0;
        padding: 0;
        display: inline-flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        color: var(--white);
        white-space: nowrap;
        position: relative;
        width: 32px;
        height: 32px;
        background-size: cover;
        background-position: center;
        vertical-align: middle;
        font-size: 1.5em;
        border-radius: 50%;
      }

      .solid-bottom {
        overflow: initial;
        line-height: 32px;
        height: 32px;
        min-height: 32px;
        flex: 1;
        font-size: 15px;
        margin: 0 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .cu-btn {
        background-color: #0082ff;
        color: #ffffff;
        position: relative;
        border: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 15px;
        font-size: 14px;
        height: 32px;
        line-height: 1;
        text-align: center;
        text-decoration: none;
        overflow: visible;
        margin-left: initial;
        margin-right: initial;

        &::before {
          content: ' ';
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
          display: block;
          background: inherit;
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: -1;
          transform-origin: 0 0;
          border-radius: inherit;
          transform: scale(1, 1);
          top: 2px;
          left: 2px;
          filter: blur(3px);
          opacity: 0.6;
        }
      }
    }
  }

  .top {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f4f7f6;

    .subTitle {
      font-size: 30rpx;
      padding: 20rpx 0;
    }

    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #959595;
      font-size: 23rpx;

      .item {
        margin-left: 40rpx;

        &.cur {
          color: #333;
        }

        &:last-child {
          position: relative;

          &:before {
            content: '';
            border-left: 1px solid #ccc;
            position: absolute;
            top: 8rpx;
            left: -20rpx;
            height: 20rpx;
          }
        }
      }
    }
  }

  .subTitle-line {
    position: relative;
    margin-bottom: 30rpx;

    &:before {
      content: '';
      position: absolute;
      width: 50rpx;
      height: 4rpx;
      background: #959595;
      top: -5rpx;
      left: 0;
    }
  }

  .footer {
    padding-bottom: 80rpx !important;
  }
}

.fixed-btns {
  position: fixed;
  bottom: 120rpx;
  right: 30rpx;

  .btn {
    width: 80rpx;
    height: 80rpx;
    border: 1px solid #d9d9d9;
    box-shadow:
      5rpx 5rpx 19rpx #d9d9d9,
      -5rpx -5rpx 19rpx #ffffff;
    background-color: rgba($color: #fff, $alpha: 0.8);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30rpx;
  }
}
</style>
