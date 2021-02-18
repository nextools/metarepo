import { component, startWithType, mapContext } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { Icon } from '../icon'
import { ThemeContext } from '../theme-context'
import type { TIcon } from './types'

export const IconCopyUrl = component(
  startWithType<TIcon>(),
  mapContext(ThemeContext)
)(({ icons, orientation }) => (
  <Icon
    d={icons.copyUrl}
    orientation={orientation}
  />
))

IconCopyUrl.displayName = 'IconCopyUrl'
IconCopyUrl.componentSymbol = SYMBOL_ICON
