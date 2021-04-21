import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconResetTransform = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.resetTransform}
    orientation={orientation}
  />
))

IconResetTransform.displayName = 'IconResetTransform'
IconResetTransform.componentSymbol = SYMBOL_ICON
