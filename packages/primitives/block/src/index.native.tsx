import React, { Ref } from 'react'
import { View, ViewProps } from 'react-native'
import { TStyle } from '@lada/prefix'
import { startWithType, component, mapDefaultProps, mapProps } from 'refun'
import { TBlockCommon } from './types'

export * from './types'

export type TBlock = TBlockCommon & {
  style?: TStyle,
  ref?: Ref<View>,
}

export const Block = component(
  startWithType<TBlock>(),
  mapDefaultProps({
    shouldStretch: false,
    shouldIgnorePointerEvents: true,
    shouldScroll: false,
    shouldHideOverflow: false,
    style: {} as TStyle,
  }),
  mapProps(
    ({
      id,
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
      ref,
    }) => {
      const styles: TStyle = {
        borderStyle: 'solid',
        borderWidth: 0,
        position: 'relative',
        ...style,
      }

      if (typeof width !== 'undefined') {
        styles.width = width
        styles.flexGrow = 0
        styles.flexShrink = 0
      }

      if (typeof height !== 'undefined') {
        styles.height = height
        styles.flexGrow = 0
        styles.flexShrink = 0
      }

      if (typeof minWidth !== 'undefined') {
        styles.minWidth = minWidth
      }

      if (typeof minHeight !== 'undefined') {
        styles.minHeight = minHeight
      }

      if (typeof top !== 'undefined') {
        styles.top = top
      }

      if (typeof right !== 'undefined') {
        styles.right = right
      }

      if (typeof bottom !== 'undefined') {
        styles.bottom = bottom
      }

      if (typeof left !== 'undefined') {
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

      if (typeof opacity !== 'undefined') {
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
        style: styles,
        children,
        ref,
      }
    }
  )
)('Block', (props) => (
  <View {...props}/>
))
