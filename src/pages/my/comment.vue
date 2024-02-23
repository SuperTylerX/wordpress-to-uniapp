<template>
  <view class="wrap">
    <view class="search_box">
      <view class="topic-list-item">
        <image mode="aspectFill" src="/static/bg-list.jpg" class="cover"></image>
        <view class="topic-item-content">
          <view class="topic-content-brief">
            <text>我的评论</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="commentsList.length === 0" class="empty">
      <u-empty text="尚未评论" icon="/static/no-message.png"></u-empty>
    </view>

    <app-comment v-else :comment-list="commentsList" @refresh="refresh"></app-comment>

    <app-footer></app-footer>
  </view>
</template>

<script lang="ts">
import { getCommentListByUserId } from '@/api/comment'
import type { CommentListItem } from '@/types/comment'
import { useUserStore } from '@/store/user'
let page = 1

export default {
  data() {
    return {
      commentsList: [] as CommentListItem[]
    }
  },
  onLoad() {
    this.fetchComment()
  },
  methods: {
    async fetchComment() {
      const userStore = useUserStore()
      const res = await getCommentListByUserId({
        userId: userStore.userInfo.id,
        limit: 10,
        page: page,
        order: 'desc'
      })
      this.commentsList = res.data
    },
    refresh() {
      this.commentsList = []
      page = 1
      this.fetchComment()
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  .topic-list-item {
    position: relative;
    overflow: hidden;
    background: #f4f6f9;

    .cover {
      display: block;
      width: 100%;
      height: 240rpx;
      filter: brightness(88%);
    }

    .topic-item-content {
      position: absolute;
      z-index: 2;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      vertical-align: middle;
      width: 90%;

      .topic-content-brief {
        font-size: 30rpx;
        font-weight: 500;
        line-height: 1.4;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-bottom: 16rpx;
      }

      .topic-content-num {
        font-size: 24rpx;
        line-height: 24rpx;
        color: #fff;
        margin-bottom: 24rpx;
      }
    }
  }
}

.empty {
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
