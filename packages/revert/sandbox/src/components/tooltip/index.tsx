import React from 'react'
import { component, startWithType } from 'refun'
import { SYMBOL_TOOLTIP } from '../../symbols'
import { ContentTooltip } from '../content-tooltip'
import type { TContentTooltip } from '../content-tooltip'
import { Text } from '../text'

export type TTooltip = {
  arrowPosition?: TContentTooltip['arrowPosition'],
  children: string,
}

export const Tooltip = component(
  startWithType<TTooltip>()
)(({
  arrowPosition,
  children,
}) => (
  <ContentTooltip arrowPosition={arrowPosition} maxWidth={150}>
    <Text>
      {children}
    </Text>
  </ContentTooltip>
))

Tooltip.displayName = 'Tooltip'
Tooltip.componentSymbol = SYMBOL_TOOLTIP
