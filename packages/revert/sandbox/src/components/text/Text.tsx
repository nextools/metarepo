import { InlineBlock } from '@revert/block'
import React from 'react'
import type { FC } from 'react'
import { PrimitiveText } from './PrimitiveText'
import type { TText } from './types'

export const Text: FC<TText> = (props) => (
  <InlineBlock shouldPreventWrap={props.shouldPreventWrap}>
    <PrimitiveText {...props}/>
  </InlineBlock>
)
