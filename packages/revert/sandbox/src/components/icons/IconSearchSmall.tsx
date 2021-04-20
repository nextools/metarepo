import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconSearchSmall = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.searchSmall}
    orientation={orientation}
    size={12}
  />
))

IconSearchSmall.displayName = 'IconSearchSmall'
IconSearchSmall.componentSymbol = SYMBOL_ICON
