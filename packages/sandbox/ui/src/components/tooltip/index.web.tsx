import React from 'react'
import { component, startWithType } from 'refun'
import { SYMBOL_TOOLTIP } from '../../symbols'
import { ContentTooltip, TContentTooltip } from '../content-tooltip'
import { SizeText } from '../size-text'

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
    <SizeText>
      {children}
    </SizeText>
  </ContentTooltip>
))

Tooltip.displayName = 'Tooltip'
Tooltip.componentSymbol = SYMBOL_TOOLTIP
