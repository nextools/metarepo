import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { ThemeContext } from '../theme-context'
import { TIcon } from './types'

export const IconSourceCollapseArrowDownSmall = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    size={12}
    d={icons.sourceCollapseArrowDownSmall}
    orientation={orientation}
  />
))

IconSourceCollapseArrowDownSmall.displayName = 'IconSourceCollapseArrowDownSmall'
IconSourceCollapseArrowDownSmall.componentSymbol = SYMBOL_ICON
