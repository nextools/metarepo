import { RootContext } from '@revert/root'
import { Fragment } from 'react'
import { createPortal } from 'react-dom'
import { component, mapContext, mapHandlers, mapStateRef, mapWithPropsMemo, startWithType } from 'refun'
import { isString } from 'tsfn'
import { LayoutContext } from './LayoutContext'
import { LayoutInteractiveContext } from './LayoutInteractiveContext'
import { LayoutItemContext } from './LayoutItemContext'
import { LayoutPortalContext } from './LayoutPortalContext'
import { PointerDown } from './PointerDown'
import { PointerMove } from './PointerMove'
import { SYMBOL_LAYOUT_ITEM, SYMBOL_LAYOUT_MOVE, SYMBOL_LAYOUT_MOVE_BEGIN, SYMBOL_LAYOUT_MOVE_END } from './symbols'
import type { TLayoutSize, TPointerEvent } from './types'
import { isInside } from './utils'

export type TLayout_Resize = {
  id?: string,
  width?: TLayoutSize,
  height?: TLayoutSize,
  overflow?: number,
}

export const Layout_Resize = component(
  startWithType<TLayout_Resize>(),
  mapContext(LayoutItemContext),
  mapContext(LayoutPortalContext),
  mapContext(RootContext),
  mapStateRef('stateRef', 'flushState', () => ({
    isHovered: false,
    isPressed: false,
  }), []),
  mapHandlers({
    onPointerEnter: ({ stateRef, flushState }) => () => {
      stateRef.current.isHovered = true
      flushState()
    },
    onPointerLeave: ({ stateRef, flushState }) => () => {
      if (stateRef.current.isPressed) {
        // When isPressed becomes true - another large DIV overlaps screen
        // And we get incorrect onPointerLeave event
        return
      }

      stateRef.current.isHovered = false
      flushState()
    },
    onPointerPortalLeave: ({ stateRef, flushState }) => () => {
      stateRef.current.isHovered = false
      stateRef.current.isPressed = false
      flushState()
    },
    onPointerDown: ({ stateRef, flushState, _direction, _itemIndex, _onItemMove }) => (e: TPointerEvent) => {
      const pos = _direction === 'horizontal' ? e.x : e.y

      stateRef.current.isPressed = true
      _onItemMove?.(_itemIndex, pos, SYMBOL_LAYOUT_MOVE_BEGIN)
      flushState()
    },
    onPointerUp: ({ stateRef, flushState, overflow, _direction, _itemIndex, _onItemMove, _x, _y, _width, _height }) => (e: TPointerEvent) => {
      const pos = _direction === 'horizontal' ? e.x : e.y

      if (!isInside(_x, _y, _width, _height, e.x, e.y, overflow)) {
        stateRef.current.isHovered = false
      }

      stateRef.current.isPressed = false
      _onItemMove?.(_itemIndex, pos, SYMBOL_LAYOUT_MOVE_END)
      flushState()
    },
    onPointerMove: ({ _direction, _itemIndex, _onItemMove }) => (e: TPointerEvent) => {
      const pos = _direction === 'horizontal' ? e.x : e.y

      _onItemMove?.(_itemIndex, pos, SYMBOL_LAYOUT_MOVE)
    },
  }),
  mapWithPropsMemo(({ id }) => {
    if (isString(id)) {
      return {
        overlayId: `${id}-overlay`,
      }
    }

    return {}
  }, ['id'])
)(({
  _x,
  _y,
  _left,
  _top,
  _width,
  _height,
  _rootWidth,
  _rootHeight,
  overflow,
  id,
  overlayId,
  portalElement,
  stateRef,
  onPointerDown,
  onPointerUp,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  onPointerPortalLeave,
  children,
}) => (
  <Fragment>
    <LayoutInteractiveContext.Provider
      value={{
        _isHovered: stateRef.current.isHovered,
        _isPressed: stateRef.current.isPressed,
      }}
    >
      <LayoutContext.Provider
        value={{
          _x,
          _y,
          _parentLeft: _left,
          _parentTop: _top,
          _parentWidth: _width,
          _parentHeight: _height,
          _left,
          _top,
          _width,
          _height,
        }}
      >
        {children}
      </LayoutContext.Provider>
    </LayoutInteractiveContext.Provider>
    {portalElement !== null && (
      createPortal(
        <Fragment>
          <PointerDown
            id={id}
            left={_x}
            top={_y}
            width={_width}
            height={_height}
            overflow={overflow}
            onPointerDown={onPointerDown}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          />
          {stateRef.current.isPressed && (
            <PointerMove
              id={overlayId}
              left={0}
              top={0}
              width={_rootWidth}
              height={_rootHeight}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerPortalLeave}
            />
          )}
        </Fragment>,
        portalElement
      )
    )}
  </Fragment>
))

Layout_Resize.displayName = 'Layout_Resize'
Layout_Resize.componentSymbol = SYMBOL_LAYOUT_ITEM
