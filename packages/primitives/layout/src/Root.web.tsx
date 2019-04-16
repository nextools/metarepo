import React from 'react'
import { component, startWithType, mapDefaultProps, mapChildren, mapProps } from 'refun'
import { prefixStyle, TStyle } from '@lada/prefix'
import { View } from '@primitives/view'
import { isNumber } from 'tsfn'
import { TLayoutProps } from './types'
import { Context } from './context'

export const Layout = component(
  startWithType<TLayoutProps>(),
  mapDefaultProps({
    minWidth: 0,
    minHeight: 0,
    hAlign: 'left',
    vAlign: 'top',
  }),
  mapProps(({ direction, width, height, minWidth, maxWidth, minHeight, maxHeight, hAlign, vAlign, children }) => {
    const style: TStyle = {
      display: 'flex',
      flexGrow: 1,
      flexBasis: 0,
      alignSelf: 'stretch',
      position: 'relative',
    }

    if (direction === 'horizontal') {
      style.flexDirection = 'row'

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
    } else if (direction === 'vertical') {
      style.flexDirection = 'column'

      switch (hAlign) {
        case 'left': {
          style.alignItems = 'flex-start'
          break
        }
        case 'center': {
          style.alignItems = 'center'
          break
        }
        case 'right': {
          style.alignItems = 'flex-end'
          break
        }
      }

      switch (vAlign) {
        case 'top': {
          style.justifyContent = 'flex-start'
          break
        }
        case 'center': {
          style.justifyContent = 'center'
          break
        }
        case 'bottom': {
          style.justifyContent = 'flex-end'
          break
        }
      }
    }

    if (isNumber(minWidth)) {
      style.minWidth = minWidth
    }

    if (isNumber(maxWidth)) {
      style.maxWidth = maxWidth
    }

    if (isNumber(minHeight)) {
      style.minHeight = minHeight
    }

    if (isNumber(maxHeight)) {
      style.maxHeight = maxHeight
    }

    if (isNumber(width)) {
      style.width = width
    }

    if (isNumber(height)) {
      style.height = height
    }

    return {
      style: prefixStyle(style),
      direction,
      children,
    }
  }),
  mapChildren({
    fills: {
      names: ['LayoutFill'],
      multiple: true,
    },
    children: {
      names: ['LayoutItem', 'LayoutSpacer'],
      multiple: true,
    },
  })
)('Layout', ({ children, fills, direction, style }) => (
  <View style={style}>
    <Context.Provider value={{ direction }}>
      {fills}
      {children}
    </Context.Provider>
  </View>
))
