import { useState, useRef } from 'react'
import { TExtend, isUndefined, isFunction } from 'tsfn'

export type TMapKeyboardFocused = {
  isKeyboardFocused?: boolean,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
}

export const mapKeyboardFocused = <P extends TMapKeyboardFocused>(props: P): TExtend<P, Required<TMapKeyboardFocused>> => {
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false)

  const prevOnFocus = useRef<() => void>()
  const prevOnBlur = useRef<() => void>()
  const prevOnPressIn = useRef<() => void>()
  const prevOnPressOut = useRef<() => void>()
  const isPressed = useRef(false)
  const onPressIn = useRef<any>()
  const onPressOut = useRef<any>()
  const onFocus = useRef<any>()
  const onBlur = useRef<any>()

  if (isUndefined(onPressIn.current) || (prevOnPressIn.current !== props.onPressIn && isFunction(props.onPressIn))) {
    onPressIn.current = () => {
      isPressed.current = true

      if (isFunction(props.onPressIn)) {
        props.onPressIn()
      }
    }
  }

  if (isUndefined(onPressOut.current) || (prevOnPressOut.current !== props.onPressOut && isFunction(props.onPressOut))) {
    onPressOut.current = () => {
      isPressed.current = false

      if (isFunction(props.onPressOut)) {
        props.onPressOut()
      }
    }
  }

  if (isUndefined(onFocus.current) || (prevOnFocus.current !== props.onFocus && isFunction(props.onFocus))) {
    onFocus.current = () => {
      if (isPressed.current === false) {
        setIsKeyboardFocused(true)
      }

      if (isFunction(props.onFocus)) {
        props.onFocus()
      }
    }
  }

  if (isUndefined(onBlur.current) || (prevOnBlur.current !== props.onBlur && isFunction(props.onBlur))) {
    onBlur.current = () => {
      setIsKeyboardFocused(false)

      if (isFunction(props.onBlur)) {
        props.onBlur()
      }
    }
  }

  prevOnFocus.current = props.onFocus
  prevOnBlur.current = props.onBlur
  prevOnPressIn.current = props.onPressIn
  prevOnPressOut.current = props.onPressOut

  return {
    ...props,
    isKeyboardFocused: isKeyboardFocused || Boolean(props.isKeyboardFocused),
    onFocus: onFocus.current,
    onBlur: onBlur.current,
    onPressIn: onPressIn.current,
    onPressOut: onPressOut.current,
  }
}
