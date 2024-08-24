<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useConfigStore } from '@/store/config'
import { useSystemStore } from '@/store/system'
import { checkUpdate } from '@/pages/app-update/app-update-check'
import type { AnyType } from '@/types/typescript'
import type { PushData } from '@/types/push'

const configStore = useConfigStore()
const systemStore = useSystemStore()

onLaunch(async () => {
  await Promise.all([configStore.getConfig(), systemStore.updateSystemInfo()])

  // #ifdef APP-PLUS
  // APP检查更新
  checkUpdate()
  // #endif

  // 添加监听从系统消息中心点击某条消息启动应用事件
  plus.push.addEventListener(
    'click',
    async (msg: AnyType) => {
      // console.log('[LOG] Push Message: ', msg)
      if (msg.payload.type === 'redirect') {
        const payload = msg.payload as PushData<'redirect'>
        // 跳转到指定页面
        try {
          await uni.redirectTo({
            url: payload.data.url
          })
        } catch (e) {
          console.error(e)
          await uni.switchTab({
            url: payload.data.url
          })
        }
      }
      // 手动清零角标
      plus.runtime.setBadgeNumber(0)
    },
    false
  )
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
