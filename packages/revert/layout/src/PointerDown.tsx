import type { MouseEvent, CSSProperties } from 'react'
import { component, startWithType, mapHandlers, mapRef, mapWithProps } from 'refun'
import type { TPointerDown } from './types'

export const PointerDown = component(
  startWithType<TPointerDown>(),
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
    direction,
  }) => {
    const isHandleHorizontal = direction === 'vertical'

    const style: CSSProperties = {
      position: 'absolute',
      left: isHandleHorizontal ? left : left - overflow,
      top: isHandleHorizontal ? top - overflow : top,
      width: isHandleHorizontal ? width : width + overflow * 2,
      height: isHandleHorizontal ? height + overflow * 2 : height,
      cursor: isHandleHorizontal ? 'row-resize' : 'col-resize',
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
