import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { Icon } from '../icon'
import { SYMBOL_ICON } from '../../symbols'
import { ThemeContext } from '../theme-context'
import { TIcon } from './types'

export const IconPanelCollapseRight = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.panelCollapseRight}
    orientation={orientation}
  />
))

IconPanelCollapseRight.displayName = 'IconPanelCollapseRight'
IconPanelCollapseRight.componentSymbol = SYMBOL_ICON
