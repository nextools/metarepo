import React from 'react'
import { component, startWithType, mapProps, mapContext } from 'refun'
import { prefixStyle, TStyle } from '@lada/prefix'
import { View } from '@primitives/view'
import { isUndefined } from 'tsfn'
import { Context } from './context'
import { TLayoutItemProps } from './types'

export const LayoutItem = component(
  startWithType<TLayoutItemProps>(),
  mapContext(Context),
  mapProps(({ direction, width, height, hAlign, vAlign, shouldScroll, children }) => {
    const style: TStyle = {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      /* flexbox hack */
      minWidth: 0,
    }

    if (direction === 'horizontal') {
      if (width === 'stretch') {
        style.flexGrow = 1
        style.flexShrink = 1
        style.flexBasis = 0
      } else if (!isUndefined(width)) {
        style.width = width
        style.flexGrow = 0
        style.flexShrink = 0
      } else {
        style.flexShrink = 0
      }

      if (height === 'stretch') {
        style.alignSelf = 'stretch'
      } else if (!isUndefined(height)) {
        style.height = height
      }
    } else if (direction === 'vertical') {
      if (width === 'stretch') {
        style.alignSelf = 'stretch'
      } else if (!isUndefined(width)) {
        style.width = width
      }

      if (height === 'stretch') {
        style.flexGrow = 1
        style.flexShrink = 1
        style.flexBasis = 0
      } else if (!isUndefined(height)) {
        style.height = height
        style.flexGrow = 0
        style.flexShrink = 0
      } else {
        style.flexShrink = 0
      }
    }

    switch (hAlign) {
      case 'left': {
        style.justifyContent = 'flex-start'
        break
      }
      case 'center': {
        style.justifyContent = 'center'
        break
      }
      case 'right': {
        style.justifyContent = 'flex-end'
        break
      }
    }

    switch (vAlign) {
      case 'top': {
        style.alignItems = 'flex-start'
        break
      }
      case 'center': {
        style.alignItems = 'center'
        break
      }
      case 'bottom': {
        style.alignItems = 'flex-end'
        break
      }
    }

    if (shouldScroll) {
      style.overflow = 'scroll'
    }

    return {
      style: prefixStyle(style),
      children,
    }
  })
)('LayoutItem', ({ style, children }) => (
  <View style={style}>{children}</View>
))
