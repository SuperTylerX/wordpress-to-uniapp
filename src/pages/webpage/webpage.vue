<template>
  <web-view :src="url"></web-view>
</template>

<script lang="ts">
import { BASE_URL } from '@/config'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      url: ''
    }
  },
  onLoad: function (options) {
    if (!options) {
      return
    }
    if (options.url) {
      this.url = decodeURIComponent(options.url)
    } else {
      this.url = BASE_URL
    }
  }
})
</script>
<style scoped lang="scss"></style>
