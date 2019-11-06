import React, { Ref, HTMLProps } from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isUndefined, isNumber, TExtend } from 'tsfn'
import { TColor, colorToString } from 'colorido'
import { styleTransformArrayToText } from './styleTransformArrayToText'
import { TBlockCommon } from './types'

export type TBlock = TBlockCommon & {
  style?: TExtend<TStyle, {
    backgroundColor?: TColor,
    borderColor?: TColor,
    color?: TColor,
  }>,
  ref?: Ref<HTMLDivElement>,
}

export const Block = component(
  startWithType<TBlock>(),
  mapDefaultProps({
    shouldStretch: false,
    shouldIgnorePointerEvents: false,
    shouldScroll: false,
    shouldHideOverflow: false,
    minWidth: 0,
    minHeight: 0,
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
      maxWidth,
      maxHeight,
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
      const baseStyle: TStyle = {
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderWidth: 0,
        position: 'relative',
        alignSelf: 'flex-start',
        flexGrow: 0,
        flexShrink: 0,
        minWidth,
        minHeight,
      }

      if (isUndefined(style)) {
        return baseStyle
      }

      const {
        backgroundColor,
        borderColor,
        color,
        ...restOfStyle
      } = style

      const styles: TStyle = {
        ...baseStyle,
        ...restOfStyle,
      }

      if (!isUndefined(backgroundColor)) {
        styles.backgroundColor = colorToString(backgroundColor)
      }

      if (!isUndefined(borderColor)) {
        styles.borderColor = colorToString(borderColor)
      }

      if (!isUndefined(color)) {
        styles.color = colorToString(color)
      }

      if (isNumber(styles.lineHeight)) {
        styles.lineHeight = `${styles.lineHeight}px`
      }

      // TODO: handle only arrays
      if (styles.transform) {
        styles.transform = styleTransformArrayToText(styles.transform)
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

      if (isNumber(maxWidth)) {
        styles.maxWidth = maxWidth
      }

      if (isNumber(maxHeight)) {
        styles.maxHeight = maxHeight
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
        style: normalizeStyle(styles),
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
)((props) => (
  <div {...props}/>
))

Block.displayName = 'Block'
