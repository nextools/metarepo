import React, { Ref, ReactNode } from 'react'
import { View, ViewProps } from 'react-native'
import { TStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isNumber } from 'tsfn'
import { TBlockCommon } from './types'

export type TBlock = TBlockCommon & {
  ref?: Ref<View>,
}

export const Block = component(
  startWithType<TBlock>(),
  mapDefaultProps({
    shouldFlow: false,
    shouldHideOverflow: false,
    shouldIgnorePointerEvents: false,
    shouldForceAcceleration: false,
    shouldScroll: false,
  }),
  mapProps(
    ({
      width,
      height,
      maxWidth,
      minWidth,
      minHeight,
      top,
      left,
      floatingIndex,
      opacity,
      children,
      shouldScroll,
      shouldHideOverflow,
      shouldFlow,
      shouldIgnorePointerEvents,
    }) => {
      const styles: TStyle = {
        position: 'absolute',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flexGrow: 0,
        flexBasis: 'auto',
        minWidth: 0,
        left: 0,
        top: 0,
      }

      const props: ViewProps & { children?: ReactNode } = {
        children,
      }

      if (isNumber(width)) {
        styles.width = width
      }

      if (isNumber(height)) {
        styles.height = height
      }

      if (isNumber(maxWidth)) {
        styles.maxWidth = maxWidth
      }

      if (isNumber(minWidth)) {
        styles.minWidth = minWidth
      }

      if (isNumber(minHeight)) {
        styles.minHeight = minHeight
      }

      if (isNumber(left)) {
        styles.left = left
      }

      if (isNumber(top)) {
        styles.top = top
      }

      if (isNumber(floatingIndex)) {
        styles.zIndex = floatingIndex
      }

      if (shouldIgnorePointerEvents) {
        props.pointerEvents = 'none'
      }

      if (shouldHideOverflow) {
        styles.overflow = 'hidden'
      }

      if (shouldFlow) {
        styles.position = 'relative'
      }

      if (shouldScroll) {
        styles.overflow = 'scroll'
      }

      if (isNumber(opacity)) {
        styles.opacity = opacity
      }

      props.style = styles

      return props
    }
  )
)((props) => (
  <View {...props}/>
))

Block.displayName = 'Block'
