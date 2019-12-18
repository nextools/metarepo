import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { ThemeContext } from '../theme-context'
import { TIcon } from './types'

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
