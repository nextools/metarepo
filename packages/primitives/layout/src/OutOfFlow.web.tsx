import React, { FC } from 'react'
import { Block } from '@primitives/block'

export type TLayoutOutOfFlow = {
  floatinIndex?: number,
  shouldScroll?: boolean,
  shouldIgnorePointerEvents?: boolean,
}

export const LayoutOutOfFlow: FC<TLayoutOutOfFlow> = ({ children, floatinIndex, shouldScroll, shouldIgnorePointerEvents }) => (
  <Block
    isFloating
    floatingIndex={floatinIndex}
    shouldScroll={shouldScroll}
    shouldIgnorePointerEvents={shouldIgnorePointerEvents}
    top={0}
    right={0}
    bottom={0}
    left={0}
  >
    {children}
  </Block>
)

LayoutOutOfFlow.displayName = 'LayoutOutOfFlow'
