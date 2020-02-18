import React, { ReactNode } from 'react'
import { component, startWithType, mapContext, mapState, mapDefaultProps, onLayout, mapHandlers, mapWithProps } from 'refun'
import { isNumber } from 'tsfn'
import { TStyle, normalizeStyle } from 'stili'
import { LayoutContext } from '../layout-context'
import { SYMBOL_SCROLL } from '../../symbols'

export type TScroll = {
  shouldScrollHorizontally?: boolean,
  shouldScrollVertically?: boolean,
  shouldScrollToBottom?: boolean,
  children: ReactNode,
}

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
    const wrapperStyle: TStyle = {
      display: 'flex',
      position: 'absolute',
      left: _left,
      top: _top,
      width: _width,
      height: _height,
      overflowX: 'hidden',
      overflowY: 'hidden',
    }
    const childStyle: TStyle = {
      width: contentWidth,
      height: contentHeight,
    }

    if (shouldScrollHorizontally) {
      wrapperStyle.overflowX = 'scroll'
    }

    if (shouldScrollVertically) {
      wrapperStyle.overflowY = 'scroll'
    }

    return {
      wrapperStyle: normalizeStyle(wrapperStyle),
      childStyle: normalizeStyle(childStyle),
    }
  }),
  onLayout('ref', (ref: HTMLDivElement, { shouldScrollToBottom }) => {
    if (shouldScrollToBottom) {
      ref.scrollTop = ref.scrollHeight
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
  ref,
}) => (
  <div ref={ref} style={wrapperStyle}>
    <div style={childStyle}/>
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
  </div>
))

Scroll.displayName = 'Scroll'
Scroll.componentSymbol = SYMBOL_SCROLL
