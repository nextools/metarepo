import { forwardRef } from 'react'
import type { ForwardRefExoticComponent } from 'react'
import type { View } from 'react-native'
import { PrimitiveBlock } from './PrimitiveBlock'
import type { TPrimitiveBlock } from './types'

export const PrimitiveBlockRef: ForwardRefExoticComponent<TPrimitiveBlock> = forwardRef<View>((props, ref) => (
  PrimitiveBlock({ ...props, ref })
))

PrimitiveBlockRef.displayName = 'PrimitiveBlockRef'
