import type { HTMLProps, MouseEvent, CSSProperties } from 'react'
import { component, startWithType, mapProps, mapHandlers, onLayout, mapRef } from 'refun'
import { isFunction } from 'tsfn'
import type { TPointer } from './types'

const style: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderWidth: 0,
  position: 'relative',
  flexGrow: 1,
  flexShrink: 1,
  alignSelf: 'stretch',
  minWidth: 0,
}

export const Pointer = component(
  startWithType<TPointer>(),
  mapRef('ref', null as HTMLDivElement | null),
  onLayout(({ ref, onWheel }) => {
    if (ref.current !== null && isFunction(onWheel)) {
      const onWheelEvent = (e: WheelEvent) => {
        const { deltaX, deltaY, ctrlKey, metaKey, altKey, shiftKey } = e

        e.preventDefault()

        onWheel({ x: deltaX, y: deltaY, metaKey, ctrlKey, altKey, shiftKey })
      }

      ref.current.addEventListener('wheel', onWheelEvent, { passive: false })

      return () => {
        ref.current?.removeEventListener('wheel', onWheelEvent)
      }
    }
  }, ['ref']),
  mapHandlers({
    onMouseDown: ({ onDown }) => (e: MouseEvent<HTMLDivElement>) => {
      if (isFunction(onDown)) {
        const { pageX, pageY, metaKey, altKey, shiftKey, ctrlKey } = e.nativeEvent

        onDown({ x: pageX, y: pageY, metaKey, altKey, shiftKey, ctrlKey })
      }
    },
    onMouseUp: ({ onUp }) => (e: MouseEvent<HTMLDivElement>) => {
      if (isFunction(onUp)) {
        const { pageX, pageY, metaKey, altKey, shiftKey, ctrlKey } = e.nativeEvent

        onUp({ x: pageX, y: pageY, metaKey, altKey, shiftKey, ctrlKey })
      }
    },
    onMouseMove: ({ onMove }) => (e: MouseEvent<HTMLDivElement>) => {
      if (isFunction(onMove)) {
        const { pageX, pageY, metaKey, altKey, shiftKey, ctrlKey } = e.nativeEvent

        onMove({ x: pageX, y: pageY, metaKey, altKey, shiftKey, ctrlKey })
      }
    },
  }),
  mapProps(
    ({
      ref,
      isDisabled = false,
      children,
      onEnter,
      onLeave,
      onMouseDown,
      onMouseUp,
      onMouseMove,
      onDown,
      onUp,
      onMove,
    }) => {
      const props: HTMLProps<HTMLDivElement> = {
        style,
        ref,
        children,
      }

      if (!isDisabled) {
        if (isFunction(onEnter)) {
          props.onMouseEnter = onEnter
        }

        if (isFunction(onLeave)) {
          props.onMouseLeave = onLeave
        }

        if (isFunction(onDown)) {
          props.onMouseDown = onMouseDown
        }

        if (isFunction(onUp)) {
          props.onMouseUp = onMouseUp
        }

        if (isFunction(onMove)) {
          props.onMouseMove = onMouseMove
        }
      }

      return props
    }
  )
)((props) => (
  <div {...props}/>
))

Pointer.displayName = 'Pointer'
