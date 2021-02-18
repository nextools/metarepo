import { LayoutContext } from '@revert/layout'
import type { FC } from 'react'
import type { TDemoComponent } from './types'

export const DemoComponentRevert: FC<TDemoComponent> = ({
  left,
  top,
  width,
  height,
  onHeightChange,
  children,
}) => (
  <LayoutContext.Provider
    value={{
      _x: left,
      _y: height,
      _left: left,
      _top: top,
      _width: width,
      _height: height,
      _maxWidth: width,
      _parentLeft: left,
      _parentTop: top,
      _parentWidth: width,
      _parentHeight: height,
      _onHeightChange: onHeightChange,
    }}
  >
    {children}
  </LayoutContext.Provider>
)
