import type { FC } from 'react'
import type { TTooltip } from '../tooltip'

export type TPopoverPlugin = {
  Icon: FC<{}>,
  Popover: FC<{}>,
  tooltipText: TTooltip['children'],
}

export type TComponentWrapper = {
  Component: FC,
  props: any,
}

export type TComponentWrapperPlugin = FC<TComponentWrapper>

export type TPluginContext = {
  popoverPlugin?: TPopoverPlugin,
  ComponentWrapperPlugin?: TComponentWrapperPlugin,
}
