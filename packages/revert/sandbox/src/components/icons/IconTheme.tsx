import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconTheme = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.theme}
    orientation={orientation}
  />
))

IconTheme.displayName = 'IconTheme'
IconTheme.componentSymbol = SYMBOL_ICON
