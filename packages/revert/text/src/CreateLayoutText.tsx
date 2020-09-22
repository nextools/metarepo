import { InlineBlock } from '@revert/block'
import type { FC } from 'react'
import React from 'react'
import type { TComponent } from 'refun'
import type { TTextStyle } from './types'

export const CreateLayoutText = <T extends TTextStyle>(PrimitiveText: FC<T>) => {
  const Text: TComponent<T> = (props) => (
    <InlineBlock shouldPreventWrap={props.shouldPreventWrap}>
      <PrimitiveText {...props}/>
    </InlineBlock>
  )

  Text.displayName = 'Text'
  Text.componentSymbol = Symbol('REVERT_TEXT')

  return Text
}
