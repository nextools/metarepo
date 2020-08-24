import React from 'react'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import type { ViewProps, ViewStyle } from 'react-native'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isNumber, isDefined } from 'tsfn'
import type { TPrimitiveBlock } from './types'

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
    ref,
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
    const style: ViewStyle = {
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
      style.width = width
    }

    if (isNumber(height)) {
      style.height = height
    }

    if (isNumber(maxWidth)) {
      style.maxWidth = maxWidth
    }

    if (isNumber(maxHeight)) {
      style.maxHeight = maxHeight
    }

    if (isNumber(minWidth)) {
      style.minWidth = minWidth
    }

    if (isNumber(minHeight)) {
      style.minHeight = minHeight
    }

    if (isNumber(floatingIndex)) {
      style.zIndex = floatingIndex
    }

    if (shouldHideOverflow) {
      style.overflow = 'hidden'
    }

    if (shouldFlow) {
      style.position = 'relative'
    }

    if (shouldScroll) {
      style.overflow = 'scroll'
    }

    if (isNumber(opacity)) {
      style.opacity = opacity
    }

    if (shouldIgnorePointerEvents) {
      props.pointerEvents = 'none'
    }

    if (isDefined(ref)) {
      (props as any).ref = ref
    }

    props.style = style

    return props
  })
)((props) => (
  <View {...props}/>
))

PrimitiveBlock.displayName = 'PrimitiveBlock'
