import { useState, useRef } from 'react'
import { isFunction, NOOP } from 'tsfn'

export type TMapPressed = {
  isPressed?: boolean,
  onPressIn?: () => void,
  onPressOut?: () => void,
}

export const mapPressed = <P extends TMapPressed>(props: P): P & Required<TMapPressed> => {
  const origOnPressInRef = useRef<() => void>()
  const origOnPressOutRef = useRef<() => void>()
  const [isPressed, setIsPressed] = useState(false)
  const onPressInRef = useRef<() => void>(NOOP)
  const onPressOutRef = useRef<() => void>(NOOP)

  origOnPressInRef.current = props.onPressIn
  origOnPressOutRef.current = props.onPressOut

  if (onPressInRef.current === NOOP) {
    onPressInRef.current = () => {
      setIsPressed(true)

      if (isFunction(origOnPressInRef.current)) {
        origOnPressInRef.current()
      }
    }
  }

  if (onPressOutRef.current === NOOP) {
    onPressOutRef.current = () => {
      setIsPressed(false)

      if (isFunction(origOnPressOutRef.current)) {
        origOnPressOutRef.current()
      }
    }
  }

  return {
    ...props,
    isPressed: isPressed || Boolean(props.isPressed),
    onPressIn: onPressInRef.current,
    onPressOut: onPressOutRef.current,
  }
}
