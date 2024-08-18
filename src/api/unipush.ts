import { postJSON } from '@/api/utils'
import { PLUGIN_REST_API_URL } from '@/config'

/**
 * @description 注册Cid
 * @param cid - Cid
 */
export const registerCid = (cid: string) =>
  postJSON<void>(`${PLUGIN_REST_API_URL}/unipush/registerCid`, { cid })
