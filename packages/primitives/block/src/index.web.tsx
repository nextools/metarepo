import React, { Ref, HTMLProps } from 'react'
import { prefixStyle, TStyle } from '@lada/prefix'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isUndefined } from 'tsfn'
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
        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderWidth: 0,
        position: 'relative',
        alignSelf: 'flex-start',
        /* flexbox hack */
        minWidth: 0,
        ...style,
      }

      if (!isUndefined(style.lineHeight)) {
        styles.lineHeight = `${style.lineHeight}px`
      }

      // TODO: handle only arrays
      if (style.transform) {
        styles.transform = styleTransformArrayToText(style.transform)
      }

      if (!isUndefined(width)) {
        styles.width = width
        styles.flexGrow = 0
        styles.flexShrink = 0
      }

      if (!isUndefined(height)) {
        styles.height = height
        styles.flexGrow = 0
        styles.flexShrink = 0
      }

      if (!isUndefined(minWidth)) {
        styles.minWidth = minWidth
      }

      if (!isUndefined(minHeight)) {
        styles.minHeight = minHeight
      }

      if (!isUndefined(top)) {
        styles.top = top
      }

      if (!isUndefined(right)) {
        styles.right = right
      }

      if (!isUndefined(bottom)) {
        styles.bottom = bottom
      }

      if (!isUndefined(left)) {
        styles.left = left
      }

      if (shouldStretch) {
        styles.flexGrow = 1
        styles.alignSelf = 'stretch'
      }

      if (isFloating) {
        styles.position = 'absolute'
      }

      if (isFloating && typeof floatingIndex !== 'undefined') {
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

      if (!isUndefined(opacity)) {
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
