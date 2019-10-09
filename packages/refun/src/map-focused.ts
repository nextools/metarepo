import { useState, useRef } from 'react'
import { isFunction, NOOP } from 'tsfn'

export type TMapFocused = {
  isFocused?: boolean,
  onFocus?: () => void,
  onBlur?: () => void,
}

export const mapFocused = <P extends TMapFocused>(props: P): P & Required<TMapFocused> => {
  const [isFocused, setIsFocused] = useState(false)

  const origOnFocusRef = useRef<() => void>()
  const origOnBlurRef = useRef<() => void>()
  const onFocusRef = useRef<() => void>(NOOP)
  const onBlurRef = useRef<() => void>(NOOP)

  origOnFocusRef.current = props.onFocus
  origOnBlurRef.current = props.onBlur

  if (onFocusRef.current === NOOP) {
    onFocusRef.current = () => {
      setIsFocused(true)

      if (isFunction(origOnFocusRef.current)) {
        origOnFocusRef.current()
      }
    }
  }

  if (onBlurRef.current === NOOP) {
    onBlurRef.current = () => {
      setIsFocused(false)

      if (isFunction(origOnBlurRef.current)) {
        origOnBlurRef.current()
      }
    }
  }

  return {
    ...props,
    isFocused: isFocused || Boolean(props.isFocused),
    onFocus: onFocusRef.current,
    onBlur: onBlurRef.current,
  }
}
