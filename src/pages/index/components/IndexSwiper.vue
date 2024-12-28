<script setup lang="ts">
import { computed } from 'vue'

import { useConfigStore } from '@/store/config'
import { redirect } from '@/utils'

const configStore = useConfigStore()

const swiperList = computed(() => {
  return configStore.config.expand.swipe_nav.map(item => ({
    ...item,
    redirectType: item.type,
    type: 'image'
  }))
})

const handleClick = async (index: number) => {
  const item = swiperList.value[index]
  try {
    if (item.redirectType === 'apppage') {
      await redirect({
        type: 'apppage',
        path: item.path
      })
    } else if (item.redirectType === 'webpage') {
      await redirect({
        type: 'webpage',
        url: item.path
      })
    }
  } catch (e) {
    console.error(e)
  }
}
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
    @click="handleClick"
  ></u-swiper>
</template>

<style scoped lang="scss"></style>
