import { ParentBlock } from '@revert/block'
import { startWithType, component } from 'refun'

export type TLabel = {}

export const Label = component(
  startWithType<TLabel>()
)(({ children }) => (
  <ParentBlock>
    {children}
  </ParentBlock>
))

Label.displayName = 'Label'
Label.componentSymbol = Symbol('REVERT_LABEL')
