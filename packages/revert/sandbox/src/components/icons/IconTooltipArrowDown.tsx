import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconTooltipArrowDown = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.tooltipArrowDown}
    orientation={orientation}
  />
))

IconTooltipArrowDown.displayName = 'IconTooltipArrowDown'
IconTooltipArrowDown.componentSymbol = SYMBOL_ICON
