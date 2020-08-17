import React from 'react'
import { startWithType, component, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconCloseSmall = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.closeSmall}
    orientation={orientation}
    size={12}
  />
))

IconCloseSmall.displayName = 'IconClose'
IconCloseSmall.componentSymbol = SYMBOL_ICON
