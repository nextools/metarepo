import { forwardRef } from 'react'
import type { ForwardRefExoticComponent } from 'react'
import { PrimitiveBlock } from './PrimitiveBlock'
import type { TPrimitiveBlock } from './types'

export const PrimitiveBlockRef: ForwardRefExoticComponent<TPrimitiveBlock> = forwardRef<HTMLDivElement>((props, ref) => (
  PrimitiveBlock({ ...props, ref })
))

PrimitiveBlockRef.displayName = 'PrimitiveBlockRef'
