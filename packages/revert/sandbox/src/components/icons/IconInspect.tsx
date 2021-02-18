import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconInspect = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.inspect}
    orientation={orientation}
  />
))

IconInspect.displayName = 'IconInspect'
IconInspect.componentSymbol = SYMBOL_ICON
