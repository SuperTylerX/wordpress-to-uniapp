<script setup lang="ts">
import { deleteMyComment } from '@/api/comment'
import { useUserStore } from '@/store/user'
import type { CommentListItem } from '@/types/comment'
import { redirect } from '@/utils'

withDefaults(
  defineProps<{
    commentList: CommentListItem[]
  }>(),
  {
    commentList: () => []
  }
)

const emit = defineEmits(['refresh'])

const popDelete = (id: number, author_id: number) => {
  // 判断当前用户是否为评论作者，不是则不显示删除选项
  const userStore = useUserStore()
  if (author_id !== userStore.userInfo.id) {
    return
  }

  uni
    .showActionSheet({
      itemList: ['删除评论']
    })
    .then(async data => {
      if (data.tapIndex === 0) {
        try {
          const res = await deleteMyComment(id)
          if (res.code === 'success') {
            uni.showToast({
              title: res.message
            })
            emit('refresh')
          }
        } catch (e) {
          console.error(e)
        }
      }
    })
    .catch(() => {
      // console.error('取消选中菜单')
    })
}
</script>

<template>
  <view>
    <view
      v-for="(item, index) in commentList"
      :key="index"
      class="comment-item"
      hover-class="u-cell-hover"
      @longpress="popDelete(item.id, item.author_id)"
      @tap="
        redirect({
          type: 'apppage',
          path: '/pages/post/post?id=' + item.post
        })
      "
    >
      <view class="comment-user">
        <view class="comment-avatar">
          <image :src="item.author_avatar" mode="aspectFill" class="image"></image>
        </view>
        <view class="comment-info">
          <view class="comment-author">
            {{ item.author_name }}
          </view>
          <view class="comment-date">
            {{ item.date }}
          </view>
        </view>
      </view>
      <view class="comment-content">
        <rich-text :nodes="item.comment_content"></rich-text>
      </view>

      <view class="comment-article"> 原文：「{{ item.post_title }}」 </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.comment-item {
  padding: 30rpx 30rpx 0;

  .comment-user {
    display: flex;

    .comment-avatar {
      .image {
        width: 80rpx;
        height: 80rpx;
        border-radius: 1rem;
      }
    }

    .comment-info {
      margin-left: 30rpx;
      height: 80rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .comment-author {
        font-size: 30rpx;
      }

      .comment-date {
        font-size: 23rpx;
        color: #a3a3a3;
      }
    }
  }

  .comment-content {
    margin-left: 110rpx;
    margin-top: 15rpx;
  }

  .comment-article {
    margin-left: 110rpx;
    margin-top: 15rpx;
    background-color: #f9fafb;
    padding: 15rpx;
  }
}
</style>
