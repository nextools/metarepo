import type { TOmitKey, TExtend } from 'tsfn'
import type { TJsonValue } from 'typeon'
import type { TResolutionKey } from '../resolutions'

export type TAnyAction = {
  type: string,
  payload?: TJsonValue,
  error?: boolean,
  meta?: TJsonValue,
}

export type TAction<T extends string> = TOmitKey<TExtend<TAnyAction, { type: T }>, 'payload'>
export type TActionCreator<A extends TAnyAction> = () => A
export type TActionWithPayload<T extends string, P extends TJsonValue> = TExtend<TAnyAction, { type: T, payload: P }>

export type TState = {
  width: number,
  height: number,
  hasGrid: boolean,
  shouldStretch: boolean,
  shouldInspect: boolean,
  isCanvasDarkMode: boolean,
  resolutionKey: TResolutionKey | null,
  isNavigationSidebarVisible: boolean,
  isControlsSidebarVisible: boolean,
  transformX: number,
  transformY: number,
  transformZ: number,
}
