import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconStretch = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.stretch}
    orientation={orientation}
  />
))

IconStretch.displayName = 'IconStretch'
IconStretch.componentSymbol = SYMBOL_ICON
