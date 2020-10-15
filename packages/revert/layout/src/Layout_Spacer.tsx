import type { TComponent } from 'refun'
import { SYMBOL_LAYOUT_ITEM } from './symbols'
import type { TLayoutSize } from './types'

export type TLayout_Spacer = {
  width?: TLayoutSize,
  height?: TLayoutSize,
}

export const Layout_Spacer: TComponent<TLayout_Spacer> = () => null

Layout_Spacer.displayName = 'Layout_Spacer'
Layout_Spacer.componentSymbol = SYMBOL_LAYOUT_ITEM
