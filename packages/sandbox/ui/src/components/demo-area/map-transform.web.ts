import { useState, useRef } from 'react'
import { isUndefined } from 'tsfn'
import { TPointer } from '@primitives/pointer'
import { TTransform } from '../../types'

const EMPTY_TRANSFORM: TTransform = { x: 0, y: 0, z: 1 }
const ZOOM_SCROLL_MULT = 0.02
const ZOOM_PINCH_MULT = 2.5
const TRANSFORM_THRESHOLD = 0.01
const filterZoom = (value: number) => Math.min(Math.max(value, 0.2), 10)
const scrollZoom = (value: number, scrollValue: number) => value + scrollValue * ZOOM_SCROLL_MULT

export type TMapTransform = {
  canvasLeft: number,
  canvasTop: number,
  canvasWidth: number,
  canvasHeight: number,
  componentLeft: number,
  componentTop: number,
  dispatchTransform: (arg: TTransform) => void,
  transform: TTransform,
}

export const mapTransform = (left: number, top: number) => <P extends TMapTransform>(props: P) => {
  const [transform, setTransform] = useState(props.transform)
  const propsRef = useRef(props)
  const transformRef = useRef(transform)
  const cursorX = useRef(0)
  const cursorY = useRef(0)
  const onMove = useRef<TPointer['onMove']>()
  const onWheel = useRef<TPointer['onWheel']>()
  const onReset = useRef<() => void>()
  const isTransformingRef = useRef(false)

  const isTransforming = isTransformingRef.current
  isTransformingRef.current = false

  propsRef.current = props
  transformRef.current = transform

  if (isUndefined(onMove.current)) {
    onMove.current = ({ x, y }) => {
      const props = propsRef.current
      const prevTransform = transformRef.current
      const canvasWidthHalf = props.canvasWidth / 2
      const canvasHeightHalf = props.canvasHeight / 2

      cursorX.current = (x - left - props.canvasLeft - prevTransform.x - canvasWidthHalf) / prevTransform.z
      cursorY.current = (y - top - props.canvasTop - prevTransform.y - canvasHeightHalf) / prevTransform.z
    }
  }

  if (isUndefined(onWheel.current)) {
    onWheel.current = ({ x, y, metaKey, ctrlKey }) => {
      const props = propsRef.current
      const prevTransform = transformRef.current

      isTransformingRef.current = true

      let transform: TTransform

      if (metaKey || ctrlKey) {
        const deltaY = ctrlKey ? -y * ZOOM_PINCH_MULT : y
        const zoom = filterZoom(scrollZoom(prevTransform.z, deltaY))
        const zoomDiff = zoom - prevTransform.z

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

  if (isUndefined(onReset.current)) {
    onReset.current = () => {
      transformRef.current = EMPTY_TRANSFORM

      props.dispatchTransform(EMPTY_TRANSFORM)
      setTransform(EMPTY_TRANSFORM)
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
    onReset: onReset.current,
  }
}
