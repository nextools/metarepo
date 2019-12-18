import React, { Ref, ReactNode } from 'react'
import { View, ViewProps } from 'react-native'
import { TStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isNumber } from 'tsfn'
import { TPrimitiveBlockCommon } from './types'

export type TPrimitiveBlock = TPrimitiveBlockCommon & {
  ref?: Ref<View>,
}

export const PrimitiveBlock = component(
  startWithType<TPrimitiveBlock>(),
  mapDefaultProps({
    shouldFlow: false,
    shouldHideOverflow: false,
    shouldIgnorePointerEvents: false,
    shouldForceAcceleration: false,
    shouldScroll: false,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }),
  mapProps(({
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    top,
    left,
    right,
    bottom,
    floatingIndex,
    opacity,
    children,
    shouldScroll,
    shouldHideOverflow,
    shouldFlow,
    shouldIgnorePointerEvents,
  }) => {
    const styles: TStyle = {
      flexDirection: 'row',
      position: 'absolute',
      left,
      top,
      right,
      bottom,
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

    if (isNumber(maxHeight)) {
      styles.maxHeight = maxHeight
    }

    if (isNumber(minWidth)) {
      styles.minWidth = minWidth
    }

    if (isNumber(minHeight)) {
      styles.minHeight = minHeight
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
  })
)((props) => (
  <View {...props}/>
))

PrimitiveBlock.displayName = 'PrimitiveBlock'
