import type { ReactNode } from 'react'
import { View } from 'react-native'
import type { ViewProps, ViewStyle } from 'react-native'
import { component, startWithType, mapProps } from 'refun'
import { UNDEFINED } from 'tsfn'
import type { TPrimitiveBlock } from './types'

export const PrimitiveBlock = component(
  startWithType<TPrimitiveBlock>(),
  mapProps(({
    id,
    onRef,
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
    shouldScroll = false,
    shouldHideOverflow = false,
    shouldFlow = false,
    shouldIgnorePointerEvents = false,
  }) => {
    const style: ViewStyle = {
      flexDirection: 'row',
      position: 'absolute',
      left,
      top,
      right,
      bottom,
      width,
      height,
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      zIndex: floatingIndex,
      opacity,
    }

    if (top === UNDEFINED && bottom === UNDEFINED) {
      style.top = 0
    }

    if (left === UNDEFINED && right === UNDEFINED) {
      style.left = 0
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

    const props: ViewProps & { children?: ReactNode } = {
      testID: id,
      children,
    }

    if (shouldIgnorePointerEvents) {
      props.pointerEvents = 'none'
    }

    if (onRef !== UNDEFINED) {
      (props as any).ref = onRef
    }

    props.style = style

    return props
  })
)((props) => (
  <View {...props}/>
))

PrimitiveBlock.displayName = 'PrimitiveBlock'
