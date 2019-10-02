import { useState, useRef } from 'react'
import { isFunction, NOOP } from 'tsfn'

export type TMapHovered = {
  isHovered?: boolean,
  onPointerEnter?: () => void,
  onPointerLeave?: () => void,
}

export const mapHovered = <P extends TMapHovered>(props: P): P & Required<TMapHovered> => {
  const [isHovered, setIsHovered] = useState(false)

  const origOnPointerEnterRef = useRef<() => void>()
  const origOnPointerLeaveRef = useRef<() => void>()
  const onPointerEnterRef = useRef<() => void>(NOOP)
  const onPointerLeaveRef = useRef<() => void>(NOOP)

  origOnPointerEnterRef.current = props.onPointerEnter
  origOnPointerLeaveRef.current = props.onPointerLeave

  if (onPointerEnterRef.current === NOOP) {
    onPointerEnterRef.current = () => {
      setIsHovered(true)

      if (isFunction(origOnPointerEnterRef.current)) {
        origOnPointerEnterRef.current()
      }
    }
  }

  if (onPointerLeaveRef.current === NOOP) {
    onPointerLeaveRef.current = () => {
      setIsHovered(false)

      if (isFunction(origOnPointerLeaveRef.current)) {
        origOnPointerLeaveRef.current()
      }
    }
  }

  return {
    ...props,
    isHovered: isHovered || Boolean(props.isHovered),
    onPointerEnter: onPointerEnterRef.current,
    onPointerLeave: onPointerLeaveRef.current,
  }
}
