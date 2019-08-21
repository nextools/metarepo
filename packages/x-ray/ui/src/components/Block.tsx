import React, { Ref, HTMLProps, CSSProperties, ReactNode, SyntheticEvent, MouseEvent } from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { isUndefined, isNumber, isFunction } from 'tsfn'

export type TBlock = {
  width?: number,
  height?: number,
  maxWidth?: number,
  minWidth?: number,
  minHeight?: number,
  top?: number,
  left?: number,
  right?: number,
  bottom?: number,
  opacity?: number,
  floatingIndex?: number,
  shouldIgnorePointerEvents?: boolean,
  shouldFlow?: boolean,
  shouldScrollX?: boolean,
  shouldScrollY?: boolean,
  shouldHideOverflow?: boolean,
  shouldForceAcceleration?: boolean,
  blendMode?: CSSProperties['mixBlendMode'],
  children?: ReactNode,
  ref?: Ref<HTMLDivElement>,
  style?: TStyle,
  onScroll?: (scrollTop: number) => void,
  onPress?: (x: number, y: number) => void,
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
      style,
      shouldScrollX,
      shouldScrollY,
      shouldHideOverflow,
      shouldFlow,
      shouldIgnorePointerEvents,
      shouldForceAcceleration,
      onScroll,
      onPress,
    }) => {
      const styles: TStyle = {
        ...style,
        position: 'absolute',
        left: 0,
        top: 0,
        // lineHeight: 0,
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

      if (shouldScrollX) {
        styles.overflowX = 'scroll'
      }

      if (shouldScrollY) {
        styles.overflowY = 'scroll'
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

      if (isFunction(onScroll)) {
        props.onScroll = (e: SyntheticEvent<HTMLDivElement>) => onScroll(e.currentTarget.scrollTop)
      }

      if (isFunction(onPress)) {
        props.onClick = (e: MouseEvent<HTMLDivElement>) => onPress(e.pageX, e.pageY)
      }

      return props
    }
  )
)((props) => (
  <div {...props}/>
))

Block.displayName = 'Block'
