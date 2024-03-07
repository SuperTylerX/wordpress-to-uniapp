import { useSystemStore } from '@/store/system'

export async function checkUpdate() {
  const systemStore = useSystemStore()
  await systemStore.updateAppUpdatedVersion()

  // 取本地版本号
  const currentAppVersionCode = Number(systemStore.systemInfo.appVersionCode)
  // 取服务器版本号
  const appUpdatedVersion = systemStore.appUpdatedVersion

  // 检查是否需要更新
  const needUpdate = appUpdatedVersion.updatedVersionCode > currentAppVersionCode // 检查是否需要升级（对比版本号）

  if (!needUpdate) {
    //不需要更新
    return false
  }

  //弹出更新
  try {
    await uni.navigateTo({
      url: '/pages/app-update/app-update',
      animationType: 'fade-in'
    })
  } catch (e) {
    console.error(e)
  }

  return true
}
