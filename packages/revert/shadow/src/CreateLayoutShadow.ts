import { LayoutContext } from '@revert/layout'
import type { FC } from 'react'
import { useContext } from 'react'
import type { TComponent } from 'refun'
import type { TPrimitiveShadow, TShadow } from './types'

export const CreateLayoutShadow = (PrimitiveShadow: FC<TPrimitiveShadow>) => {
  const Shadow: TComponent<TShadow> = (props) => {
    const {
      _parentLeft,
      _parentTop,
      _parentWidth,
      _parentHeight,
    } = useContext(LayoutContext)

    return PrimitiveShadow({
      ...props,
      left: _parentLeft,
      top: _parentTop,
      width: _parentWidth,
      height: _parentHeight,
    })
  }

  Shadow.displayName = 'Shadow'
  Shadow.componentSymbol = Symbol('REVERT_SHADOW')

  return Shadow
}
