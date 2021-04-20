import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconDropdownChevronSmall = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.dropdownChevronSmall}
    orientation={orientation}
    size={12}
  />
))

IconDropdownChevronSmall.displayName = 'IconDropdownChevronSmall'
IconDropdownChevronSmall.componentSymbol = SYMBOL_ICON
