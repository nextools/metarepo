import { TExtend } from 'tsfn'
import { ThunkAction } from 'redux-thunk'
import { TSnapshotItem, TSnapshotItems } from '@x-ray/snapshots'
import { TListItems, TItem } from '../../chrome/src/types'

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
  payload?: any,
  error?: string,
  meta?: any,
}

export type TAction<T extends string> = TExtend<TAnyAction, { type: T }>
export type TActionWithPayload<T extends string, P extends any> = TExtend<TAnyAction, { type: T, payload: P }>
export type TActionAsync<A extends TAnyAction> = ThunkAction<Promise<void>, TState, undefined, A>

export type TType = 'image' | 'text'

export type TGridItem = TPosition & {
  id: string,
  gridWidth: number,
  gridHeight: number,
}

export type TScreenshotGridItem = TItem & TGridItem

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
  items: TListItems,
  selectedItem: TScreenshotGridItem | null,
})
