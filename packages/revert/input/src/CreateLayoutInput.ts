import { LayoutContext } from '@revert/layout'
import type { FC } from 'react'
import { useContext } from 'react'
import type { TComponent } from 'refun'
import type { TInput, TPrimitiveInput } from './types'

export const CreateLayoutInput = (PrimitiveInput: FC<TPrimitiveInput>) => {
  const Input: TComponent<TInput> = (props) => {
    const {
      _parentLeft,
      _parentTop,
      _parentWidth,
      _parentHeight,
    } = useContext(LayoutContext)

    return PrimitiveInput({
      ...props,
      left: _parentLeft,
      top: _parentTop,
      width: _parentWidth,
      height: _parentHeight,
    })
  }

  Input.displayName = 'Input'
  Input.componentSymbol = Symbol('REVERT_INPUT')

  return Input
}
