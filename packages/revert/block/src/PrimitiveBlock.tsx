import type { HTMLProps, CSSProperties } from 'react'
import { component, startWithType, mapProps } from 'refun'
import { isNumber, UNDEFINED } from 'tsfn'
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
    tabIndex,
    children,
    blendMode,
    shouldScroll = false,
    shouldHideOverflow = false,
    shouldFlow = false,
    shouldIgnorePointerEvents = false,
    shouldForceAcceleration = false,
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

    if (top === UNDEFINED && bottom === UNDEFINED) {
      style.top = 0
    }

    if (left === UNDEFINED && right === UNDEFINED) {
      style.left = 0
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
      id,
      style,
      children,
    }

    if (onRef !== UNDEFINED) {
      props.ref = onRef
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
