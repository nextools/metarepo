import { useState, useRef } from 'react'
import { TExtend, isUndefined, isFunction } from 'tsfn'

export type TMapPressed = {
  isPressed?: boolean,
  onPressIn?: () => void,
  onPressOut?: () => void,
}

export const mapPressed = <P extends TMapPressed>(props: P): TExtend<P, Required<TMapPressed>> => {
  const [isPressed, setIsPressed] = useState(false)

  const prevOnPressIn = useRef<() => void>()
  const prevOnPressOut = useRef<() => void>()
  const onPressIn = useRef<any>()
  const onPressOut = useRef<any>()

  if (isUndefined(onPressIn.current) || (prevOnPressIn.current !== props.onPressIn && isFunction(props.onPressIn))) {
    onPressIn.current = () => {
      setIsPressed(true)

      if (typeof props.onPressIn === 'function') {
        props.onPressIn()
      }
    }
  }

  if (isUndefined(onPressOut.current) || (prevOnPressOut.current !== props.onPressOut && isFunction(props.onPressOut))) {
    onPressOut.current = () => {
      setIsPressed(false)

      if (typeof props.onPressOut === 'function') {
        props.onPressOut()
      }
    }
  }

  prevOnPressIn.current = props.onPressIn
  prevOnPressOut.current = props.onPressOut

  return {
    ...props,
    isPressed: isPressed || Boolean(props.isPressed),
    onPressIn: onPressIn.current,
    onPressOut: onPressOut.current,
  }
}
