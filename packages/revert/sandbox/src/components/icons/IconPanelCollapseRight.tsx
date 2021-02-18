import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

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
