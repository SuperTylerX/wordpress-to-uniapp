import { get } from '@/api/utils'
import { PLUGIN_REST_API_URL } from '@/config'
import type { AppUpdatedVersion, Config } from '@/types/config'

export const getHomeConfig = () => get<Config>(`${PLUGIN_REST_API_URL}/options/homeconfig`)

export const getAppUpdatedVersion = () =>
  get<AppUpdatedVersion>(`${PLUGIN_REST_API_URL}/options/getAppUpdatedVersion`)
