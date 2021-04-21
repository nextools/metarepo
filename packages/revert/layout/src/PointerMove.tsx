import type { MouseEvent, CSSProperties } from 'react'
import { component, startWithType, mapHandlers, mapRef, mapWithProps, mapContext } from 'refun'
import { LayoutItemContext } from './LayoutItemContext'
import type { TPointerMove } from './types'

export const PointerMove = component(
  startWithType<TPointerMove>(),
  mapContext(LayoutItemContext),
  mapRef('ref', null as HTMLDivElement | null),
  mapHandlers({
    onPointerUp: ({ onPointerUp }) => (e: MouseEvent<HTMLDivElement>) => {
      const { pageX, pageY } = e

      e.stopPropagation()
      onPointerUp({ x: pageX, y: pageY })
    },
    onPointerMove: ({ onPointerMove }) => (e: MouseEvent<HTMLDivElement>) => {
      const { pageX, pageY } = e

      e.stopPropagation()
      onPointerMove({ x: pageX, y: pageY })
    },
  }),
  mapWithProps(({ left, top, width, height, _direction }) => {
    const style: CSSProperties = {
      position: 'absolute',
      left,
      top,
      width,
      height,
      cursor: _direction === 'horizontal' ? 'col-resize' : 'row-resize',
    }

    return {
      style,
    }
  })
)(({ id, style, onPointerMove, onPointerUp, onPointerLeave }) => (
  <div
    data-id={id}
    style={style}
    onMouseMove={onPointerMove}
    onMouseUp={onPointerUp}
    onMouseLeave={onPointerLeave}
  />
))

PointerMove.displayName = 'PointerMove'
