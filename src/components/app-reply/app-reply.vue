<template>
  <view>
    <view v-for="(item, idx) in parent.child" :key="idx">
      <view class="reply-user" @tap.stop="replyTo(item)">
        <text class="comment-name">{{ item.author_name }}</text>
        回复
        <text class="comment-name">{{ parent.author_name }}</text>
        ：{{ item.content }}
        <app-reply :parent="item" @reply-to="replyTo"></app-reply>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Comment } from '@/types/comment'

defineProps<{
  parent: Comment
}>()

const emit = defineEmits<{
  replyTo: [item: Comment]
}>()

// const emit = defineEmits<{
//   (e: 'replyTo', item: Comment): void
// }>()

const replyTo = (item: Comment) => {
  emit('replyTo', item)
}
</script>

<style lang="scss" scoped>
.reply-user {
  font-size: 28rpx;
  line-height: 1.8;
  color: #333;
}

.comment-name {
  color: #118fff;
  font-weight: 500;
}
</style>
