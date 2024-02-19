<script setup lang="ts">
import { useConfigStore } from '@/store/config'
import { computed } from 'vue'

const configStore = useConfigStore()

const swiperList = computed(() => {
  return configStore.config.expand.swipe_nav.map(item => ({
    ...item,
    redirectType: item.type,
    type: 'image'
  }))
})
</script>

<template>
  <u-swiper
    :list="swiperList"
    :loading="swiperList.length === 0"
    autoplay
    show-title
    indicator
    circular
    key-name="image"
    :height="200"
  ></u-swiper>
</template>

<style scoped lang="scss"></style>
