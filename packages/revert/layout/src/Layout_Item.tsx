import type { ReactNode } from 'react'
import { component, startWithType, mapHandlers, mapStateRef, mapContext } from 'refun'
import { UNDEFINED } from 'tsfn'
import { LayoutContext } from './LayoutContext'
import { LayoutItemContext } from './LayoutItemContext'
import { onChange } from './on-change'
import { SYMBOL_LAYOUT_ITEM } from './symbols'
import type { TLayoutSize, TOnContentSizeChange } from './types'

export type TLayout_Item = {
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
  mapContext(LayoutItemContext),
  mapStateRef('layoutItemStateRef', 'flushLayoutItem', () => {
    const value = {
      contentLeft: 0,
      contentTop: 0,
      contentMeasureWidth: 0,
      contentMeasureHeight: 0,
      contentRenderWidth: 0,
      contentRenderHeight: 0,
      contentMaxWidth: 0,
      onContentWidthChanged: UNDEFINED as TOnContentSizeChange | undefined,
      onContentHeightChanged: UNDEFINED as TOnContentSizeChange | undefined,
    }

    return value
  }, []),
  mapHandlers({
    onWidthChange: ({
      hPadding = 0,
      layoutItemStateRef,
      flushLayoutItem,
      _itemIndex,
      _onWidthChange,
    }) => (measuredValue: number) => {
      if (layoutItemStateRef.current.contentMeasureWidth === measuredValue) {
        return
      }

      layoutItemStateRef.current.contentMeasureWidth = measuredValue

      // Measure mode
      if (_onWidthChange !== UNDEFINED) {
        _onWidthChange(_itemIndex, measuredValue + hPadding * 2)
      } else {
        flushLayoutItem()
      }
    },
    onHeightChange: ({
      vPadding = 0,
      layoutItemStateRef,
      flushLayoutItem,
      _itemIndex,
      _onHeightChange,
    }) => (measuredValue: number) => {
      if (layoutItemStateRef.current.contentMeasureHeight === measuredValue) {
        return
      }

      layoutItemStateRef.current.contentMeasureHeight = measuredValue

      // Measure mode
      if (_onHeightChange !== UNDEFINED) {
        _onHeightChange(_itemIndex, measuredValue + vPadding * 2)
      } else {
        flushLayoutItem()
      }
    },
  }),
  onChange(({
    hPadding = 0,
    hAlign = 'stretch',
    onWidthChange,
    layoutItemStateRef,
    _width,
    _maxWidth,
    _onWidthChange,
  }) => {
    const contentState = layoutItemStateRef.current
    const isLayoutMeasureMode = _onWidthChange !== UNDEFINED

    // Check if Content is in Stretch mode
    if (!isLayoutMeasureMode && hAlign === 'stretch') {
      const contentWidth = Math.max(_width - hPadding * 2, 0)

      contentState.contentLeft = hPadding
      contentState.contentRenderWidth = contentWidth
      contentState.contentMaxWidth = 0
      contentState.onContentWidthChanged = UNDEFINED

      return
    }

    // Content is in Measure mode
    const extraWidth = _width - contentState.contentMeasureWidth
    const contentLeft = (
      hAlign === 'center' ? extraWidth >> 1 :
      hAlign === 'right' ? extraWidth - hPadding :
      hPadding
    )
    const contentMaxWidth = isLayoutMeasureMode
      // Put the Layout provided limit for the Item or 0
      ? Math.max((_maxWidth ?? 0) - hPadding * 2, 0)
      // Put Item size as limit of measurement
      : Math.max(_width - hPadding * 2, 0)

    contentState.contentLeft = contentLeft
    contentState.contentRenderWidth = contentState.contentMeasureWidth
    contentState.contentMaxWidth = contentMaxWidth
    contentState.onContentWidthChanged = onWidthChange
  }),
  onChange(({
    vPadding = 0,
    vAlign = 'stretch',
    onHeightChange,
    layoutItemStateRef,
    _height,
    _onHeightChange,
  }) => {
    const contentState = layoutItemStateRef.current
    const isLayoutMeasureMode = _onHeightChange !== UNDEFINED

    // Check if Content is in Stretch mode
    if (!isLayoutMeasureMode && vAlign === 'stretch') {
      const contentHeight = Math.max(_height - vPadding * 2, 0)

      contentState.contentTop = vPadding
      contentState.contentRenderHeight = contentHeight
      contentState.onContentHeightChanged = UNDEFINED

      return
    }

    // Content is in Measure mode
    const extraHeight = _height - contentState.contentMeasureHeight
    const contentTop = (
      vAlign === 'center' ? extraHeight >> 1 :
      vAlign === 'bottom' ? extraHeight - vPadding :
      vPadding
    )

    contentState.contentTop = contentTop
    contentState.contentRenderHeight = contentState.contentMeasureHeight
    contentState.onContentHeightChanged = onHeightChange
  })
)(({
  _width,
  _height,
  _left,
  _top,
  _x,
  _y,
  layoutItemStateRef,
  children,
}) => {
  const {
    contentTop,
    contentLeft,
    contentRenderWidth,
    contentRenderHeight,
    contentMaxWidth,
    onContentWidthChanged,
    onContentHeightChanged,
  } = layoutItemStateRef.current

  return (
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
        _width: contentRenderWidth,
        _height: contentRenderHeight,
        _maxWidth: contentMaxWidth,
        _onWidthChange: onContentWidthChanged,
        _onHeightChange: onContentHeightChanged,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
})

Layout_Item.displayName = 'Layout_Item'
Layout_Item.componentSymbol = SYMBOL_LAYOUT_ITEM
