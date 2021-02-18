import { LayoutContext } from '@revert/layout'
import { View, ScrollView } from 'react-native'
import type { ViewStyle } from 'react-native'
import { component, startWithType, mapContext, mapDefaultProps, mapHandlers, mapWithProps, mapStateRef } from 'refun'
import { isFunction, isNumber } from 'tsfn'
import type { TScroll } from './types'

export const Scroll = component(
  startWithType<TScroll>(),
  mapDefaultProps({
    shouldScrollHorizontally: false,
    shouldScrollVertically: false,
    shouldScrollToBottom: false,
  }),
  mapContext(LayoutContext),
  mapStateRef('contentWidthRef', 'flushWidthChange', () => 0, []),
  mapStateRef('contentHeightRef', 'flushHeightChange', () => 0, []),
  mapHandlers({
    onWidthChange: ({ contentWidthRef, flushWidthChange, _maxWidth, _onWidthChange }) => (value: number) => {
      contentWidthRef.current = value

      if (isFunction(_onWidthChange)) {
        _onWidthChange(isNumber(_maxWidth) && _maxWidth > 0 ? Math.min(_maxWidth, value) : value)
      } else {
        flushWidthChange()
      }
    },
    onHeightChange: ({ contentHeightRef, flushHeightChange, _maxHeight, _onHeightChange }) => (value: number) => {
      contentHeightRef.current = value

      if (isFunction(_onHeightChange)) {
        _onHeightChange(isNumber(_maxHeight) && _maxHeight > 0 ? Math.min(_maxHeight, value) : value)
      } else {
        flushHeightChange()
      }
    },
  }),
  mapWithProps(({ _left, _top, _width, _height, contentWidthRef, contentHeightRef }) => {
    const wrapperStyle: ViewStyle = {
      position: 'absolute',
      left: _left,
      top: _top,
      width: _width,
      height: _height,
    }
    const childStyle: ViewStyle = {
      width: contentWidthRef.current,
      height: contentHeightRef.current,
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
  contentWidthRef,
  contentHeightRef,
  onWidthChange,
  onHeightChange,
  wrapperStyle,
  childStyle,
  shouldScrollHorizontally,
  shouldScrollVertically,
  children,
}) => (
  <ScrollView style={wrapperStyle}>
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
        _width: shouldScrollHorizontally ? contentWidthRef.current : _width,
        _height: shouldScrollVertically ? contentHeightRef.current : _height,
        _onWidthChange: shouldScrollHorizontally ? onWidthChange : undefined,
        _onHeightChange: shouldScrollVertically ? onHeightChange : undefined,
      }}
    >
      {children}
    </LayoutContext.Provider>
  </ScrollView>
))

Scroll.displayName = 'Scroll'
Scroll.componentSymbol = Symbol('REVERT_SCROLL')
