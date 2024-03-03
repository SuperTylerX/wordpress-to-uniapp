<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useConfigStore } from '@/store/config'
import { useSystemStore } from '@/store/system'

onLaunch(() => {
  const configStore = useConfigStore()
  configStore.getConfig()
  const systemStore = useSystemStore()
  systemStore.updateSystemInfo()
})
onShow(() => {
  // console.log('App Show')
})
onHide(() => {
  // console.log('App Hide')
})
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
</style>
