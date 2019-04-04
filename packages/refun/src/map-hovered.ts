import { useState, useRef } from 'react'
import { isUndefined, isFunction, TExtend } from 'tsfn'

export type TMapHovered = {
  isHovered?: boolean
  onPointerEnter?: () => void,
  onPointerLeave?: () => void
}

export const mapHovered = <P extends TMapHovered>(props: P): TExtend<P, Required<TMapHovered>> => {
  const [isHovered, setIsHovered] = useState(false)

  const prevOnPointerEnter = useRef<() => void>()
  const prevOnPointerLeave = useRef<() => void>()
  const onPointerEnter = useRef<any>()
  const onPointerLeave = useRef<any>()

  if (isUndefined(onPointerEnter.current) || (prevOnPointerEnter.current !== props.onPointerEnter && isFunction(props.onPointerEnter))) {
    onPointerEnter.current = () => {
      setIsHovered(true)

      if (isFunction(props.onPointerEnter)) {
        props.onPointerEnter()
      }
    }
  }

  if (isUndefined(onPointerLeave.current) || (prevOnPointerLeave.current !== props.onPointerLeave && isFunction(props.onPointerLeave))) {
    onPointerLeave.current = () => {
      setIsHovered(false)

      if (isFunction(props.onPointerLeave)) {
        props.onPointerLeave()
      }
    }
  }

  prevOnPointerEnter.current = props.onPointerEnter
  prevOnPointerLeave.current = props.onPointerLeave

  return {
    ...props,
    isHovered: isHovered || Boolean(props.isHovered),
    onPointerEnter: onPointerEnter.current,
    onPointerLeave: onPointerLeave.current,
  }
}
