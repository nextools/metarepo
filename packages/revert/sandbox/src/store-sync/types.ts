import type { TMetaState } from '../store-meta/types'
import type { TState } from '../store/types'

export type TMetaSubState = Pick<TMetaState, 'componentKey' | 'propsIndex' | 'selectedElementPath'>
export type TMainSubState = Pick<TState, 'width' | 'height' | 'transformX' | 'transformY' | 'transformZ' | 'resolutionKey' | 'shouldStretch' | 'hasGrid' | 'isCanvasDarkMode'>

export type TSyncState = TMainSubState & TMetaSubState

export type TSyncStore = {
  setState: (state: unknown) => void,
  subscribe: (observer: (state: TSyncState) => void) => void,
}
