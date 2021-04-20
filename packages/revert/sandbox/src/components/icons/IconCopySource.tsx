import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconCopySource = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.copySource}
    orientation={orientation}
  />
))

IconCopySource.displayName = 'IconCopySource'
IconCopySource.componentSymbol = SYMBOL_ICON
