<template>
  <web-view :src="url"></web-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { BASE_URL } from '@/config'

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
