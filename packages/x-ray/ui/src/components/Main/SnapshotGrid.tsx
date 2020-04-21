import React, { ReactNode } from 'react'
import { pureComponent, startWithType, mapHandlers, mapWithPropsMemo, mapContext } from 'refun'
import bsc from 'bsc'
import { PrimitiveBorder as Border } from '@revert/border'
import { isUndefined } from 'tsfn'
import { LayoutContext } from '@revert/layout'
import { PrimitiveBlock as Block } from '@revert/block'
import { TListItems } from '@x-ray/core'
import { mapStoreDispatch } from '../../store'
import { actionSelectSnapshot } from '../../actions'
import { TSnapshotGridItem } from '../../types'
import { COL_SPACE, COL_WIDTH, SNAPSHOT_GRID_LINE_HEIGHT, BORDER_SIZE, COLOR_BLACK, SNAPSHOT_GRID_MAX_LINES } from '../../config'
import { SnapshotNew } from '../SnapshotNew'
import { SnapshotDiff } from '../SnapshotDiff'
import { SnapshotDeleted } from '../SnapshotDeleted'
import { mapScrollState } from './map-scroll-state'
import { isVisibleItem } from './is-visible-item'
import { Pointer } from './Pointer'

export type TSnapshotGrid = {
  items: TListItems,
  discardedItems: string[],
  filteredFiles: string[],
}

export const SnapshotGrid = pureComponent(
  startWithType<TSnapshotGrid>(),
  mapContext(LayoutContext),
  mapStoreDispatch('dispatch'),
  mapWithPropsMemo(({ _width, items, filteredFiles }) => {
    const colCount = Math.max(1, Math.floor((_width - COL_SPACE) / (COL_WIDTH + COL_SPACE)))
    const gridWidth = (_width - (COL_SPACE * (colCount + 1))) / colCount
    const top = new Array(colCount).fill(0)
    const cols: TSnapshotGridItem[][] = new Array(colCount)
      .fill(0)
      .map(() => [])

    Object.entries(items).forEach(([id, item]) => {
      if (filteredFiles.length > 0) {
        const hasFiltered = filteredFiles.every((file) => !id.startsWith(`${file}:`))

        if (hasFiltered) {
          return
        }
      }

      let minIndex = 0

      for (let i = 1; i < top.length; ++i) {
        if (top[i] < top[minIndex]) {
          minIndex = i
        }
      }

      const gridHeight = Math.min(item.height, SNAPSHOT_GRID_MAX_LINES) * SNAPSHOT_GRID_LINE_HEIGHT + BORDER_SIZE * 2

      const result: TSnapshotGridItem = {
        ...item,
        id,
        gridWidth,
        gridHeight,
        top: top[minIndex],
        left: minIndex * (gridWidth + COL_SPACE) + COL_SPACE,
      }

      cols[minIndex].push(result)

      top[minIndex] += gridHeight + COL_SPACE
    })

    let maxIndex = 0

    for (let i = 1; i < top.length; ++i) {
      if (top[i] > top[maxIndex]) {
        maxIndex = i
      }
    }

    return {
      cols,
      maxHeight: top[maxIndex],
    }
  }, ['_width', 'items', 'filteredFiles']),
  mapScrollState(),
  mapHandlers({
    onPress: ({ _top, dispatch, scrollTop, cols }) => (x: number, y: number) => {
      for (let colIndex = 0; colIndex < cols.length; ++colIndex) {
        const firstItem = cols[colIndex][0]

        if (!isUndefined(firstItem) && (x < firstItem.left || firstItem.left + firstItem.gridWidth < x)) {
          continue
        }

        const itemIndex = bsc(cols[colIndex], (item: any) => {
          if (y + scrollTop < item.top) {
            return -1
          }

          if (y + scrollTop > item.top + item.gridHeight) {
            return 1
          }

          return 0
        })

        if (itemIndex >= 0) {
          const item = cols[colIndex][itemIndex]

          dispatch(actionSelectSnapshot({
            ...item,
            top: item.top - scrollTop + _top,
          }))
        }
      }
    },
  })
)(({
  cols,
  discardedItems,
  maxHeight,
  _top,
  _left,
  _width,
  _height,
  scrollTop,
  prevScrollTop,
  onScroll,
  onPress,
}) => (
  <Pointer
    top={_top}
    left={_left}
    width={_width}
    height={_height}
    onScroll={onScroll}
    onPress={onPress}
  >
    <Block width={0} height={maxHeight} shouldFlow/>
    {cols.reduce((result, col) => (
      result.concat(
        col.map((item: TSnapshotGridItem) => {
          const isVisible = isVisibleItem(item, scrollTop, _height)
          const isNew = prevScrollTop !== null && ((item.top + item.gridHeight < prevScrollTop) || (item.top > prevScrollTop + _height))

          if (isVisible && isNew) {
            return (
              <Block
                key={item.id}
                top={item.top}
                left={item.left}
                width={item.gridWidth}
                height={item.gridHeight}
              >
                <Border
                  color={COLOR_BLACK}
                  borderWidth={BORDER_SIZE}
                />
              </Block>
            )
          }

          if (isVisible) {
            const isDiscarded = discardedItems.includes(item.id)

            if (item.type === 'NEW') {
              return (
                <SnapshotNew
                  key={item.id}
                  id={item.id}
                  top={item.top}
                  left={item.left}
                  width={item.gridWidth}
                  height={item.gridHeight}
                  isDiscarded={isDiscarded}
                />
              )
            }

            if (item.type === 'DIFF') {
              return (
                <SnapshotDiff
                  key={item.id}
                  id={item.id}
                  top={item.top}
                  left={item.left}
                  width={item.gridWidth}
                  height={item.gridHeight}
                  isDiscarded={isDiscarded}
                />
              )
            }

            if (item.type === 'DELETED') {
              return (
                <SnapshotDeleted
                  key={item.id}
                  id={item.id}
                  top={item.top}
                  left={item.left}
                  width={item.gridWidth}
                  height={item.gridHeight}
                  isDiscarded={isDiscarded}
                />
              )
            }
          }
        })
      )
    ), [] as ReactNode[])}
  </Pointer>
))

SnapshotGrid.displayName = 'SnapshotGrid'
