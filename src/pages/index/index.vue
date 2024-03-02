<template>
  <view>
    <index-swiper></index-swiper>
    <index-search-bar></index-search-bar>
    <index-navigator></index-navigator>
    <u-gap bg-color="#F5F7F7" height="10"></u-gap>
    <index-articles></index-articles>
    <app-footer></app-footer>
  </view>
</template>

<script setup lang="ts">
import IndexSwiper from '@/pages/index/components/IndexSwiper.vue'
import IndexSearchBar from '@/pages/index/components/IndexSearchBar.vue'
import IndexNavigator from '@/pages/index/components/IndexNavigator.vue'
import IndexArticles from '@/pages/index/components/IndexArticles.vue'
</script>

<style lang="scss">
page {
  background-color: #fff;
}
</style>
