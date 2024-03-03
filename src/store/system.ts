import { defineStore } from 'pinia'
import { reactive } from 'vue'

type GetSystemInfoResult = UniNamespace.GetSystemInfoResult
export const useSystemStore = defineStore(
  'system',
  () => {
    // @ts-expect-error 类型错误
    const systemInfo = reactive<GetSystemInfoResult>({
      brand: '',
      model: '',
      pixelRatio: 0,
      windowWidth: 0,
      windowHeight: 0,
      statusBarHeight: 0,
      language: '',
      version: '',
      system: '',
      platform: '',
      fontSizeSetting: 0,
      SDKVersion: '',
      benchmarkLevel: 0,
      albumAuthorized: false,
      cameraAuthorized: false,
      locationAuthorized: false,
      microphoneAuthorized: false,
      notificationAuthorized: false,
      notificationAlertAuthorized: false,
      notificationBadgeAuthorized: false,
      notificationSoundAuthorized: false,
      bluetoothEnabled: false,
      locationEnabled: false,
      wifiEnabled: false,
      safeArea: {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0
      }
    })

    const updateSystemInfo = async () => {
      const res = await uni.getSystemInfo()
      Object.assign(systemInfo, res)
    }
    return {
      systemInfo,
      updateSystemInfo
    }
  },
  {
    // @ts-expect-error 增加持久化
    unistorage: true
  }
)
