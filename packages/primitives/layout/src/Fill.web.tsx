import React, { FC } from 'react'
import { Block } from '@primitives/block'

export type TLayoutFill = {
  floatinIndex?: number,
}

export const LayoutFill: FC<TLayoutFill> = ({ children, floatinIndex }) => (
  <Block
    isFloating
    floatingIndex={floatinIndex}
    top={0}
    right={0}
    bottom={0}
    left={0}
  >
    {children}
  </Block>
)
