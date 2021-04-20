import { easeInOutCubic, AnimationValue } from '@revert/animation'
import { PrimitiveBorder as Border } from '@revert/border'
import type { TListItems } from '@x-ray/core'
import bsc from 'bsc'
import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { startWithType, mapHandlers, mapWithPropsMemo, pureComponent } from 'refun'
import { isUndefined } from 'tsfn'
import { actionSelectScreenshot } from '../../actions'
import { COL_SPACE, COL_WIDTH, BORDER_SIZE, COLOR_BLACK } from '../../config'
import { mapStoreDispatch } from '../../store'
import type { TScreenshotGridItem, TRect } from '../../types'
import { Block } from '../Block'
import { ScreenshotDeleted } from '../ScreenshotDeleted'
import { ScreenshotDiff } from '../ScreenshotDiff'
import { ScreenshotNew } from '../ScreenshotNew'
import { Pointer } from './Pointer'
import { isVisibleItem } from './is-visible-item'
import { mapDiffState } from './map-diff-state'
import { mapScrollState } from './map-scroll-state'

export type TScreenshotGrid = TRect & {
  items: TListItems,
  discardedItems: string[],
  filteredFiles: string[],
  shouldAnimate: boolean,
}

export const ScreenshotGrid = pureComponent(
  startWithType<TScreenshotGrid>(),
  mapStoreDispatch('dispatch'),
  mapWithPropsMemo(({ width, items, filteredFiles }) => {
    const colCount = Math.max(1, Math.floor((width - COL_SPACE) / (COL_WIDTH + COL_SPACE)))
    const gridWidth = (width - (COL_SPACE * (colCount + 1))) / colCount
    const top = Array(colCount).fill(0)
    const cols: TScreenshotGridItem[][] = Array.from({ length: colCount }, () => [])

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

      let gridHeight: number

      if (item.type === 'DIFF') {
        const largestWidth = item.origWidth > item.width ? item.origWidth : item.width
        const largestHeight = item.origHeight > item.height ? item.origHeight : item.height

        gridHeight = (gridWidth - BORDER_SIZE * 2) / largestWidth * largestHeight + BORDER_SIZE * 2
      } else {
        gridHeight = (gridWidth - BORDER_SIZE * 2) / item.width * item.height + BORDER_SIZE * 2
      }

      const result: TScreenshotGridItem = {
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
  }, ['width', 'items', 'filteredFiles']),
  mapScrollState(),
  mapHandlers({
    onPress: ({ top, dispatch, scrollTop, cols }) => (x: number, y: number) => {
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

          dispatch(actionSelectScreenshot({
            ...item,
            top: item.top - scrollTop + top,
          }))
        }
      }
    },
  }),
  mapDiffState()
)(({
  cols,
  discardedItems,
  maxHeight,
  top,
  left,
  width,
  height,
  scrollTop,
  prevScrollTop,
  diffState,
  onScroll,
  onPress,
}) => (
  <Pointer
    left={left}
    top={top}
    width={width}
    height={height}
    onScroll={onScroll}
    onPress={onPress}
  >
    <Block left={0} top={0} width={0} height={maxHeight} shouldFlow/>
    <AnimationValue toValue={diffState ? 1 : 0} time={500} easing={easeInOutCubic}>
      {(alpha) => (
        <Fragment>
          {cols.reduce((result, col) => (
            result.concat(
              col.map((item: TScreenshotGridItem) => {
                const isVisible = isVisibleItem(item, scrollTop, height)
                const isNew = prevScrollTop !== null && ((item.top + item.gridHeight < prevScrollTop) || (item.top > prevScrollTop + height))

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
                      <ScreenshotNew
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
                    const largestWidth = item.origWidth > item.width ? item.origWidth : item.width
                    const scale = item.gridWidth / largestWidth

                    return (
                      <ScreenshotDiff
                        key={item.id}
                        id={item.id}
                        top={item.top}
                        left={item.left}
                        oldWidth={item.origWidth * scale}
                        oldHeight={item.origHeight * scale}
                        newWidth={item.width * scale}
                        newHeight={item.height * scale}
                        oldAlpha={1 - alpha}
                        newAlpha={alpha}
                        isDiscarded={isDiscarded}
                      />
                    )
                  }

                  if (item.type === 'DELETED') {
                    return (
                      <ScreenshotDeleted
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
        </Fragment>
      )}
    </AnimationValue>
  </Pointer>
))

ScreenshotGrid.displayName = 'ScreenshotGrid'
