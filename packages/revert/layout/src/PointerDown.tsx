import type { MouseEvent, CSSProperties } from 'react'
import { component, startWithType, mapHandlers, mapRef, mapWithProps, mapContext } from 'refun'
import { LayoutItemContext } from './LayoutItemContext'
import type { TPointerDown } from './types'

export const PointerDown = component(
  startWithType<TPointerDown>(),
  mapContext(LayoutItemContext),
  mapRef('ref', null as HTMLDivElement | null),
  mapHandlers({
    onPointerDown: ({ onPointerDown }) => (e: MouseEvent<HTMLDivElement>) => {
      const { pageX, pageY } = e

      e.stopPropagation()
      onPointerDown({ x: pageX, y: pageY })
    },
  }),
  mapWithProps(({
    left,
    top,
    width,
    height,
    overflow = 0,
    _direction,
  }) => {
    const style: CSSProperties = {
      position: 'absolute',
      left: left - overflow,
      top: top - overflow,
      width: width + overflow * 2,
      height: height + overflow * 2,
      cursor: _direction === 'horizontal' ? 'col-resize' : 'row-resize',
    }

    return {
      style,
    }
  })
)(({ id, style, onPointerDown, onPointerEnter, onPointerLeave }) => (
  <div
    data-id={id}
    style={style}
    onMouseDown={onPointerDown}
    onMouseEnter={onPointerEnter}
    onMouseLeave={onPointerLeave}
  />
))

PointerDown.displayName = 'PointerDown'
