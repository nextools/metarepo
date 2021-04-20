import type { Ref, HTMLProps, CSSProperties, ReactNode, SyntheticEvent, MouseEvent } from 'react'
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
  style?: CSSProperties,
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
    shouldScrollX: false,
    shouldScrollY: false,
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
      style: userStyle,
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
      const style: CSSProperties = {
        ...userStyle,
        position: 'absolute',
        left: 0,
        top: 0,
      }

      if (isFlexbox) {
        style.display = 'flex'
      }

      if (!isUndefined(width)) {
        style.width = width
      }

      if (!isUndefined(height)) {
        style.height = height
      }

      if (isNumber(maxWidth)) {
        style.maxWidth = maxWidth
      }

      if (!isUndefined(minWidth)) {
        style.minWidth = minWidth
      }

      if (!isUndefined(minHeight)) {
        style.minHeight = minHeight
      }

      if (!isUndefined(left)) {
        style.left = left
      }

      if (!isUndefined(top)) {
        style.top = top
      }

      if (!isUndefined(right)) {
        style.right = right
      }

      if (!isUndefined(bottom)) {
        style.bottom = bottom
      }

      if (!isUndefined(floatingIndex)) {
        style.zIndex = floatingIndex
      }

      if (shouldIgnorePointerEvents) {
        style.pointerEvents = 'none'
      }

      if (shouldPreventWrap) {
        style.whiteSpace = 'nowrap'
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

      if (shouldScrollX) {
        style.overflowX = 'scroll'
      }

      if (shouldScrollY) {
        style.overflowY = 'scroll'
      }

      if (shouldForceAcceleration) {
        style.transform = 'translateZ(0)'
      }

      if (!isUndefined(blendMode)) {
        style.mixBlendMode = blendMode
      }

      if (!isUndefined(opacity)) {
        style.opacity = opacity
      }

      const props: HTMLProps<HTMLDivElement> = {
        style,
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
