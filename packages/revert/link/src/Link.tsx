import { Size } from '@revert/size'
import type { TComponent } from 'refun'
import { PrimitiveLink } from './PrimitiveLink'
import type { TLink } from './types'

export const Link: TComponent<TLink> = (props) => (
  <Size>
    {PrimitiveLink(props)}
  </Size>
)

Link.displayName = 'Link'
Link.componentSymbol = Symbol('REVERT_LINK')
