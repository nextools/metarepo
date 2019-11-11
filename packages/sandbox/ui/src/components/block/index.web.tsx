import React, { Ref, HTMLProps } from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isNumber, isDefined } from 'tsfn'
import { TBlockCommon } from './types'

export type TBlock = TBlockCommon & {
  ref?: Ref<HTMLDivElement>,
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
      ref,
      width,
      height,
      maxWidth,
      minWidth,
      minHeight,
      top,
      left,
      right,
      bottom,
      floatingIndex,
      opacity,
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
        left: 0,
        top: 0,
      }

      if (isNumber(styles.lineHeight)) {
        styles.lineHeight = `${styles.lineHeight}px`
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

      if (isDefined(minWidth)) {
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

      if (isNumber(right)) {
        styles.right = right
      }

      if (isNumber(bottom)) {
        styles.bottom = bottom
      }

      if (isNumber(floatingIndex)) {
        styles.zIndex = floatingIndex
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

      if (isDefined(blendMode)) {
        styles.mixBlendMode = blendMode
      }

      if (isNumber(opacity)) {
        styles.opacity = opacity
      }

      const props: HTMLProps<HTMLDivElement> = {
        style: normalizeStyle(styles),
        children,
      }

      if (isDefined(ref)) {
        props.ref = ref
      }

      return props
    }
  )
)((props) => (
  <div {...props}/>
))

Block.displayName = 'Block'
