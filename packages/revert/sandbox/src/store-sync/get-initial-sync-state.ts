import type { TKeyOf } from 'tsfn'
import { initialState as metaInitialState } from '../store-meta/initial-state'
import { initialState as mainInitialState } from '../store/initial-state'
import { objectPick } from '../utils'
import type { TSyncState, TMainSubState, TMetaSubState } from './types'

export const mainStateKeys: TKeyOf<TMainSubState>[] = ['width', 'height', 'transformX', 'transformY', 'transformZ', 'resolutionKey', 'shouldStretch', 'hasGrid', 'isCanvasDarkMode']
export const metaStateKeys: TKeyOf<TMetaSubState>[] = ['componentKey', 'propsIndex']

export const pickMainSubState = (state: TSyncState): TMainSubState => objectPick(state, mainStateKeys)
export const pickMetaSubState = (state: TSyncState): TMetaSubState => objectPick(state, metaStateKeys)

export const getMainInitialState = (): TMainSubState => objectPick(mainInitialState, mainStateKeys)
export const getMetaInitialState = (): TMetaSubState => objectPick(metaInitialState, metaStateKeys)

export const getInitialSyncState = (): TSyncState => ({
  ...getMainInitialState(),
  ...getMetaInitialState(),
})
