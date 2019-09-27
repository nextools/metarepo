import { forwardRef, ForwardRefExoticComponent } from 'react'
import { View } from 'react-native'
import { Block, TBlock } from '../block'

export type TBlockRef = TBlock

export const BlockRef: ForwardRefExoticComponent<TBlockRef> = forwardRef<View>((props, ref) => (
  Block({ ...props, ref })
))

BlockRef.displayName = 'BlockRef'
