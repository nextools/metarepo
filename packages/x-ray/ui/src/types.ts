import { TJsonValue } from 'typeon'
import { TExtend } from 'tsfn'
import { ThunkAction } from 'redux-thunk'
import { TScreenshotItem, TScreenshotItems } from '@x-ray/screenshot-utils'
import { TSnapshotItem, TSnapshotItems } from '@x-ray/snapshots'
import { TItem } from '@x-ray/common-utils'

export { TItem } from '@x-ray/common-utils'
export { TSnapshotItem, TSnapshotItems } from '@x-ray/snapshots'
export { TScreenshotItem, TScreenshotItems } from '@x-ray/screenshot-utils'

export type TPosition = {
  top: number,
  left: number,
}

export type TSize = {
  width: number,
  height: number,
}

export type TRect = TPosition & TSize

export type TAnyAction = {
  type: string,
  payload?: TJsonValue,
  error?: string,
  meta?: TJsonValue,
}

export type TAction<T extends string> = TExtend<TAnyAction, { type: T }>
export type TActionWithPayload<T extends string, P extends TJsonValue> = TExtend<TAnyAction, { type: T, payload: P }>
export type TActionAsync<A extends TAnyAction> = ThunkAction<Promise<void>, TState, any, A>

export type TType = 'image' | 'text'

export type TItemType = 'new' | 'deleted' | 'diff'

export type TGridItem = TItem & TPosition & {
  id: string,
  gridWidth: number,
  gridHeight: number,
}

export type TScreenshotGridItem = TScreenshotItem & TGridItem

export type TSnapshotGridItem = TSnapshotItem & TGridItem

export type TState = {
  error?: string,
  isSaved: boolean,
  isLoading: boolean,
  discardedItems: string[],
  filteredFiles: string[],
  files: string[],
} & ({
  type: 'text' | null,
  items: TSnapshotItems,
  selectedItem: TSnapshotGridItem | null,
} | {
  type: 'image' | null,
  items: TScreenshotItems,
  selectedItem: TScreenshotGridItem | null,
})
