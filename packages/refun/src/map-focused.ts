import { useState, useRef } from 'react'
import { TExtend, isUndefined, isFunction } from 'tsfn'

export type TMapFocused = {
  isFocused?: boolean,
  onFocus?: () => void,
  onBlur?: () => void
}

export const mapFocused = <P extends TMapFocused>(props: P): TExtend<P, Required<TMapFocused>> => {
  const [isFocused, setIsFocused] = useState(false)

  const prevOnFocus = useRef<() => void>()
  const prevOnBlur = useRef<() => void>()
  const onFocus = useRef<any>()
  const onBlur = useRef<any>()

  if (isUndefined(onFocus.current) || prevOnFocus.current !== props.onFocus && isFunction(props.onFocus)) {
    onFocus.current = () => {
      setIsFocused(true)

      if (isFunction(props.onFocus)) {
        props.onFocus()
      }
    }
  }

  if (isUndefined(onBlur.current) || (prevOnBlur.current !== props.onBlur && isFunction(props.onBlur))) {
    onBlur.current = () => {
      setIsFocused(false)

      if (isFunction(props.onBlur)) {
        props.onBlur()
      }
    }
  }

  prevOnFocus.current = props.onFocus
  prevOnBlur.current = props.onBlur

  return {
    ...props,
    isFocused: isFocused || Boolean(props.isFocused),
    onFocus: onFocus.current,
    onBlur: onBlur.current,
  }
}
