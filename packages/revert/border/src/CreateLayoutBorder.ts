import { LayoutContext } from '@revert/layout'
import type { FC } from 'react'
import { useContext } from 'react'
import type { TComponent } from 'refun'
import type { TBorder, TPrimitiveBorder } from './types'

export const CreateLayoutBorder = (PrimitiveBorder: FC<TPrimitiveBorder>) => {
  const Border: TComponent<TBorder> = (props) => {
    const {
      _parentTop,
      _parentLeft,
      _parentWidth,
      _parentHeight,
    } = useContext(LayoutContext)

    return PrimitiveBorder({
      ...props,
      left: _parentLeft,
      top: _parentTop,
      width: _parentWidth,
      height: _parentHeight,
    })
  }

  Border.displayName = 'Border'
  Border.componentSymbol = Symbol('REVERT_BORDER')

  return Border
}

