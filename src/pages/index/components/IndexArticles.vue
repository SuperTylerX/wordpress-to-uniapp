<script setup lang="ts">
import { ref } from 'vue'
import { getPostList } from '@/api/post'
import type { Post } from '@/types/post'
import { onReachBottom } from '@dcloudio/uni-app'

const postsList = ref<Post[]>([])
const isLoading = ref(false)
const isLastPage = ref(false)

let page = 1

const fetchArticles = async () => {
  if (isLoading.value) {
    return
  }

  try {
    isLoading.value = true
    const res = await getPostList({
      per_page: 10,
      orderby: 'date',
      order: 'desc',
      page: page
    })
    isLoading.value = false
    if (Array.isArray(res)) {
      postsList.value = postsList.value.concat(res as Post[])
      page++
    } else if (res.code == 'rest_post_invalid_page_number') {
      // 最后一页了
      isLastPage.value = true
    }
  } catch (e) {
    console.error(e)
  }
}

fetchArticles()

onReachBottom(() => {
  if (!isLastPage.value) {
    fetchArticles()
  }
})
</script>

<template>
  <view class="articles-top">
    <view class="left">最新文章</view>
  </view>

  <!-- 文章列表 -->
  <app-list :posts-list="postsList"></app-list>
  <view v-if="isLoading">
    <u-loading-icon size="20"></u-loading-icon>
  </view>
</template>

<style scoped lang="scss">
.articles-top {
  margin: 30rpx 30rpx;
  font-size: 30rpx;
}
</style>
