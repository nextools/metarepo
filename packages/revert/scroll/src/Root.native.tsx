import { LayoutContext } from '@revert/layout'
import React from 'react'
import { View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { component, startWithType, mapContext, mapState, mapDefaultProps, mapHandlers, mapWithProps } from 'refun'
import { isNumber } from 'tsfn'
import type { TScroll } from './types'

export const Scroll = component(
  startWithType<TScroll>(),
  mapDefaultProps({
    shouldScrollHorizontally: false,
    shouldScrollVertically: false,
    shouldScrollToBottom: false,
  }),
  mapContext(LayoutContext),
  mapState('contentWidth', 'onContentWidthChange', () => 0, []),
  mapState('contentHeight', 'onContentHeightChange', () => 0, []),
  mapHandlers({
    onWidthChange: ({ onContentWidthChange, _maxWidth, _onWidthChange }) => (value: number) => {
      onContentWidthChange(value)
      _onWidthChange?.(isNumber(_maxWidth) && _maxWidth > 0 ? Math.min(_maxWidth, value) : value)
    },
    onHeightChange: ({ onContentHeightChange, _maxHeight, _onHeightChange }) => (value: number) => {
      onContentHeightChange(value)
      _onHeightChange?.(isNumber(_maxHeight) && _maxHeight > 0 ? Math.min(_maxHeight, value) : value)
    },
  }),
  mapWithProps(({ _left, _top, _width, _height, contentWidth, contentHeight, shouldScrollHorizontally, shouldScrollVertically }) => {
    const wrapperStyle: ViewStyle = {
      display: 'flex',
      position: 'absolute',
      left: _left,
      top: _top,
      width: _width,
      height: _height,
      overflow: 'hidden',
    }
    const childStyle: ViewStyle = {
      width: contentWidth,
      height: contentHeight,
    }

    if (shouldScrollHorizontally) {
      wrapperStyle.overflow = 'scroll'
    }

    if (shouldScrollVertically) {
      wrapperStyle.overflow = 'scroll'
    }

    return {
      wrapperStyle,
      childStyle,
    }
  })
)(({
  _x,
  _y,
  _width,
  _height,
  contentWidth,
  contentHeight,
  onWidthChange,
  onHeightChange,
  wrapperStyle,
  childStyle,
  shouldScrollHorizontally,
  shouldScrollVertically,
  children,
}) => (
  <View style={wrapperStyle}>
    <View style={childStyle}/>
    <LayoutContext.Provider
      value={{
        _x,
        _y,
        _parentLeft: 0,
        _parentTop: 0,
        _parentWidth: _width,
        _parentHeight: _height,
        _left: 0,
        _top: 0,
        _width: shouldScrollHorizontally ? contentWidth : _width,
        _height: shouldScrollVertically ? contentHeight : _height,
        _onWidthChange: shouldScrollHorizontally ? onWidthChange : undefined,
        _onHeightChange: shouldScrollVertically ? onHeightChange : undefined,
      }}
    >
      {children}
    </LayoutContext.Provider>
  </View>
))

Scroll.displayName = 'Scroll'
Scroll.componentSymbol = Symbol('REVERT_SCROLL')
