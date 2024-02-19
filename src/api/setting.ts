import { get } from '@/api/utils'
import { PLUGIN_REST_API_URL } from '@/config'
import type { Config } from '@/types/config'

export const getHomeConfig = () => get<Config>(`${PLUGIN_REST_API_URL}/options/homeconfig`)
