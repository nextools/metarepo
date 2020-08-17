import React from 'react'
import { startWithType, component, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconCanvas = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.canvas}
    orientation={orientation}
  />
))

IconCanvas.displayName = 'IconCanvas'
IconCanvas.componentSymbol = SYMBOL_ICON
