import { forwardRef, ForwardRefExoticComponent } from 'react'
import { PrimitiveBlock, TPrimitiveBlock } from '../primitive-block'

export const PrimitiveBlockRef: ForwardRefExoticComponent<TPrimitiveBlock> = forwardRef<HTMLDivElement>((props, ref) => (
  PrimitiveBlock({ ...props, ref })
))

PrimitiveBlockRef.displayName = 'PrimitiveBlockRef'
