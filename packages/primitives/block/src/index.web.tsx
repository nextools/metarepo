import React, { Ref, HTMLProps } from 'react'
import { prefixStyle, TStyle } from '@lada/prefix'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isUndefined, isNumber } from 'tsfn'
import { styleTransformArrayToText } from './styleTransformArrayToText'
import { TBlockCommon } from './types'

export type TBlock = TBlockCommon & {
  style?: TStyle,
  ref?: Ref<HTMLDivElement>,
}

export const Block = component(
  startWithType<TBlock>(),
  mapDefaultProps({
    shouldStretch: false,
    shouldIgnorePointerEvents: false,
    shouldScroll: false,
    shouldHideOverflow: false,
    style: {} as TStyle,
  }),
  mapProps(
    ({
      id,
      ref,
      style,
      width,
      height,
      minWidth,
      minHeight,
      top,
      right,
      bottom,
      left,
      isFloating,
      floatingIndex,
      opacity,
      children,
      shouldStretch,
      shouldScroll,
      shouldHideOverflow,
      shouldIgnorePointerEvents,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerMove,
    }) => {
      const styles: TStyle = {
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderWidth: 0,
        position: 'relative',
        alignSelf: 'flex-start',
        flexGrow: 0,
        flexShrink: 0,
        minWidth: 0,
        ...style,
      }

      if (isNumber(style.lineHeight)) {
        styles.lineHeight = `${style.lineHeight}px`
      }

      // TODO: handle only arrays
      if (style.transform) {
        styles.transform = styleTransformArrayToText(style.transform)
      }

      if (isNumber(width)) {
        styles.width = width
        styles.flexGrow = 0
        styles.flexShrink = 0
      }

      if (isNumber(height)) {
        styles.height = height
        styles.alignSelf = 'flex-start'
      }

      if (isNumber(minWidth)) {
        styles.minWidth = minWidth
      }

      if (isNumber(minHeight)) {
        styles.minHeight = minHeight
      }

      if (isNumber(top)) {
        styles.top = top
      }

      if (isNumber(right)) {
        styles.right = right
      }

      if (isNumber(bottom)) {
        styles.bottom = bottom
      }

      if (isNumber(left)) {
        styles.left = left
      }

      if (shouldStretch) {
        styles.flexGrow = 1
        styles.flexShrink = 1
        styles.alignSelf = 'stretch'
      }

      if (isFloating) {
        styles.position = 'absolute'
      }

      if (isFloating && isNumber(floatingIndex)) {
        styles.zIndex = floatingIndex
      }

      if (shouldIgnorePointerEvents) {
        styles.pointerEvents = 'none'
      }

      if (shouldScroll) {
        styles.overflow = 'scroll'
      }

      if (shouldHideOverflow) {
        styles.overflow = 'hidden'
      }

      if (isNumber(opacity)) {
        styles.opacity = opacity
      }

      const props: HTMLProps<HTMLDivElement> = {
        style: prefixStyle(styles),
        children,
        onMouseEnter: onPointerEnter,
        onMouseLeave: onPointerLeave,
        onMouseDown: onPointerDown,
        onMouseUp: onPointerUp,
        onMouseMove: onPointerMove,
      }

      if (typeof id === 'string') {
        props.id = id
      }

      if (!isUndefined(ref)) {
        props.ref = ref
      }

      return props
    }
  )
)('Block', (props) => (
  <div {...props}/>
))
