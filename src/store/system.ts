import { defineStore } from 'pinia'
import { reactive } from 'vue'

import { getAppUpdatedVersion } from '@/api/setting'
import type { AppUpdatedVersion } from '@/types/config'

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
      },
      // APP 端特有的属性
      appVersion: '', // manifest 中应用版本名称。
      appVersionCode: '' // manifest 中应用版本名号。
    })

    const appUpdatedVersion = reactive<AppUpdatedVersion>({
      updatedVersion: '',
      updatedVersionCode: 0,
      downloadLink: '',
      iosDownloadLink: '',
      isForceUpdate: false,
      updateLog: ''
    })

    const updateSystemInfo = async () => {
      const res = await uni.getSystemInfo()
      Object.assign(systemInfo, res)
    }

    const updateAppUpdatedVersion = async () => {
      const res = await getAppUpdatedVersion()
      Object.assign(appUpdatedVersion, res)
    }

    return {
      systemInfo,
      updateSystemInfo,
      appUpdatedVersion,
      updateAppUpdatedVersion
    }
  },
  {
    unistorage: true
  }
)
