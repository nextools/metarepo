import React, { HTMLProps, MouseEvent } from 'react'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapProps, mapHandlers, mapRefLayout, mapDefaultProps } from 'refun'
import { isFunction } from 'tsfn'
import { TPointer } from './types'

const style = normalizeStyle({
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
})

export const Pointer = component(
  startWithType<TPointer>(),
  mapDefaultProps({
    isDisabled: false,
  }),
  mapRefLayout('ref', (ref: HTMLDivElement, { onWheel }) => {
    if (ref !== null && isFunction(onWheel)) {
      ref.addEventListener('wheel', (e) => {
        const { deltaX, deltaY, ctrlKey, metaKey, altKey, shiftKey } = e

        e.preventDefault()

        onWheel({ x: deltaX, y: deltaY, metaKey, ctrlKey, altKey, shiftKey })
      }, { passive: false })
    }

    return {}
  }, []),
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
      isDisabled,
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
