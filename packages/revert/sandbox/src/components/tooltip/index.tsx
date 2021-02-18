import type { TTextChildren } from '@revert/text'
import type { TComponent } from 'refun'
import { SYMBOL_TOOLTIP } from '../../symbols'
import { ContentTooltip } from '../content-tooltip'
import type { TContentTooltip } from '../content-tooltip'
import { Text } from '../text'

export type TTooltip = {
  arrowPosition?: TContentTooltip['arrowPosition'],
  children: TTextChildren,
}

export const Tooltip: TComponent<TTooltip> = ({ arrowPosition, children }) => (
  <ContentTooltip arrowPosition={arrowPosition} maxWidth={150}>
    <Text>
      {children}
    </Text>
  </ContentTooltip>
)

Tooltip.displayName = 'Tooltip'
Tooltip.componentSymbol = SYMBOL_TOOLTIP
