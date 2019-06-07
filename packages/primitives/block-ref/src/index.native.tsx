import { forwardRef, ForwardRefExoticComponent } from 'react'
import { Block, TBlock } from '@primitives/block'
import { View } from 'react-native'

export type TBlockRef = TBlock

export const BlockRef: ForwardRefExoticComponent<TBlockRef> = forwardRef<View>((props, ref) => (
  Block({ ...props, ref })
))

BlockRef.displayName = 'BlockRef'
