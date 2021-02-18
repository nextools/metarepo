import { TransformContext } from '@revert/transform'
import type { CSSProperties } from 'react'
import { component, startWithType, mapWithPropsMemo, mapRef, mapContext } from 'refun'
import { UNDEFINED } from 'tsfn'
import { onLayout } from './on-layout'
import { round } from './round'
import type { TPrimitiveSize } from './types'

export const PrimitiveSize = component(
  startWithType<TPrimitiveSize>(),
  mapContext(TransformContext),
  mapWithPropsMemo(({
    left = 0,
    top = 0,
    width,
    maxWidth = 0,
    shouldPreventWrap = false,
    onWidthChange,
  }) => {
    const parentStyle: CSSProperties = {
      position: 'absolute',
      left,
      top,
      width: 'max-content',
    }

    if (shouldPreventWrap) {
      parentStyle.display = 'flex'
    }

    // When NOT measuring - expand Container to provided width
    // This allows TextAlign to slide the text inside
    if (onWidthChange === UNDEFINED && width !== UNDEFINED) {
      parentStyle.width = width
    }

    if (maxWidth > 0) {
      parentStyle.maxWidth = maxWidth
    }

    return {
      parentStyle,
    }
  }, ['width', 'onWidthChange', 'left', 'top', 'maxWidth', 'shouldPreventWrap']),
  mapRef('ref', null as HTMLDivElement | null),
  onLayout(({ ref, _scale, width, height, onWidthChange, onHeightChange }) => {
    if (ref.current === null) {
      return
    }

    const children = ref.current.children
    let {
      top,
      left,
      right,
      bottom,
    } = (children[0] as HTMLElement).getBoundingClientRect()

    for (let i = 1; i < children.length; ++i) {
      const child = children[i] as HTMLElement
      const rect = child.getBoundingClientRect()

      left = Math.min(left, rect.left)
      top = Math.min(top, rect.top)
      right = Math.max(right, rect.right)
      bottom = Math.max(bottom, rect.bottom)
    }

    const measuredWidth = round((right - left) / _scale)
    const measuredHeight = round((bottom - top) / _scale)

    if (onWidthChange !== UNDEFINED && width !== UNDEFINED && width !== measuredWidth) {
      onWidthChange(measuredWidth)
    }

    if (onHeightChange !== UNDEFINED && height !== UNDEFINED && height !== measuredHeight) {
      onHeightChange(measuredHeight)
    }
  })
)(({ ref, parentStyle, children }) => (
  <div style={parentStyle} ref={ref}>
    {children}
  </div>
))

PrimitiveSize.displayName = 'PrimitiveSize'
