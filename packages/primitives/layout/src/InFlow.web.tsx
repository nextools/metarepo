import React from 'react'
import { component, startWithType, mapProps, mapContext, mapDefaultProps } from 'refun'
import { normalizeStyle, TStyle } from 'stili'
import { View } from '@primitives/view'
import { isNumber } from 'tsfn'
import { Context } from './context'
import { TLayoutInFlow } from './types'

export const LayoutInFlow = component(
  startWithType<TLayoutInFlow>(),
  mapDefaultProps({
    shouldIgnorePointerEvents: false,
    shouldScroll: false,
    minWidth: 0,
    minHeight: 0,
  }),
  mapContext(Context),
  mapProps(({ direction, width, height, maxWidth, maxHeight, minWidth, minHeight, shouldScroll, shouldIgnorePointerEvents, children }) => {
    const style: TStyle = {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'auto',
      minWidth,
      minHeight,
    }

    if (direction === 'horizontal') {
      if (width === 'stretch') {
        style.flexGrow = 1
        style.flexShrink = 1
      } else if (width === 'equal') {
        style.flexGrow = 1
        style.flexShrink = 1
        style.flexBasis = 0
      } else if (isNumber(width)) {
        style.width = width
      }

      if (height === 'stretch') {
        style.alignSelf = 'stretch'
      } else if (isNumber(height)) {
        style.height = height
      }
    } else if (direction === 'vertical') {
      if (width === 'stretch') {
        style.alignSelf = 'stretch'
      } else if (isNumber(width)) {
        style.width = width
      }

      if (height === 'stretch') {
        style.flexGrow = 1
        style.flexShrink = 1
      } else if (isNumber(height)) {
        style.height = height
      }
    }

    if (isNumber(maxWidth)) {
      style.maxWidth = maxWidth
    }

    if (isNumber(maxHeight)) {
      style.maxHeight = maxHeight
    }

    if (shouldScroll) {
      style.overflow = 'scroll'
    }

    if (shouldIgnorePointerEvents) {
      style.pointerEvents = 'none'
    }

    return {
      style: normalizeStyle(style),
      children,
    }
  })
)(({ style, children }) => (
  <View style={style}>{children}</View>
))

LayoutInFlow.displayName = 'LayoutInFlow'
