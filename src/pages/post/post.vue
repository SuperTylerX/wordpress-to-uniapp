<template>
  <view>
    <view v-show="!isLoading" class="wrap" @tap="resetComment">
      <view class="title">{{ article.title.rendered }}</view>
      <view class="info">
        <!--        <u-icon class="icon" name="calendar" size="14"></u-icon>-->
        <!--        <text class="text">{{ article.date.slice(0, 10) }}</text>-->

        <u-icon class="icon" name="list-dot" size="14"></u-icon>
        <text class="text">{{ article.category_name }}</text>

        <u-icon class="icon" name="chat" size="14"></u-icon>
        <text class="text">{{ article.total_comments }}</text>

        <u-icon class="icon" name="thumb-up" size="14"></u-icon>
        <text class="text">{{ article.like_count }}</text>

        <u-icon class="icon" name="eye" size="14"></u-icon>
        <text class="text">{{ article.pageviews }}</text>
      </view>

      <!-- 投稿者信息 -->
      <view class="author-info" @tap="redirectToProfile(article.author)">
        <u-avatar :src="article.author_avatar"></u-avatar>

        <view class="author-name-wrapper">
          <view class="author">{{ article.author_name }}</view>
          <view class="date-info">{{ article.post_date }} 投递</view>
        </view>
      </view>

      <!-- 文章内容 -->
      <view class="content">
        <mp-html
          :content="article.content.rendered"
          :tag-style="style"
          :selectable="true"
          @ready="articleReady"
        ></mp-html>
      </view>

      <!-- 点赞 -->
      <view class="likes">
        <view class="button-wrap" @tap="likeHandler">
          <u-icon class="icon" name="thumb-up" color="#0081FF"></u-icon>
          点个赞
        </view>
        <u-divider
          v-if="article.avatarurls.length !== 0"
          style="margin: 20rpx 0"
          :text="'共有' + article.avatarurls.length + '人点赞'"
        ></u-divider>
        <u-divider v-else style="margin: 20rpx 0" text="还没有人点赞"></u-divider>

        <view class="avatar-wrap">
          <image
            v-for="(item, index) in article.avatarurls"
            :key="index"
            class="avatar-item"
            :src="item.avatarurl"
            mode="aspectFill"
          ></image>
        </view>
      </view>

      <!-- 标签 -->
      <view class="tags">
        <u-tag
          v-for="(item, index) in tags"
          :key="index"
          class="tag-item"
          :text="`#${item.name}`"
          type="error"
          plain
          plain-fill
          @click="redirect({ type: 'apppage', path: '/pages/list/list?tagID=' + item.id })"
        >
        </u-tag>
      </view>

      <!-- 猜你喜欢 -->
      <view v-if="relatedPost.length !== 0" class="relatedPost-wrap">
        <view class="subTitle">猜你喜欢</view>
        <view class="subTitle-line"></view>
        <view class="relatedPost-list">
          <view
            v-for="(item, index) in relatedPost"
            :key="index"
            class="item"
            @tap="redirect({ type: 'apppage', path: '/pages/post/post?id=' + item.id })"
          >
            <image class="item-image" :src="item.post_medium_image" mode="aspectFill"></image>
            <text class="item-title">{{ item.title.rendered }}</text>
          </view>
        </view>
      </view>

      <!-- 评论 -->
      <view v-if="isCommentEnabled" class="comments-wrap">
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
          <view v-if="commentsList.length == 0" style="margin: 120rpx 190rpx">
            <u-empty icon="/static/no-message.png" text="暂无评论"></u-empty>
          </view>
          <!-- 0级回复 -->
          <block v-for="(item, index) in commentsList" :key="index">
            <view class="comment">
              <!-- 回复标题 -->
              <view class="comment-user" @tap.stop="replyTo(item)">
                <view class="comment-user-avatar">
                  <image
                    :src="item.author_avatar"
                    class="avatarImg"
                    @click="redirectToProfile(item.userid)"
                  ></image>
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
              <view class="comment-summary" @tap.stop="replyTo(item)">
                <mp-html :content="item.content" :tag-style="style" :selectable="true"></mp-html>
              </view>

              <!-- 一级回复-->
              <view v-for="(item1, idx) in item.child" :key="idx" class="comment-content-bottom">
                <view class="reply-user" @tap.stop="replyTo(item1)">
                  <text class="comment-name">{{ item1.author_name }}</text> ：{{ item1.content }}
                </view>

                <!-- 使用组件递归生成回复树 -->
                <app-reply :parent="item1" @reply-to="replyTo"></app-reply>
              </view>
              <!-- 一级回复-->
            </view>
          </block>
        </view>
      </view>

      <!-- 底部评论框 -->
      <form
        v-if="isCommentEnabled && article.comment_status == 'open'"
        class="comments-bottom-wrap"
        @submit="reply"
        @tap.stop=""
      >
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

    <!-- 加载图 -->
    <view v-if="isLoading" class="loading-wrap">
      <u-skeleton class="item" rows="10" loading :rows-height="[18, 200, 18]"></u-skeleton>
    </view>

    <view class="fixed-btns">
      <button class="btn" open-type="share" type="default" :plain="true" @tap="shareApp">
        <u-icon name="share"></u-icon>
      </button>

      <view class="btn" @tap="goToTop">
        <u-icon name="arrow-up"></u-icon>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 评论页数
import { onLoad, onReachBottom, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { computed, reactive, ref } from 'vue'

import { getCommentList, postMyComment } from '@/api/comment'
import { getPost, getPostList, postLike } from '@/api/post'
import { getTagList } from '@/api/tag'
import { DEFAULT_AVATAR_URL } from '@/config'
import { DefaultPost } from '@/constants'
import { useConfigStore } from '@/store/config'
import { useUserStore } from '@/store/user'
import type { Comment } from '@/types/comment'
import type { HistoryPostItem, Post } from '@/types/post'
import type { Tag } from '@/types/tag'
import { getPlatform, redirect } from '@/utils'

const isLoading = ref(false)

const configStore = useConfigStore()
const userStore = useUserStore()

const isLogin = computed(() => !!userStore.token)

const avatarUrl = computed(() => {
  if (isLogin.value) {
    return userStore.userInfo.avatar
  } else {
    return DEFAULT_AVATAR_URL
  }
})
const postId = ref(0)

const article = reactive<Post>(DefaultPost)

const style = {
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

// 文章加载完毕回调
const articleReady = () => {
  if (article.id !== id) {
    return
  }
  isLoading.value = false
}

const tags = ref<Tag[]>([])

const relatedPost = ref<Post[]>([])

const getPostDetailHandler = async () => {
  try {
    const res = await getPost(postId.value)
    Object.assign(article, res)

    // 添加到阅读历史
    let history = uni.getStorageSync<HistoryPostItem[]>('history') || []
    // 删去已有的
    history = history.filter(item => item.id !== postId.value)
    // 添加自己
    history.unshift({
      id: postId.value,
      post_medium_image: article.post_medium_image,
      title: article.title,
      date: article.date,
      total_comments: article.total_comments,
      like_count: article.like_count,
      pageviews: article.pageviews
    })
    // 去除超过20个的
    if (history.length > 20) {
      history = history.slice(0, 19)
    }
    uni.setStorageSync('history', history)
  } catch (e) {
    console.error(e)
  }
}

const getPostTagHandler = async () => {
  try {
    tags.value = await getTagList({ post: postId.value })
  } catch (e) {
    console.error(e)
  }
}

const getRelatedPostHandler = async () => {
  try {
    relatedPost.value = (await getPostList({
      per_page: 5,
      page: 1,
      exclude: postId.value,
      tags: article.tags.join(',')
    })) as Post[]
  } catch (e) {
    console.error(e)
  }
}

// 点赞处理
const likeHandler = async () => {
  if (isLogin.value) {
    try {
      const res = await postLike(postId.value)
      if (res.code == 'like_success') {
        // 点赞成功
        article.avatarurls.push({
          avatarurl: avatarUrl.value
        })
      } else if (res.code == 'cancel_like_success') {
        // 取消点赞成功
        article.avatarurls = article.avatarurls.filter(item => item.avatarurl !== avatarUrl.value)
      }
      uni.showToast({
        title: res.message,
        icon: 'success'
      })
    } catch (e) {
      console.error(e)
    }
  } else {
    uni.navigateTo({
      url: '../login/login'
    })
    uni.showToast({
      title: '请先登录...',
      icon: 'none'
    })
  }
}

const goToTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
}

let id = 0

onLoad(option => {
  if (!option) {
    return
  }
  if (!option.id) {
    return
  }
  id = Number(option.id)

  isLoading.value = true
  postId.value = Number(option.id)

  // 获取文章详情
  getPostDetailHandler()
  // 获取文章标签
  getPostTagHandler()
  // 获取猜你喜欢
  getRelatedPostHandler()
  // 获取评论
  isLastPage.value = false
  page = 1
  fetchComments()
})

/************************* 评论代码此处开始 ***************************/
let page = 1
const commentsList = ref<Comment[]>([])
const isLastPage = ref(false)
const myComment = reactive({
  id: 0,
  userid: 0,
  placeholder: '评论...',
  content: ''
})
const order = ref<'desc' | 'asc'>('desc')
const isLoadingComment = ref(false)
const isCommentEnabled = computed(() => configStore.isCommentEnabled)

// 拉取评论
const fetchComments = async () => {
  if (isLastPage.value) {
    return
  }
  isLoadingComment.value = true

  try {
    const res = await getCommentList({
      postid: postId.value,
      limit: 10,
      page: page,
      order: order.value
    })
    const _commentsList = res.data
    if (_commentsList.length < 10) {
      isLastPage.value = true
    } else {
      page++
    }
    commentsList.value = commentsList.value.concat(_commentsList)
    isLoadingComment.value = false
  } catch (e) {
    console.error(e)
    isLoadingComment.value = false
  }
}

// 选择回复对象
const replyTo = (e: Comment) => {
  Object.assign(myComment, {
    id: e.id,
    userid: e.userid,
    placeholder: '回复：' + e.author_name,
    content: ''
  })
}

// 重置我的评论内容
const resetComment = () => {
  Object.assign(myComment, {
    id: 0,
    userid: 0,
    placeholder: '评论...',
    content: ''
  })
}

// 提交评论
const reply = async () => {
  // 如果未登录，重定向至登录界面
  if (!isLogin.value) {
    uni.navigateTo({
      url: '../login/login'
    })
    return
  }

  //检查是否填写评论内容
  if (myComment.content.length === 0) {
    uni.showToast({
      title: '没有填写评论内容',
      icon: 'none',
      duration: 2000
    })
    return
  }

  const queryObj = {
    post: postId.value, //评论ID
    parent: myComment.id, //父评论ID
    content: myComment.content, // 评论内容
    platform: getPlatform()
  }

  try {
    uni.showLoading({
      title: '评论提交中...'
    })
    const res = await postMyComment(queryObj)

    if (res.code == 'success') {
      uni.hideLoading()
      uni.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000
      })
      resetComment()
      page = 1
      commentsList.value = []
      isLastPage.value = false
      fetchComments()

      // #ifdef MP-WEIXIN
      await requestSubscribeMessageWx()
      // #endif

      // #ifdef MP-QQ
      await requestSubscribeMessageQQ()
      // #endif
    } else {
      uni.showToast({
        title: '留言失败',
        icon: 'none',
        duration: 2000,
        position: 'bottom'
      })
    }
  } catch (e) {
    console.error(e)
    uni.hideLoading()
  }
}

// 微信申请一次性订阅消息
const requestSubscribeMessageWx = async () => {
  try {
    if (configStore.config.uni_enable_weixin_push) {
      await wx.requestSubscribeMessage({
        tmplIds: [configStore.config.uni_weixin_comment_reply_template_id]
      })
    }
  } catch (e) {
    console.error(e)
  }
}

// QQ申请一次性订阅消息
const requestSubscribeMessageQQ = async () => {
  qq.subscribeAppMsg({
    tmplIds: [configStore.config.uni_qq_comment_reply_template_id],
    subscribe: true,
    success() {
      // Keep Silence
    },
    fail(e: unknown) {
      console.error(e)
    }
  })
}

const changeOrder = (_order: 'desc' | 'asc') => {
  order.value = _order
  resetComment()
  page = 1
  commentsList.value = []
  isLastPage.value = false
  fetchComments()
}

onReachBottom(() => {
  if (isLoadingComment.value) {
    return
  }
  fetchComments()
})
/************************* 评论代码此处结束 ***************************/

/************************* 分享代码此处开始 ***************************/
onLoad(() => {
  // #ifdef MP-QQ
  qq.showShareMenu({
    showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
  })
  // #endif
})

onShareAppMessage(() => {
  return {
    title: article.title.rendered,
    path: 'pages/post/post?id=' + postId.value,
    imageUrl: article.post_full_image
  }
})

onShareTimeline(() => {
  return {
    title: article.title.rendered,
    imageUrl: article.post_full_image
  }
})

const shareApp = () => {
  // #ifdef APP-PLUS
  // uni.shareWithSystem({

  // 	summary: '这是一个测试分享',
  // 	href: 'https://uniapp.dcloud.io',
  // 	success() {
  // 		// 分享完成，请注意此时不一定是成功分享
  // 	},
  // 	fail() {
  // 		// 分享失败
  // 	}
  // })
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneTimeline',
    type: 0,
    href: 'http://uniapp.dcloud.io/',
    title: 'uni-app分享',
    summary: '我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！',
    imageUrl:
      'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/d8590190-4f28-11eb-b680-7980c8a877b8.png',
    success: function (res) {
      console.error('success:' + JSON.stringify(res))
    },
    fail: function (err) {
      console.error('fail:' + JSON.stringify(err))
    }
  })
  //#endif
}

const redirectToProfile = (author: number) => {
  redirect({ type: 'apppage', path: '/pages/user/profile?userId=' + author })
}
</script>

<style>
page {
  background-color: #ffffff;
}
</style>

<style lang="scss" scoped>
.loading-wrap {
  padding: 30rpx;
}

.wrap {
  margin: 30rpx;

  .title {
    font-size: 40rpx;
    font-weight: bold;
  }

  .info {
    display: flex;
    margin-top: 30rpx;
    color: #bbb;
    font-size: 28rpx;

    .icon {
      margin-right: 5rpx;
    }

    .text {
      margin-right: 20rpx;
    }
  }

  .content {
    margin-top: 30rpx;
    font-size: 35rpx;
    line-height: 2;

    code {
      color: red;
    }

    pre {
      color: red;
    }
  }

  // 标签样式
  .tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 80rpx;
    gap: 10rpx;
  }

  // 点赞样式
  .likes {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 50rpx;

    .button-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 40rpx;
      border: 1rpx solid #0081ff;
      color: #0081ff;
      padding: 15rpx;
      width: 250rpx;
      font-size: 30rpx;
      text-align: center;
      border-radius: 1rem;
    }

    .icon {
      margin-right: 5rpx;
    }

    .avatar-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .avatar-item {
        width: 60rpx;
        height: 60rpx;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
        border-radius: 10rpx;
      }
    }
  }

  // 猜你喜欢
  .relatedPost-wrap {
    margin: 20rpx 0;

    .relatedPost-list {
      .item {
        display: flex;
        margin-bottom: 30rpx;

        .item-image {
          width: 250rpx;
          height: 140rpx;
          background-color: #f5f7f7;
          margin-right: 40rpx;
        }

        .item-title {
          flex: 1;
          font-size: 30rpx;
          line-height: 2;
        }
      }
    }
  }

  // 评论
  .comments-wrap {
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

  // width: 100rpx;
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

.author-info {
  display: flex;
  gap: 30rpx;
  align-items: center;
  margin: 30rpx 0;

  .author-name-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10rpx;

    .author {
      font-size: 30rpx;
      color: #3c9cff;
      font-weight: bold;
    }

    .date-info {
      font-size: 24rpx;
      color: #959595;
    }
  }
}
</style>
