import { TGridItem } from '../../types'

export const isVisibleItem = (item: TGridItem, top: number, height: number): boolean => {
  return (item.top + item.gridHeight > top) && (item.top < top + height)
}
