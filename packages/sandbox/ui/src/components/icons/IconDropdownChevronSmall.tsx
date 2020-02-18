import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { ThemeContext } from '../theme-context'
import { TIcon } from './types'

export const IconDropdownChevronSmall = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.dropdownChevronSmall}
    orientation={orientation}
    size={12}
  />
))

IconDropdownChevronSmall.displayName = 'IconDropdownChevronSmall'
IconDropdownChevronSmall.componentSymbol = SYMBOL_ICON
