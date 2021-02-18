import { Size } from '@revert/size'
import type { FC } from 'react'
import type { TComponent } from 'refun'
import type { TTextStyle } from './types'

export const CreateLayoutText = <T extends TTextStyle>(PrimitiveText: FC<T>) => {
  const Text: TComponent<T> = (props) => (
    <Size shouldPreventWrap={props.shouldPreventWrap}>
      {PrimitiveText(props)}
    </Size>
  )

  Text.displayName = 'Text'
  Text.componentSymbol = Symbol('REVERT_TEXT')

  return Text
}
