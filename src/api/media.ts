import { deleteJSON, postUpload } from '@/api/utils'
import { WORDPRESS_REST_API_URL } from '@/config'
import type { Media } from '@/types/media'

export const uploadMedia = ({ filePath }: { filePath: string }) =>
  postUpload<Media>(`${WORDPRESS_REST_API_URL}/media/`, filePath, {
    name: 'file'
  })

export const deleteMedia = ({ id, force = true }: { id: number; force?: boolean }) =>
  deleteJSON<{ deleted: boolean; previous: Media }>(`${WORDPRESS_REST_API_URL}/media/${id}`, {
    id,
    force
  })
