import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconSourceCollapseArrowDownSmall = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    size={12}
    d={icons.sourceCollapseArrowDownSmall}
    orientation={orientation}
  />
))

IconSourceCollapseArrowDownSmall.displayName = 'IconSourceCollapseArrowDownSmall'
IconSourceCollapseArrowDownSmall.componentSymbol = SYMBOL_ICON
