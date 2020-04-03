import React, { Ref, HTMLProps } from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isNumber, isDefined, isUndefined } from 'tsfn'
import { TPrimitiveBlockCommon } from './types'

export type TPrimitiveBlock = TPrimitiveBlockCommon & {
  ref?: Ref<HTMLDivElement>,
}

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
    const styles: TStyle = {
      display: 'flex',
      flexDirection: 'row',
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
      styles.top = 0
    }

    if (isUndefined(left) && isUndefined(right)) {
      styles.left = 0
    }

    if (isNumber(styles.lineHeight)) {
      styles.lineHeight = `${styles.lineHeight}px`
    }

    if (shouldIgnorePointerEvents) {
      styles.pointerEvents = 'none'
    }

    if (shouldHideOverflow) {
      styles.overflow = 'hidden'
    }

    if (shouldFlow) {
      styles.position = 'relative'
      styles.alignSelf = 'flex-start'
      styles.flexGrow = 0
      styles.flexShrink = 0
      styles.flexBasis = 'auto'
    }

    if (shouldScroll) {
      styles.overflow = 'scroll'
    }

    if (shouldForceAcceleration) {
      styles.transform = 'translateZ(0)'
    }

    const props: HTMLProps<HTMLDivElement> = {
      style: normalizeStyle(styles),
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
