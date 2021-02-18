import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconGrid = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.grid}
    orientation={orientation}
  />
))

IconGrid.displayName = 'IconGrid'
IconGrid.componentSymbol = SYMBOL_ICON
