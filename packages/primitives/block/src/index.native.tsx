import { isUndefined } from 'util'
import React, { Ref } from 'react'
import { View, ViewProps } from 'react-native'
import { TStyle, normalizeStyle } from 'stili'
import { startWithType, component, mapDefaultProps, mapProps } from 'refun'
import { isNumber, TExtend } from 'tsfn'
import { TColor, colorToString } from 'colorido'
import { TBlockCommon } from './types'

export type TBlock = TBlockCommon & {
  style?: TExtend<TStyle, {
    backgroundColor?: TColor,
    borderColor?: TColor,
    color?: TColor,
  }>,
  ref?: Ref<View>,
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
      ref,
    }) => {
      const baseStyle: TStyle = {
        borderStyle: 'solid',
        borderWidth: 0,
        position: 'relative',
        flexDirection: 'row',
        flexGrow: 0,
        flexShrink: 0,
        alignSelf: 'flex-start',
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

      if (isNumber(opacity)) {
        styles.opacity = opacity
      }

      if (shouldScroll) {
        styles.overflow = 'scroll'
      }

      if (shouldHideOverflow) {
        styles.overflow = 'hidden'
      }

      const props: ViewProps = {}

      if (shouldIgnorePointerEvents) {
        props.pointerEvents = 'none'
      }

      if (typeof id === 'string') {
        props.testID = id
      }

      return {
        ...props,
        style: normalizeStyle(styles),
        children,
        ref,
      }
    }
  )
)((props) => (
  <View {...props}/>
))

Block.displayName = 'Block'
