<script setup lang="ts">
import { ref } from 'vue'

const searchText = ref('')

const formSubmit = () => {
  if (searchText.value.length === 0) {
    uni.showToast({
      title: '请至少输入一个字符',
      icon: 'none',
      position: 'bottom'
    })
    return
  }

  uni.navigateTo({
    url: '../list/list?search=' + searchText.value
  })
}
</script>

<template>
  <form id="search-form" @submit="formSubmit">
    <view class="search-box">
      <input
        v-model="searchText"
        class="search-input"
        confirm-type="search"
        placeholder="搜索你感兴趣的内容..."
        @confirm="formSubmit"
      />
      <button class="search-button" form-type="submit" size="mini" plain="true">
        <icon type="search" color="#959595" size="16"></icon>
      </button>
    </view>
  </form>
</template>

<style scoped lang="scss">
// 搜索框部分
.search-box {
  display: flex;
  flex-direction: row;
  background-color: #f5f7f7;
  padding: 24rpx;

  .search-button {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: #fff;
    border-radius: 0 4px 4px 0;
    // #ifdef MP-ALIPAY
    height: 112rpx;
    // #endif

    &::after {
      border: none;
    }
  }

  .search-input {
    flex: 9;
    background-color: #fff;
    padding: 32rpx 0 32rpx 32rpx;
    font-size: 30rpx;
    border-radius: 4px 0 0 4px;
  }
}
</style>
