import { forwardRef, ForwardRefExoticComponent } from 'react'
import { Block, TBlock } from '../block'

export type TBlockRef = TBlock

export const BlockRef: ForwardRefExoticComponent<TBlockRef> = forwardRef<HTMLDivElement>((props, ref) => (
  Block({ ...props, ref })
))

BlockRef.displayName = 'BlockRef'
