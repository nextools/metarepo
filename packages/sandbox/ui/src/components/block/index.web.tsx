import React, { Ref, HTMLProps } from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isUndefined, isNumber } from 'tsfn'
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
    shouldUseFlex: false,
    shouldForceAcceleration: false,
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

      if (!isUndefined(styles.lineHeight)) {
        styles.lineHeight = `${styles.lineHeight}px`
      }

      if (!isUndefined(width)) {
        styles.width = width
      }

      if (!isUndefined(height)) {
        styles.height = height
      }

      if (isNumber(maxWidth)) {
        styles.maxWidth = maxWidth
      }

      if (!isUndefined(minWidth)) {
        styles.minWidth = minWidth
      }

      if (!isUndefined(minHeight)) {
        styles.minHeight = minHeight
      }

      if (!isUndefined(left)) {
        styles.left = left
      }

      if (!isUndefined(top)) {
        styles.top = top
      }

      if (!isUndefined(right)) {
        styles.right = right
      }

      if (!isUndefined(bottom)) {
        styles.bottom = bottom
      }

      if (!isUndefined(floatingIndex)) {
        styles.zIndex = floatingIndex
      }

      if (shouldIgnorePointerEvents) {
        styles.pointerEvents = 'none'
      }

      if (shouldHideOverflow) {
        styles.overflow = 'hidden'
      }

      if (shouldFlow) {
        styles.position = 'static'
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

      if (!isUndefined(blendMode)) {
        styles.mixBlendMode = blendMode
      }

      if (!isUndefined(opacity)) {
        styles.opacity = opacity
      }

      const props: HTMLProps<HTMLDivElement> = {
        style: normalizeStyle(styles),
        children,
      }

      if (!isUndefined(ref)) {
        props.ref = ref
      }

      return props
    }
  )
)((props) => (
  <div {...props}/>
))

Block.displayName = 'Block'
