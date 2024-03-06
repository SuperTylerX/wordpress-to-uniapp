<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useConfigStore } from '@/store/config'
import { useSystemStore } from '@/store/system'
import { checkUpdate } from '@/pages/app-update/app-update-check'

const configStore = useConfigStore()
const systemStore = useSystemStore()

onLaunch(async () => {
  await Promise.all([configStore.getConfig(), systemStore.updateSystemInfo()])

  // #ifdef APP-PLUS
  // APP检查更新
  checkUpdate()
  // #endif
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
