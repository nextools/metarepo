import type { TScreenshotGridItem } from '../../types'
import { isVisibleItem } from './is-visible-item'

export const hasDiffItems = (cols: TScreenshotGridItem[][], top: number, height: number): boolean => {
  for (const col of cols) {
    for (const item of col) {
      if (item.type === 'DIFF' && isVisibleItem(item, top, height)) {
        return true
      }
    }
  }

  return false
}
