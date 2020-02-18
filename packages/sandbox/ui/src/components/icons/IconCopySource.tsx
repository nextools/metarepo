import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { ThemeContext } from '../theme-context'
import { TIcon } from './types'

export const IconCopySource = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.copySource}
    orientation={orientation}
  />
))

IconCopySource.displayName = 'IconCopySource'
IconCopySource.componentSymbol = SYMBOL_ICON
