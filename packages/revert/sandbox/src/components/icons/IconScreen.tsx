import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconScreen = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.screen}
    orientation={orientation}
  />
))

IconScreen.displayName = 'IconScreen'
IconScreen.componentSymbol = SYMBOL_ICON
