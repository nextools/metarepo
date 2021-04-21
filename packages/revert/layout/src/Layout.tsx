import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { component, startWithType, mapDefaultProps, mapContext, mapStateRef, mapHandlers } from 'refun'
import { isFunction } from 'tsfn'
import { LayoutContext } from './LayoutContext'
import { LayoutItemContext } from './LayoutItemContext'
import { mapChildren } from './map-children'
import { onChange } from './on-change'
import { onLayout } from './on-layout'
import { SYMBOL_LAYOUT, SYMBOL_LAYOUT_ITEM, SYMBOL_CHILDREN_REST, SYMBOL_LAYOUT_MOVE_BEGIN } from './symbols'
import type { TItemMoveState, TLayoutDirection, TLayoutRenderState } from './types'
import {
  calcTotal,
  calcMax,
  calcExplicitMainAxisLayout,
  calcMeasureMainAxisLayout,
  calcMeasureCrossAxisLayout,
  calcExplicitCrossAxisLayout,
  prepareRenderState,
  getWidth,
  getMinWidth,
  getMaxWidth,
  getLayoutWidth,
  getHeight,
  getMinHeight,
  getMaxHeight,
  getLayoutHeight,
  adjustDragValue,
} from './utils'

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
  mapStateRef('layoutRenderStateRef', 'flushLayout', ({ items }): TLayoutRenderState => {
    const numItems = items.length

    return {
      keys: Array(numItems),
      lefts: Array(numItems).fill(0),
      tops: Array(numItems).fill(0),
      offsets: Array(numItems * 2).fill(0),
      renderedWidths: Array(numItems * 2).fill(0),
      renderedHeights: Array(numItems * 2).fill(0),
      measuredWidths: Array(numItems * 2).fill(0),
      measuredHeights: Array(numItems * 2).fill(0),
      maxWidths: Array(numItems * 2).fill(0),
      maxHeights: Array(numItems * 2).fill(0),
      onItemWidthChangeFns: Array(numItems),
      onItemHeightChangeFns: Array(numItems),
      onItemMovedFns: Array(numItems),
      hasContainerWidthChanged: false,
      hasContainerHeightChanged: false,
      lastMovePos: 0,
    }
  }, []),
  mapHandlers({
    reportWidthChange: ({ layoutRenderStateRef }) => () => {
      layoutRenderStateRef.current.hasContainerWidthChanged = true
    },
    reportHeightChange: ({ layoutRenderStateRef }) => () => {
      layoutRenderStateRef.current.hasContainerHeightChanged = true
    },
    onItemWidthChange: ({ layoutRenderStateRef, flushLayout }) => (index: number, value: number) => {
      layoutRenderStateRef.current.measuredWidths[index] = value
      flushLayout()
    },
    onItemHeightChange: ({ layoutRenderStateRef, flushLayout }) => (index: number, value: number) => {
      layoutRenderStateRef.current.measuredHeights[index] = value
      flushLayout()
    },
    onItemMoved: ({ items, direction, layoutRenderStateRef, flushLayout }) => (index: number, value: number, moveState: TItemMoveState) => {
      if (moveState === SYMBOL_LAYOUT_MOVE_BEGIN) {
        layoutRenderStateRef.current.lastMovePos = value

        return
      }

      const {
        offsets,
        renderedWidths,
        renderedHeights,
        lastMovePos,
      } = layoutRenderStateRef.current
      const diff = value - lastMovePos
      const clampedDiff = direction === 'horizontal'
        ? adjustDragValue(index, diff, items, renderedWidths, getMinWidth, getMaxWidth)
        : adjustDragValue(index, diff, items, renderedHeights, getMinHeight, getMaxHeight)

      if (clampedDiff !== 0) {
        offsets[index] += clampedDiff
        layoutRenderStateRef.current.lastMovePos += clampedDiff

        flushLayout()
      }
    },
  }),
  onChange(({ items, layoutRenderStateRef, _onWidthChange, _onHeightChange }) => {
    prepareRenderState(
      items,
      layoutRenderStateRef.current,
      isFunction(_onWidthChange),
      isFunction(_onHeightChange)
    )
  }),
  onChange(({
    items,
    direction,
    layoutRenderStateRef,
    onItemWidthChange,
    onItemMoved,
    _width,
    _onWidthChange,
    _maxWidth,
    reportWidthChange,
    hPadding,
    spaceBetween,
  }) => {
    const {
      lefts,
      offsets,
      renderedWidths,
      measuredWidths,
      maxWidths,
      onItemWidthChangeFns,
      onItemMovedFns,
    } = layoutRenderStateRef.current
    const shouldMeasureWidth = isFunction(_onWidthChange)

    // Main Axis
    if (direction === 'horizontal') {
      if (shouldMeasureWidth) {
        calcMeasureMainAxisLayout(
          items,
          lefts,
          renderedWidths,
          measuredWidths,
          maxWidths,
          onItemWidthChangeFns,
          onItemWidthChange,
          onItemMovedFns,
          onItemMoved,
          getLayoutWidth,
          getWidth,
          getMinWidth,
          getMaxWidth,
          reportWidthChange,
          _maxWidth,
          hPadding,
          spaceBetween
        )
      } else {
        calcExplicitMainAxisLayout(
          items,
          lefts,
          offsets,
          renderedWidths,
          measuredWidths,
          onItemWidthChangeFns,
          onItemWidthChange,
          onItemMovedFns,
          onItemMoved,
          getLayoutWidth,
          getMinWidth,
          getMaxWidth,
          _width,
          hPadding,
          spaceBetween
        )
      }

      return
    }

    // Cross Axis
    if (shouldMeasureWidth) {
      calcMeasureCrossAxisLayout(
        items,
        lefts,
        renderedWidths,
        measuredWidths,
        maxWidths,
        onItemWidthChangeFns,
        onItemWidthChange,
        getWidth,
        getMinWidth,
        getMaxWidth,
        reportWidthChange,
        _maxWidth,
        hPadding
      )
    } else {
      calcExplicitCrossAxisLayout(
        items,
        lefts,
        renderedWidths,
        onItemWidthChangeFns,
        _width,
        hPadding
      )
    }
  }),
  onChange(({
    items,
    direction,
    layoutRenderStateRef,
    onItemHeightChange,
    onItemMoved,
    _height,
    _onHeightChange,
    _maxHeight,
    reportHeightChange,
    vPadding,
    spaceBetween,
  }) => {
    const {
      tops,
      offsets,
      renderedHeights,
      measuredHeights,
      maxHeights,
      onItemHeightChangeFns,
      onItemMovedFns,
    } = layoutRenderStateRef.current
    const shouldMeasureHeight = isFunction(_onHeightChange)

    // Cross Axis
    if (direction === 'horizontal') {
      if (shouldMeasureHeight) {
        calcMeasureCrossAxisLayout(
          items,
          tops,
          renderedHeights,
          measuredHeights,
          maxHeights,
          onItemHeightChangeFns,
          onItemHeightChange,
          getHeight,
          getMinHeight,
          getMaxHeight,
          reportHeightChange,
          _maxHeight,
          vPadding
        )
      } else {
        calcExplicitCrossAxisLayout(
          items,
          tops,
          renderedHeights,
          onItemHeightChangeFns,
          _height,
          vPadding
        )
      }

      return
    }

    // Main Axis
    if (shouldMeasureHeight) {
      calcMeasureMainAxisLayout(
        items,
        tops,
        renderedHeights,
        measuredHeights,
        maxHeights,
        onItemHeightChangeFns,
        onItemHeightChange,
        onItemMovedFns,
        onItemMoved,
        getLayoutHeight,
        getHeight,
        getMinHeight,
        getMaxHeight,
        reportHeightChange,
        _maxHeight,
        vPadding,
        spaceBetween
      )
    } else {
      calcExplicitMainAxisLayout(
        items,
        tops,
        offsets,
        renderedHeights,
        measuredHeights,
        onItemHeightChangeFns,
        onItemHeightChange,
        onItemMovedFns,
        onItemMoved,
        getLayoutHeight,
        getMinHeight,
        getMaxHeight,
        _height,
        vPadding,
        spaceBetween
      )
    }
  }),
  onLayout(({ items, layoutRenderStateRef, _onWidthChange, _onHeightChange, direction, hPadding, vPadding, spaceBetween }) => {
    const {
      hasContainerWidthChanged,
      renderedWidths,
      hasContainerHeightChanged,
      renderedHeights,
    } = layoutRenderStateRef.current

    if (hasContainerWidthChanged) {
      layoutRenderStateRef.current.hasContainerWidthChanged = false

      _onWidthChange?.(
        direction === 'horizontal'
          ? calcTotal(renderedWidths, spaceBetween, items.length) + hPadding * 2
          : calcMax(renderedWidths, items.length) + hPadding * 2
      )
    }

    if (hasContainerHeightChanged) {
      layoutRenderStateRef.current.hasContainerHeightChanged = false

      _onHeightChange?.(
        direction === 'horizontal'
          ? calcMax(renderedHeights, items.length) + vPadding * 2
          : calcTotal(renderedHeights, spaceBetween, items.length) + vPadding * 2
      )
    }
  })
)(({
  _x,
  _y,
  _left,
  _top,
  _width,
  _height,
  _maxWidth,
  _maxHeight,
  direction,
  layoutRenderStateRef,
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
    onItemMovedFns,
  } = layoutRenderStateRef.current

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
          key={child.key ?? i}
          value={{
            _direction: direction,
            _x: _x + lefts[i],
            _y: _y + tops[i],
            _left: _left + lefts[i],
            _top: _top + tops[i],
            _width: renderedWidths[i],
            _height: renderedHeights[i],
            _itemIndex: i,
            _onWidthChange: onItemWidthChangeFns[i],
            _onHeightChange: onItemHeightChangeFns[i],
            _onItemMove: onItemMovedFns[i],
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
