import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { ThemeContext } from '../theme-context'
import { TIcon } from './types'

export const IconSearchSmall = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.searchSmall}
    orientation={orientation}
    size={12}
  />
))

IconSearchSmall.displayName = 'IconSearchSmall'
IconSearchSmall.componentSymbol = SYMBOL_ICON
