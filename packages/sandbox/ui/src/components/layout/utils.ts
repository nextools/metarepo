/* eslint-disable max-params */
import { isNumber, UNDEFINED } from 'tsfn'
import { ReactElement } from 'react'
import { LAYOUT_SIZE_1, LAYOUT_SIZE_2, LAYOUT_SIZE_3, LAYOUT_SIZE_4, LAYOUT_SIZE_FIT } from '../../symbols'
import { TLayoutSize } from './types'

export type TOnItemSizeChange = (index: number, value: number) => void

export const SIZE_INITIAL = 0
export const getLayoutWidth = (item: ReactElement): TLayoutSize => item.props.width || LAYOUT_SIZE_1
export const getWidth = (item: ReactElement): number | undefined => item.props.width
export const getMinWidth = (item: ReactElement): number | undefined => item.props.minWidth
export const getMaxWidth = (item: ReactElement): number | undefined => item.props.maxWidth
export const getLayoutHeight = (item: ReactElement): TLayoutSize => item.props.height || LAYOUT_SIZE_1
export const getHeight = (item: ReactElement): number | undefined => item.props.height
export const getMinHeight = (item: ReactElement): number | undefined => item.props.minHeight
export const getMaxHeight = (item: ReactElement): number | undefined => item.props.maxHeight

export const getNumLayoutParts = (layoutValue: TLayoutSize): number => {
  switch (layoutValue) {
    case LAYOUT_SIZE_1:
      return 1
    case LAYOUT_SIZE_2:
      return 2
    case LAYOUT_SIZE_3:
      return 3
    case LAYOUT_SIZE_4:
      return 4
    default:
      return 0
  }
}

const getSinglePartSize = (containerSize: number, preOccupiedPixels: number, totalLayoutParts: number): number => {
  return Math.max(containerSize - preOccupiedPixels, 0) / Math.max(totalLayoutParts, 1)
}

const clampValue = (currentValue: number, userDefinedValue?: number, userDefinedMinValue?: number, userDefinedMaxValue?: number): number => {
  let value = currentValue

  if (isNumber(userDefinedValue)) {
    value = userDefinedValue
  }

  if (isNumber(userDefinedMinValue) && value < userDefinedMinValue) {
    value = userDefinedMinValue
  }

  if (isNumber(userDefinedMaxValue) && value > userDefinedMaxValue) {
    value = userDefinedMaxValue
  }

  return value
}

export const clampWidth = (currentWidth: number, item: ReactElement): number => {
  return clampValue(currentWidth, item.props.width, item.props.minWidth, item.props.maxWidth)
}

export const clampHeight = (currentHeight: number, item: ReactElement): number => {
  return clampValue(currentHeight, item.props.height, item.props.minHeight, item.props.maxHeight)
}

const isValueNear = (value: number, limit: number): boolean => {
  return value > limit * 0.8
}

export const calcTotal = (values: readonly number[], padding: number, spacing: number): number => {
  let total = padding * 2 - spacing

  for (let i = 0; i < values.length; i++) {
    total += values[i] + spacing
  }

  return Math.max(total, 0)
}

export const calcMax = (values: readonly number[]): number => {
  let max = 0

  for (let i = 0; i < values.length; i++) {
    if (values[i] > max) {
      max = values[i]
    }
  }

  return max
}

export const equalizeArrays = (
  items: ReactElement[],
  itemPositions: number[],
  itemRenderSizes: number[],
  itemMeasuredSizes: number[],
  onItemSizeChangeFunctions: (TOnItemSizeChange | undefined)[],
  onContainerSizeChange: () => void,
  isMeasureMode: boolean
) => {
  const numItems = items.length
  const shouldReportSizeChange = isMeasureMode && itemMeasuredSizes.length > numItems

  itemPositions.length = numItems

  for (let i = itemMeasuredSizes.length; i < numItems; i++) {
    itemMeasuredSizes.push(0)
    itemRenderSizes.push(0)
  }

  itemMeasuredSizes.length = numItems
  itemRenderSizes.length = numItems
  onItemSizeChangeFunctions.length = numItems

  if (shouldReportSizeChange) {
    onContainerSizeChange()
  }
}

export const calcMeasureMainAxisLayout = (
  items: ReactElement[],
  itemPositions: number[],
  itemRenderSizes: number[],
  itemMeasuredSizes: readonly number[],
  itemMaxSizes: number[],
  onItemSizeChangeFns: (TOnItemSizeChange | undefined)[],
  onItemSizeChange: TOnItemSizeChange,
  getItemLayoutSize: (item: ReactElement) => TLayoutSize,
  getItemSize: (item: ReactElement) => number | undefined,
  getItemMinSize: (item: ReactElement) => number | undefined,
  getItemMaxSize: (item: ReactElement) => number | undefined,
  onContainerSizeChanged: () => void,
  containerMaxSize: number | undefined,
  padding: number,
  spacing: number
) => {
  const numItems = items.length
  let totalSize = 0
  let shouldReportSizeChange = false

  // console.log('####################')
  // console.log('CONT', containerMaxSize)
  // console.log('MEASURED', itemMeasuredSizes)
  // console.log('RENDER_BEFORE', itemRenderSizes)

  if (isNumber(containerMaxSize)) {
    let numLayoutParts = 0

    // Collect num parts
    for (let i = 0; i < numItems; i++) {
      numLayoutParts += getNumLayoutParts(getItemLayoutSize(items[i]))
    }

    let availablePixels = containerMaxSize
    let needOneMorePass = true
    const stabilizedItems = Array(numItems).fill(false)

    while (needOneMorePass) {
      needOneMorePass = false

      const itemMaxPartSize = availablePixels / Math.max(numLayoutParts, 1)

      // console.log('---------------')
      // console.log('PART_MAX_SIZE', availablePixels, itemMaxPartSize)

      for (let i = 0; i < numItems; i++) {
        const item = items[i]
        const itemLayoutSize = getItemLayoutSize(item)
        const userDefinedMaxSize = getItemMaxSize(item)
        const itemNumLayoutParts = getNumLayoutParts(itemLayoutSize)
        const itemSize = clampValue(itemMeasuredSizes[i], getItemSize(item), getItemMinSize(item), getItemMaxSize(item))
        const itemLayoutMaxSize = itemMaxPartSize * itemNumLayoutParts

        if (!stabilizedItems[i]) {
          if (itemLayoutSize === LAYOUT_SIZE_FIT || isNumber(itemLayoutSize)) {
            availablePixels -= itemSize
            itemMaxSizes[i] = 0
            stabilizedItems[i] = true
            needOneMorePass = true

            continue
          }

          if (isNumber(userDefinedMaxSize) && userDefinedMaxSize < itemLayoutMaxSize && isValueNear(itemSize, userDefinedMaxSize)) {
            availablePixels -= userDefinedMaxSize
            numLayoutParts -= itemNumLayoutParts
            itemMaxSizes[i] = userDefinedMaxSize
            stabilizedItems[i] = true
            needOneMorePass = true

            continue
          }

          itemMaxSizes[i] = itemLayoutMaxSize

          if (!isValueNear(itemSize, itemLayoutMaxSize)) {
            availablePixels -= itemSize
            numLayoutParts -= itemNumLayoutParts
            stabilizedItems[i] = true
            needOneMorePass = true
          }
        }
      }
    }
  }

  for (let i = 0; i < numItems; i++) {
    const item = items[i]
    const userSize = getItemSize(item)
    const size = clampValue(itemMeasuredSizes[i], userSize, getItemMinSize(item), getItemMaxSize(item))
    const shouldMeasureItem = !isNumber(userSize)

    shouldReportSizeChange = shouldReportSizeChange || itemRenderSizes[i] !== size
    itemPositions[i] = totalSize + padding
    itemRenderSizes[i] = size
    totalSize += size + spacing
    onItemSizeChangeFns[i] = shouldMeasureItem ? onItemSizeChange : UNDEFINED
  }

  // console.log('RENDER_AFTER', itemRenderSizes)
  // console.log('MAX_SIZES', itemMaxSizes)

  if (shouldReportSizeChange) {
    onContainerSizeChanged()
  }
}

export const calcMeasureCrossAxisLayout = (
  items: ReactElement[],
  itemPositions: number[],
  itemRenderSizes: number[],
  itemMeasuredSizes: readonly number[],
  itemMaxSizes: number[],
  onItemSizeChangeFns: (TOnItemSizeChange | undefined)[],
  onItemSizeChange: TOnItemSizeChange,
  getItemSize: (item: ReactElement) => number | undefined,
  getItemMinSize: (item: ReactElement) => number | undefined,
  getItemMaxSize: (item: ReactElement) => number | undefined,
  onContainerSizeChanged: () => void,
  containerMaxSize: number | undefined,
  padding: number
) => {
  const numItems = items.length
  const prevMaxSize = calcMax(itemRenderSizes)

  // console.log('MS', prevMaxSize)

  for (let i = 0; i < numItems; i++) {
    const item = items[i]
    const userSize = getItemSize(item)
    const size = clampValue(itemMeasuredSizes[i], userSize, getItemMinSize(item), getItemMaxSize(item))
    const shouldMeasureItem = !isNumber(userSize)

    itemPositions[i] = padding
    itemRenderSizes[i] = size
    itemMaxSizes[i] = containerMaxSize ?? 0
    onItemSizeChangeFns[i] = shouldMeasureItem ? onItemSizeChange : UNDEFINED
  }

  const maxSize = calcMax(itemRenderSizes)

  // console.log('RS', maxSize)

  for (let i = 0; i < numItems; i++) {
    itemRenderSizes[i] = maxSize
  }

  if (prevMaxSize !== maxSize) {
    onContainerSizeChanged()
  }
}

export const calcExplicitMainAxisLayout = (
  items: ReactElement[],
  itemPositions: number[],
  itemRenderSizes: number[],
  itemMeasuredSizes: readonly number[],
  onItemSizeChangeFns: (TOnItemSizeChange | undefined)[],
  onItemSizeChange: TOnItemSizeChange,
  getLayoutSize: (item: ReactElement) => TLayoutSize,
  getItemMinSize: (item: ReactElement) => number | undefined,
  getItemMaxSize: (item: ReactElement) => number | undefined,
  containerSize: number,
  padding: number,
  spacing: number
) => {
  const numItems = items.length
  let totalLayoutParts = 0
  let preOccupiedPixels = (numItems - 1) * spacing + padding * 2

  // PHASE 1: Collect values
  for (let i = 0; i < numItems; i++) {
    const item = items[i]
    const layoutValue = getLayoutSize(item)

    // Layout Size
    if (isNumber(layoutValue)) {
      const clampedValue = clampValue(0, layoutValue, getItemMinSize(item), getItemMaxSize(item))

      preOccupiedPixels += clampedValue
      itemRenderSizes[i] = clampedValue

      continue
    }

    // Layout Parts
    const numParts = getNumLayoutParts(layoutValue)

    if (numParts > 0) {
      totalLayoutParts += numParts
      itemRenderSizes[i] = 0

      continue
    }

    // Layout Fit
    preOccupiedPixels += itemMeasuredSizes[i]
    itemRenderSizes[i] = itemMeasuredSizes[i]
  }

  // PHASE 2: Stabilize values
  let isStabilized = false

  while (!isStabilized) {
    isStabilized = true

    const singlePartSize = getSinglePartSize(containerSize, preOccupiedPixels, totalLayoutParts)

    for (let i = 0; i < numItems; i++) {
      const item = items[i]
      const layoutValue = getLayoutSize(item)
      const numParts = getNumLayoutParts(layoutValue)
      let size = itemRenderSizes[i]

      if (size === 0 && numParts > 0) {
        size = singlePartSize * numParts

        const clampedSize = clampValue(size, size, getItemMinSize(item), getItemMaxSize(item))

        if (clampedSize !== size) {
          itemRenderSizes[i] = clampedSize
          preOccupiedPixels += clampedSize
          totalLayoutParts -= numParts

          isStabilized = false

          break
        }
      }
    }
  }

  // PHASE 3: Assign values
  const singlePartSize = getSinglePartSize(containerSize, preOccupiedPixels, totalLayoutParts)
  let totalSize = 0

  for (let i = 0; i < numItems; i++) {
    const item = items[i]
    const layoutValue = getLayoutSize(item)
    const shouldMeasureItem = layoutValue === LAYOUT_SIZE_FIT

    if (itemRenderSizes[i] === 0) {
      itemRenderSizes[i] = getNumLayoutParts(layoutValue) * singlePartSize
    }

    itemPositions[i] = totalSize + padding
    totalSize += itemRenderSizes[i] + spacing
    onItemSizeChangeFns[i] = shouldMeasureItem ? onItemSizeChange : UNDEFINED
  }
}

export const calcExplicitCrossAxisLayout = (
  items: ReactElement[],
  itemPositions: number[],
  itemRenderSizes: number[],
  onItemSizeChangeFns: (TOnItemSizeChange | undefined)[],
  containerSize: number,
  padding: number
) => {
  const numItems = items.length
  const maxSize = Math.max(containerSize - padding * 2, 0)

  for (let i = 0; i < numItems; i++) {
    itemRenderSizes[i] = maxSize
    itemPositions[i] = padding
    onItemSizeChangeFns[i] = UNDEFINED
  }
}
