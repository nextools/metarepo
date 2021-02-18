import { Fragment } from 'react'
import type{ ReactNode } from 'react'
import type { TComponent } from 'refun'
import { SYMBOL_SWITCH_POPOVER_CONTENT } from '../../symbols'

export type TSwitchPopover_Content = {
  children: ReactNode,
}

export const SwitchPopover_Content: TComponent<TSwitchPopover_Content> = ({ children }) => (
  <Fragment>
    {children}
  </Fragment>
)

SwitchPopover_Content.displayName = 'SwitchPopover_Content'
SwitchPopover_Content.componentSymbol = SYMBOL_SWITCH_POPOVER_CONTENT
