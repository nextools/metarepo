import React, { ReactNode } from 'react'
import { component, startWithType, mapDefaultProps, mapWithProps, mapHandlers, mapStateRef, mapContext } from 'refun'
import { elegir } from 'elegir'
import { isFunction } from 'tsfn'
import { LayoutContext } from '../layout-context'
import { SYMBOL_LAYOUT_ITEM } from '../../symbols'
import { LayoutItemContext } from './LayoutItemContext'
import { TLayoutSize } from './types'
import { SIZE_INITIAL } from './utils'

export type TLayout_Item = {
  id?: string,
  width?: TLayoutSize,
  height?: TLayoutSize,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number,
  hAlign?: 'left' | 'center' | 'right' | 'stretch',
  vAlign?: 'top' | 'center' | 'bottom' | 'stretch',
  hPadding?: number,
  vPadding?: number,
  children: ReactNode,
}

export const Layout_Item = component(
  startWithType<TLayout_Item>(),
  mapDefaultProps({
    hAlign: 'stretch',
    vAlign: 'stretch',
    hPadding: 0,
    vPadding: 0,
  }),
  mapContext(LayoutItemContext),
  mapStateRef('contentWidthRef', 'flushWidthChange', () => SIZE_INITIAL, []),
  mapStateRef('contentHeightRef', 'flushHeightChange', () => SIZE_INITIAL, []),
  mapHandlers({
    onWidthChange: ({ hPadding, contentWidthRef, flushWidthChange, _itemIndex, _onWidthChange }) => (measuredValue: number) => {
      contentWidthRef.current = measuredValue

      // Measure mode
      if (isFunction(_onWidthChange)) {
        _onWidthChange(_itemIndex, measuredValue + hPadding * 2)
      } else {
        flushWidthChange()
      }
    },
    onHeightChange: ({ vPadding, contentHeightRef, flushHeightChange, _itemIndex, _onHeightChange }) => (measuredValue: number) => {
      contentHeightRef.current = measuredValue

      // Measure mode
      if (isFunction(_onHeightChange)) {
        _onHeightChange(_itemIndex, measuredValue + vPadding * 2)
      } else {
        flushHeightChange()
      }
    },
  }),
  mapWithProps(({ maxWidth, _maxWidth, _width, contentWidthRef, hPadding, hAlign, onWidthChange, _onWidthChange }) => {
    const isMeasureMode = isFunction(_onWidthChange)

    if (!isMeasureMode && hAlign === 'stretch') {
      const width = Math.max(_width - hPadding * 2, 0)

      return {
        contentLeft: hPadding,
        contentWidth: width,
        contentMaxWidth: width,
        onWidthChange: undefined,
      }
    }

    const extraWidth = _width - contentWidthRef.current

    return {
      contentLeft: elegir(
        hAlign === 'center',
        extraWidth / 2,
        hAlign === 'right',
        extraWidth - hPadding,
        true,
        hPadding
      ),
      contentWidth: contentWidthRef.current,
      contentMaxWidth: isMeasureMode
        ? Math.max((maxWidth ?? _maxWidth ?? 0) - hPadding * 2, 0)
        : Math.max(_width - hPadding * 2, 0),
      onWidthChange,
    }
  }),
  mapWithProps(({ maxHeight, _height, contentHeightRef, vPadding, vAlign, onHeightChange, _onHeightChange }) => {
    const isMeasureMode = isFunction(_onHeightChange)

    if (!isMeasureMode && vAlign === 'stretch') {
      const height = Math.max(_height - vPadding * 2, 0)

      return {
        contentTop: vPadding,
        contentHeight: height,
        contentMaxHeight: height,
        onHeightChange: undefined,
      }
    }

    const extraHeight = _height - contentHeightRef.current

    return ({
      contentTop: elegir(
        vAlign === 'center',
        extraHeight / 2,
        vAlign === 'bottom',
        extraHeight - vPadding,
        true,
        vPadding
      ),
      contentHeight: contentHeightRef.current,
      contentMaxHeight: isMeasureMode
        ? Math.max((maxHeight ?? 0) - vPadding * 2, 0)
        : Math.max(_height - vPadding * 2, 0),
      onHeightChange,
    })
  })
)(({
  _width,
  _height,
  _left,
  _top,
  _x,
  _y,
  contentLeft,
  contentTop,
  contentWidth,
  contentHeight,
  contentMaxWidth,
  contentMaxHeight,
  children,
  onWidthChange,
  onHeightChange,
}) => (
  <LayoutContext.Provider
    value={{
      _x: _x + contentLeft,
      _y: _y + contentTop,
      _parentLeft: _left,
      _parentTop: _top,
      _parentWidth: _width,
      _parentHeight: _height,
      _left: _left + contentLeft,
      _top: _top + contentTop,
      _width: contentWidth,
      _height: contentHeight,
      _maxWidth: contentMaxWidth,
      _maxHeight: contentMaxHeight,
      _onWidthChange: onWidthChange,
      _onHeightChange: onHeightChange,
    }}
  >
    {children}
  </LayoutContext.Provider>
))

Layout_Item.displayName = 'Layout_Item'
Layout_Item.componentSymbol = SYMBOL_LAYOUT_ITEM
