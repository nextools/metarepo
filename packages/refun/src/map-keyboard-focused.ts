import { useState, useRef } from 'react'
import { isFunction, NOOP } from 'tsfn'

export type TMapKeyboardFocused = {
  isKeyboardFocused?: boolean,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
}

export const mapKeyboardFocused = <P extends TMapKeyboardFocused>(props: P): P & Required<TMapKeyboardFocused> => {
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false)

  const origOnFocusRef = useRef<() => void>()
  const origOnBlurRef = useRef<() => void>()
  const origOnPressInRef = useRef<() => void>()
  const origOnPressOutRef = useRef<() => void>()
  const isPressed = useRef(false)
  const onPressInRef = useRef<() => void>(NOOP)
  const onPressOutRef = useRef<() => void>(NOOP)
  const onFocusRef = useRef<() => void>(NOOP)
  const onBlurRef = useRef<() => void>(NOOP)

  origOnFocusRef.current = props.onFocus
  origOnBlurRef.current = props.onBlur
  origOnPressInRef.current = props.onPressIn
  origOnPressOutRef.current = props.onPressOut

  if (onPressInRef.current === NOOP) {
    onPressInRef.current = () => {
      isPressed.current = true

      if (isFunction(origOnPressInRef.current)) {
        origOnPressInRef.current()
      }
    }
  }

  if (onPressOutRef.current === NOOP) {
    onPressOutRef.current = () => {
      isPressed.current = false

      if (isFunction(origOnPressOutRef.current)) {
        origOnPressOutRef.current()
      }
    }
  }

  if (onFocusRef.current === NOOP) {
    onFocusRef.current = () => {
      if (isPressed.current === false) {
        setIsKeyboardFocused(true)
      }

      if (isFunction(origOnFocusRef.current)) {
        origOnFocusRef.current()
      }
    }
  }

  if (onBlurRef.current === NOOP) {
    onBlurRef.current = () => {
      setIsKeyboardFocused(false)

      if (isFunction(origOnBlurRef.current)) {
        origOnBlurRef.current()
      }
    }
  }

  return {
    ...props,
    isKeyboardFocused: isKeyboardFocused || Boolean(props.isKeyboardFocused),
    onFocus: onFocusRef.current,
    onBlur: onBlurRef.current,
    onPressIn: onPressInRef.current,
    onPressOut: onPressOutRef.current,
  }
}
