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

export type TComponentPlugin = {
  ComponentWrapper?: FC<TComponentWrapper>,
  shouldMeasureComponent?: boolean,
}

export type TPluginContext = {
  popoverPlugin?: TPopoverPlugin,
  ComponentWrapper?: FC<TComponentWrapper>,
  shouldMeasureComponent?: boolean,
}
