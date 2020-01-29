import { useState, useRef } from 'react'
import { NOOP } from 'tsfn'
import { TPointer } from '@primitives/pointer'
import { TTransform } from '../../types'

const ZOOM_SCROLL_MULT = 0.02
const ZOOM_PINCH_MULT = 2.5
const TRANSFORM_THRESHOLD = 0.01
const filterZoom = (value: number) => Math.min(Math.max(value, 0.2), 10)

export type TMapTransform = {
  canvasLeft: number,
  canvasTop: number,
  canvasWidth: number,
  canvasHeight: number,
  componentLeft: number,
  componentTop: number,
  _x: number,
  _y: number,
  dispatchTransform: (arg: TTransform) => void,
  transform: TTransform,
}

export const mapTransform = <P extends TMapTransform>(props: P) => {
  const [transform, setTransform] = useState(props.transform)
  const propsRef = useRef(props)
  const transformRef = useRef(transform)
  const cursorX = useRef(0)
  const cursorY = useRef(0)
  const onMove = useRef<TPointer['onMove']>(NOOP)
  const onWheel = useRef<TPointer['onWheel']>(NOOP)
  const isTransformingRef = useRef(false)
  const isTransforming = isTransformingRef.current

  isTransformingRef.current = false
  propsRef.current = props
  transformRef.current = transform

  if (onMove.current === NOOP) {
    onMove.current = ({ x, y }) => {
      const props = propsRef.current
      const prevTransform = transformRef.current
      const canvasWidthHalf = props.canvasWidth / 2
      const canvasHeightHalf = props.canvasHeight / 2

      cursorX.current = (x - props._x - props.canvasLeft - prevTransform.x - canvasWidthHalf) / prevTransform.z
      cursorY.current = (y - props._y - props.canvasTop - prevTransform.y - canvasHeightHalf) / prevTransform.z
    }
  }

  if (onWheel.current === NOOP) {
    onWheel.current = ({ x, y, metaKey, ctrlKey }) => {
      const props = propsRef.current
      const prevTransform = transformRef.current

      isTransformingRef.current = true

      let transform: TTransform

      if (metaKey || ctrlKey) {
        const deltaY = (ctrlKey ? -y * ZOOM_PINCH_MULT : y) * ZOOM_SCROLL_MULT
        const zoom = filterZoom(prevTransform.z + deltaY)
        const zoomDiff = zoom - prevTransform.z

        // console.log(deltaY, zoom)

        transform = {
          x: prevTransform.x - cursorX.current * zoomDiff,
          y: prevTransform.y - cursorY.current * zoomDiff,
          z: zoom,
        }
      } else {
        cursorX.current += x / prevTransform.z
        cursorY.current += y / prevTransform.z

        transform = {
          x: prevTransform.x - x,
          y: prevTransform.y - y,
          z: prevTransform.z,
        }
      }

      props.dispatchTransform(transform)
      setTransform(transform)
    }
  }

  if (!isTransforming && (
    Math.abs(props.transform.x - transform.x) > TRANSFORM_THRESHOLD ||
    Math.abs(props.transform.y - transform.y) > TRANSFORM_THRESHOLD ||
    Math.abs(props.transform.z - transform.z) > TRANSFORM_THRESHOLD
  )) {
    setTransform(props.transform)
  }

  return {
    ...props,
    transform,
    isTransforming,
    onMove: onMove.current,
    onWheel: onWheel.current,
  }
}
