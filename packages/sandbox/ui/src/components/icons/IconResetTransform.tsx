import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { ThemeContext } from '../theme-context'
import { TIcon } from './types'

export const IconResetTransform = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.resetTransform}
    orientation={orientation}
  />
))

IconResetTransform.displayName = 'IconResetTransform'
IconResetTransform.componentSymbol = SYMBOL_ICON
