import { TJsonValue } from 'typeon'
import { TOmitKey, TExtend } from 'tsfn'
import { ThunkAction } from 'redux-thunk'
import { TResolutionKey } from '../resolutions'

export type TAnyAction = {
  type: string,
  payload?: TJsonValue,
  error?: boolean,
  meta?: TJsonValue,
}

export type TAction<T extends string> = TOmitKey<TExtend<TAnyAction, { type: T }>, 'payload'>
export type TActionCreator<A extends TAnyAction> = () => A
export type TActionWithPayload<T extends string, P extends TJsonValue> = TExtend<TAnyAction, { type: T, payload: P }>
export type TActionWithPayloadCreator<A extends TAnyAction> = (payload: A['payload']) => A
export type TActionAsync<A extends TAnyAction> = ThunkAction<Promise<void>, TState, undefined, A>

export type TState = Readonly<{
  width: number,
  height: number,
  hasGrid: boolean,
  shouldStretch: boolean,
  shouldInspect: boolean,
  isCanvasDarkMode: boolean,
  componentKey: string | null,
  selectedElementPath: string,
  selectedSetIndex: string,
  resolutionKey: TResolutionKey | null,
  isNavigationSidebarVisible: boolean,
  isControlsSidebarVisible: boolean,
  transformX: number,
  transformY: number,
  transformZ: number,
}>
