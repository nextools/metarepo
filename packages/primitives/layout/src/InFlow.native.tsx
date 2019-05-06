import React, { ReactNode } from 'react'
import { component, startWithType, mapProps, mapContext, mapDefaultProps } from 'refun'
import { TStyle } from '@lada/prefix'
import { View } from '@primitives/view'
import { isNumber } from 'tsfn'
import { ViewProps } from 'react-native'
import { Context } from './context'
import { TLayoutInFlow } from './types'

export const LayoutInFlow = component(
  startWithType<TLayoutInFlow>(),
  mapDefaultProps({
    shouldIgnorePointerEvents: false,
    shouldScroll: false,
  }),
  mapContext(Context),
  mapProps(({ direction, width, height, shouldScroll, shouldIgnorePointerEvents, children }) => {
    const style: TStyle = {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'auto',
      minWidth: 0,
    }

    if (direction === 'horizontal') {
      if (width === 'stretch') {
        style.flexGrow = 1
        style.flexShrink = 1
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

    if (shouldScroll) {
      style.overflow = 'scroll'
    }

    const props: ViewProps & {children: ReactNode} = {
      style,
      children,
    }

    if (shouldIgnorePointerEvents) {
      props.pointerEvents = 'none'
    }

    return props
  })
)('LayoutInFlow', ({ children, pointerEvents, style }) => (
  <View style={style} pointerEvents={pointerEvents}>{children}</View>
))
