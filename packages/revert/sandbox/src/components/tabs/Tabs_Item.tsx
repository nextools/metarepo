import type { ReactElement } from 'react'
import { component, startWithType } from 'refun'
import { SYMBOL_TABS_ITEM } from '../../symbols'

export type TTabs_Item = {
  title: string,
  isDisabled?: boolean,
  children: () => ReactElement | null,
}

export const Tabs_Item = component(
  startWithType<TTabs_Item>()
)(({ children }) => children())

Tabs_Item.displayName = 'Tabs_Item'
Tabs_Item.componentSymbol = SYMBOL_TABS_ITEM
