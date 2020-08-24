import React from 'react'
import { startWithType, component, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconCheckmarkSmall = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    size={12}
    d={icons.checkmarkSmall}
    orientation={orientation}
  />
))

IconCheckmarkSmall.displayName = 'IconCheckmarkSmall'
IconCheckmarkSmall.componentSymbol = SYMBOL_ICON
