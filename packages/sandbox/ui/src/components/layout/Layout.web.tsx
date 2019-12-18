import React, { ReactNode, Fragment } from 'react'
import { component, startWithType, mapDefaultProps, mapContext, mapStateRef, mapHandlers, onChange } from 'refun'
import { isFunction } from 'tsfn'
import { LayoutContext } from '../layout-context'
import { mapChildren, SYMBOL_CHILDREN_REST } from '../../map/children'
import { SYMBOL_LAYOUT, SYMBOL_LAYOUT_ITEM } from '../../symbols'
import { calcTotal, calcMax, calcExplicitMainAxisLayout, calcMeasureMainAxisLayout, calcMeasureCrossAxisLayout, calcExplicitCrossAxisLayout, TOnItemSizeChange, equalizeArrays, getWidth, getMinWidth, getMaxWidth, getLayoutWidth, getHeight, getMinHeight, getMaxHeight, getLayoutHeight } from './utils'
import { LayoutItemContext } from './LayoutItemContext'
import { TLayoutDirection } from './types'

export type TLayout = {
  direction?: TLayoutDirection,
  hPadding?: number,
  vPadding?: number,
  spaceBetween?: number,
  children: ReactNode,
}

export const Layout = component(
  startWithType<TLayout>(),
  mapDefaultProps({
    direction: 'horizontal',
    hPadding: 0,
    vPadding: 0,
    spaceBetween: 0,
  }),
  mapContext(LayoutContext),
  mapChildren({
    items: {
      symbols: [SYMBOL_LAYOUT_ITEM],
      isMultiple: true,
    },
    restChildren: {
      symbols: [SYMBOL_CHILDREN_REST],
      isMultiple: true,
    },
  }),
  mapStateRef('layoutRef', 'flushLayout', ({ items }) => {
    const numItems = items.length

    return {
      lefts: Array(numItems).fill(0),
      tops: Array(numItems).fill(0),
      renderedWidths: Array(numItems).fill(0),
      renderedHeights: Array(numItems).fill(0),
      measuredWidths: Array(numItems).fill(0),
      measuredHeights: Array(numItems).fill(0),
      maxWidths: Array(numItems).fill(0),
      maxHeights: Array(numItems).fill(0),
      onItemWidthChangeFns: Array(numItems) as (TOnItemSizeChange | undefined)[],
      onItemHeightChangeFns: Array(numItems) as (TOnItemSizeChange | undefined)[],
    }
  }, []),
  mapHandlers({
    reportWidthChange: ({ direction, layoutRef, hPadding, spaceBetween, flushLayout, _onWidthChange }) => () => {
      if (isFunction(_onWidthChange)) {
        // console.log('ON WIDTH', layoutRef.current.renderedWidths)
        _onWidthChange(
          direction === 'horizontal'
            ? calcTotal(layoutRef.current.renderedWidths, hPadding, spaceBetween)
            : calcMax(layoutRef.current.renderedWidths) + hPadding * 2
        )
      } else {
        flushLayout()
      }
    },
    reportHeightChange: ({ direction, layoutRef, vPadding, spaceBetween, flushLayout, _onHeightChange }) => () => {
      if (isFunction(_onHeightChange)) {
        // console.log('ON HEIGHT', layoutRef.current.renderedHeights)
        _onHeightChange(
          direction === 'horizontal'
            ? calcMax(layoutRef.current.renderedHeights) + vPadding * 2
            : calcTotal(layoutRef.current.renderedHeights, vPadding, spaceBetween)
        )
      } else {
        flushLayout()
      }
    },
  }),
  mapHandlers({
    onItemWidthChange: ({ layoutRef, flushLayout }) => (index: number, value: number) => {
      // console.log('ON_ITEM_WIDTH', index, value)
      layoutRef.current.measuredWidths[index] = value
      flushLayout()
    },
    onItemHeightChange: ({ layoutRef, flushLayout }) => (index: number, value: number) => {
      // console.log('ON_ITEM_HEIGHT', index, value)
      layoutRef.current.measuredHeights[index] = value
      flushLayout()
    },
  }),
  onChange(({
    items,
    direction,
    layoutRef,
    onItemWidthChange,
    _width,
    _onWidthChange,
    _maxWidth,
    reportWidthChange,
    hPadding,
    spaceBetween,
  }) => {
    const {
      lefts,
      renderedWidths,
      measuredWidths,
      maxWidths,
      onItemWidthChangeFns,
    } = layoutRef.current
    const shouldMeasureWidth = isFunction(_onWidthChange)

    // check if num items has changed
    equalizeArrays(items, lefts, renderedWidths, measuredWidths, onItemWidthChangeFns, reportWidthChange, shouldMeasureWidth)

    // Main Axis
    if (direction === 'horizontal') {
      if (shouldMeasureWidth) {
        calcMeasureMainAxisLayout(items, lefts, renderedWidths, measuredWidths, maxWidths, onItemWidthChangeFns, onItemWidthChange, getLayoutWidth, getWidth, getMinWidth, getMaxWidth, reportWidthChange, _maxWidth, hPadding, spaceBetween)
      } else {
        calcExplicitMainAxisLayout(items, lefts, renderedWidths, measuredWidths, onItemWidthChangeFns, onItemWidthChange, getLayoutWidth, getMinWidth, getMaxWidth, _width, hPadding, spaceBetween)
      }

      return
    }

    // Cross Axis
    if (shouldMeasureWidth) {
      calcMeasureCrossAxisLayout(items, lefts, renderedWidths, measuredWidths, maxWidths, onItemWidthChangeFns, onItemWidthChange, getWidth, getMinWidth, getMaxWidth, reportWidthChange, _maxWidth, hPadding)
    } else {
      calcExplicitCrossAxisLayout(items, lefts, renderedWidths, onItemWidthChangeFns, _width, hPadding)
    }
  }, ['items']),
  onChange(({
    items,
    direction,
    layoutRef,
    onItemHeightChange,
    _height,
    _onHeightChange,
    _maxHeight,
    reportHeightChange,
    vPadding,
    spaceBetween,
  }) => {
    const {
      tops,
      renderedHeights,
      measuredHeights,
      maxHeights,
      onItemHeightChangeFns,
    } = layoutRef.current
    const shouldMeasureHeight = isFunction(_onHeightChange)

    // check if num items has changed
    equalizeArrays(items, tops, renderedHeights, measuredHeights, onItemHeightChangeFns, reportHeightChange, shouldMeasureHeight)

    // Cross Axis
    if (direction === 'horizontal') {
      if (shouldMeasureHeight) {
        calcMeasureCrossAxisLayout(items, tops, renderedHeights, measuredHeights, maxHeights, onItemHeightChangeFns, onItemHeightChange, getHeight, getMinHeight, getMaxHeight, reportHeightChange, _maxHeight, vPadding)
      } else {
        calcExplicitCrossAxisLayout(items, tops, renderedHeights, onItemHeightChangeFns, _height, vPadding)
      }

      return
    }

    if (shouldMeasureHeight) {
      calcMeasureMainAxisLayout(items, tops, renderedHeights, measuredHeights, maxHeights, onItemHeightChangeFns, onItemHeightChange, getLayoutHeight, getHeight, getMinHeight, getMaxHeight, reportHeightChange, _maxHeight, vPadding, spaceBetween)
    } else {
      calcExplicitMainAxisLayout(items, tops, renderedHeights, measuredHeights, onItemHeightChangeFns, onItemHeightChange, getLayoutHeight, getMinHeight, getMaxHeight, _height, vPadding, spaceBetween)
    }
  }, ['items'])
)(({
  _x,
  _y,
  _left,
  _top,
  _width,
  _height,
  _maxWidth,
  _maxHeight,
  layoutRef,
  items,
  restChildren,
}) => {
  const {
    lefts,
    tops,
    renderedWidths,
    renderedHeights,
    maxWidths,
    maxHeights,
    onItemWidthChangeFns,
    onItemHeightChangeFns,
  } = layoutRef.current

  return (
    <Fragment>
      {restChildren.length > 0 && (
        <LayoutContext.Provider
          value={{
            _x,
            _y,
            _parentLeft: _left,
            _parentTop: _top,
            _parentWidth: _width,
            _parentHeight: _height,
            _left,
            _top,
            _width,
            _height,
            _maxWidth,
            _maxHeight,
          }}
        >
          {restChildren}
        </LayoutContext.Provider>
      )}
      {items.map((child, i) => (
        <LayoutItemContext.Provider
          key={child.props.id ?? i}
          value={{
            _x: _x + lefts[i],
            _y: _y + tops[i],
            _left: _left + lefts[i],
            _top: _top + tops[i],
            _width: renderedWidths[i],
            _height: renderedHeights[i],
            _itemIndex: i,
            _onWidthChange: onItemWidthChangeFns[i],
            _onHeightChange: onItemHeightChangeFns[i],
            _maxWidth: maxWidths[i],
            _maxHeight: maxHeights[i],
          }}
        >
          {child}
        </LayoutItemContext.Provider>
      ))}
    </Fragment>
  )
})

Layout.displayName = 'Layout'
Layout.componentSymbol = SYMBOL_LAYOUT
