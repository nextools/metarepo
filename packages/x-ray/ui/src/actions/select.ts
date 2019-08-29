import { TActionWithPayload, TAnyAction, TScreenshotGridItem, TSnapshotGridItem } from '../types'

const TYPE_SELECT_SCREENSHOT = 'SELECT_SCREENSHOT'
const TYPE_SELECT_SNAPSHOT = 'SELECT_SNAPSHOT'

export type TActionSelectScreenshot = TActionWithPayload<typeof TYPE_SELECT_SCREENSHOT, TScreenshotGridItem | null>
export type TActionSelectSnapshot = TActionWithPayload<typeof TYPE_SELECT_SNAPSHOT, TSnapshotGridItem | null>

export const actionSelectScreenshot = (payload: TScreenshotGridItem | null): TActionSelectScreenshot => ({
  type: TYPE_SELECT_SCREENSHOT,
  payload,
})

export const actionSelectSnapshot = (payload: TSnapshotGridItem | null): TActionSelectSnapshot => ({
  type: TYPE_SELECT_SNAPSHOT,
  payload,
})

export const isActionSelectScreenshot = (obj: TAnyAction): obj is TActionSelectScreenshot => obj.type === TYPE_SELECT_SCREENSHOT
export const isActionSelectSnapshot = (obj: TAnyAction): obj is TActionSelectSnapshot => obj.type === TYPE_SELECT_SNAPSHOT
