import React from 'react'
import type { Ref, HTMLProps, CSSProperties, ReactNode, SyntheticEvent, MouseEvent } from 'react'
import { component, startWithType, mapDefaultProps, mapProps } from 'refun'
import { normalizeWebStyle } from 'stili'
import type { TStyle } from 'stili'
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
  isFlexbox?: boolean,
  shouldPreventWrap?: boolean,
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
  onPointerEnter?: () => void,
  onPointerLeave?: () => void,
  onPointerDown?: () => void,
  onPointerUp?: () => void,
  onPointerMove?: () => void,
}

export const Block = component(
  startWithType<TBlock>(),
  mapDefaultProps({
    shouldFlow: false,
    shouldHideOverflow: false,
    shouldIgnorePointerEvents: false,
    shouldPreventWrap: false,
    shouldForceAcceleration: false,
    isFlexbox: false,
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
      shouldPreventWrap,
      shouldForceAcceleration,
      isFlexbox,
      onScroll,
      onPress,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerMove,
    }) => {
      const styles: TStyle = {
        ...style,
        _webOnly: {
          ...style?._webOnly,
        },
        position: 'absolute',
        left: 0,
        top: 0,
      }

      if (isFlexbox) {
        styles.display = 'flex'
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
        styles._webOnly!.pointerEvents = 'none'
      }

      if (shouldPreventWrap) {
        styles._webOnly!.whiteSpace = 'nowrap'
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

      if (shouldScrollX) {
        styles._webOnly!.overflowX = 'scroll'
      }

      if (shouldScrollY) {
        styles._webOnly!.overflowY = 'scroll'
      }

      if (shouldForceAcceleration) {
        styles._webOnly!.transform = 'translateZ(0)'
      }

      if (!isUndefined(blendMode)) {
        styles._webOnly!.mixBlendMode = blendMode
      }

      if (!isUndefined(opacity)) {
        styles.opacity = opacity
      }

      const props: HTMLProps<HTMLDivElement> = {
        style: normalizeWebStyle(styles),
        children,
        onMouseEnter: onPointerEnter,
        onMouseLeave: onPointerLeave,
        onMouseDown: onPointerDown,
        onMouseUp: onPointerUp,
        onMouseMove: onPointerMove,
      }

      if (!isUndefined(ref)) {
        props.ref = ref
      }

      if (isFunction(onScroll)) {
        props.onScroll = (e: SyntheticEvent<HTMLDivElement>) => onScroll(e.currentTarget.scrollTop)
      }

      if (isFunction(onPress)) {
        props.onClick = (e: MouseEvent<HTMLDivElement>) => {
          const { left, top } = e.currentTarget.getBoundingClientRect()

          onPress(e.pageX - left, e.pageY - top)
        }
      }

      return props
    }
  )
)((props) => (
  <div {...props}/>
))

Block.displayName = 'Block'
