import React from 'react'
import type { HTMLProps, CSSProperties } from 'react'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isNumber, isDefined, isUndefined } from 'tsfn'
import type { TPrimitiveBlock } from './types'

export const PrimitiveBlock = component(
  startWithType<TPrimitiveBlock>(),
  mapDefaultProps({
    shouldFlow: false,
    shouldHideOverflow: false,
    shouldIgnorePointerEvents: false,
    shouldForceAcceleration: false,
    shouldScroll: false,
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
    tabIndex,
    children,
    blendMode,
    shouldScroll,
    shouldHideOverflow,
    shouldFlow,
    shouldIgnorePointerEvents,
    shouldForceAcceleration,
  }) => {
    const style: CSSProperties = {
      display: 'flex',
      position: 'absolute',
      left,
      top,
      right,
      bottom,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      zIndex: floatingIndex,
      opacity,
      mixBlendMode: blendMode,
    }

    if (isUndefined(top) && isUndefined(bottom)) {
      style.top = 0
    }

    if (isUndefined(left) && isUndefined(right)) {
      style.left = 0
    }

    if (isUndefined(right)) {
      style.right = 0
    }

    if (isUndefined(bottom)) {
      style.bottom = 0
    }

    if (isNumber(style.lineHeight)) {
      style.lineHeight = `${style.lineHeight}px`
    }

    if (shouldIgnorePointerEvents) {
      style.pointerEvents = 'none'
    }

    if (shouldHideOverflow) {
      style.overflow = 'hidden'
    }

    if (shouldFlow) {
      style.position = 'relative'
      style.alignSelf = 'flex-start'
      style.flexGrow = 0
      style.flexShrink = 0
      style.flexBasis = 'auto'
    }

    if (shouldScroll) {
      style.overflow = 'scroll'
    }

    if (shouldForceAcceleration) {
      style.transform = 'translateZ(0)'
    }

    const props: HTMLProps<HTMLDivElement> = {
      style,
      children,
    }

    if (isDefined(ref)) {
      props.ref = ref
    }

    if (isNumber(tabIndex)) {
      props.tabIndex = tabIndex
    }

    return props
  })
)((props) => (
  <div {...props}/>
))

PrimitiveBlock.displayName = 'PrimitiveBlock'
