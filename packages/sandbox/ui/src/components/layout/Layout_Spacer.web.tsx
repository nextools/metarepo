import { component, startWithType } from 'refun'
import { SYMBOL_LAYOUT_ITEM } from '../../symbols'
import { TLayoutSize } from './types'

export type TLayout_Spacer = {
  id?: string,
  width?: TLayoutSize,
  height?: TLayoutSize,
}

export const Layout_Spacer = component(
  startWithType<TLayout_Spacer>()
)(() => null)

Layout_Spacer.displayName = 'Layout_Spacer'
Layout_Spacer.componentSymbol = SYMBOL_LAYOUT_ITEM
