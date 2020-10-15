/* eslint-disable max-params */
import type { ReactElement } from 'react'
import { isNumber, UNDEFINED } from 'tsfn'
import { LAYOUT_SIZE_1, LAYOUT_SIZE_2, LAYOUT_SIZE_3, LAYOUT_SIZE_4, LAYOUT_SIZE_FIT } from './symbols'
import type { TLayoutRenderState, TLayoutSize, TOnItemMove, TOnItemSizeChange } from './types'

export const getLayoutWidth = (item: ReactElement): TLayoutSize => item.props.width ?? LAYOUT_SIZE_1
export const getLayoutHeight = (item: ReactElement): TLayoutSize => item.props.height ?? LAYOUT_SIZE_1
export const getWidth = (item: ReactElement): number | undefined => (isNumber(item.props.width) ? item.props.width : UNDEFINED)
export const getMinWidth = (item: ReactElement): number | undefined => item.props.minWidth
export const getMaxWidth = (item: ReactElement): number | undefined => item.props.maxWidth
export const getHeight = (item: ReactElement): number | undefined => (isNumber(item.props.height) ? item.props.height : UNDEFINED)
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

export const isInside = (
  x: number,
  y: number,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  overflow = 0
) => {
  return (
    mouseX > x - overflow &&
    x + width + overflow > mouseX &&
    mouseY > y - overflow &&
    y + height + overflow > mouseY
  )
}

const clampValue = (currentValue: number, userDefinedValue: number | undefined, userDefinedMinValue: number = 0, userDefinedMaxValue: number = 0): number => {
  let result = currentValue

  if (userDefinedValue !== UNDEFINED) {
    result = userDefinedValue
  }

  if (result < userDefinedMinValue) {
    return userDefinedMinValue
  }

  if (userDefinedMaxValue > 0 && result > userDefinedMaxValue) {
    return userDefinedMaxValue
  }

  return result
}

const isValueNear = (value: number, limit: number): boolean => {
  return value > limit * 0.8
}

export const calcTotal = (values: readonly number[], spacing: number, length: number): number => {
  let total = 0

  for (let i = 0; i < length; i++) {
    total += values[i]
  }

  return total + spacing * Math.max(0, length - 1)
}

export const calcMax = (values: readonly number[], length: number): number => {
  let max = 0

  for (let i = 0; i < length; i++) {
    if (values[i] > max) {
      max = values[i]
    }
  }

  return max
}

const adjustSizeByOffsets = (itemSize: number, itemIndex: number, numItems: number, itemOffsets: readonly number[]) => {
  let result = itemSize

  if (itemIndex > 1) {
    result -= itemOffsets[itemIndex - 1]
  }

  if (itemIndex < numItems - 2) {
    result += itemOffsets[itemIndex + 1]
  }

  return result
}

const resetNeighbourOffsets = (itemIndex: number, numItems: number, itemsOffsets: number[]) => {
  if (itemIndex > 0) {
    itemsOffsets[itemIndex - 1] = 0
  }

  if (itemIndex < numItems - 1) {
    itemsOffsets[itemIndex + 1] = 0
  }
}

const isDraggable = (
  itemIndex: number,
  items: readonly ReactElement[],
  getItemSize: (item: ReactElement) => TLayoutSize
): boolean => {
  if (itemIndex <= 0 || itemIndex >= items.length - 1) {
    return false
  }

  if (getItemSize(items[itemIndex - 1]) === LAYOUT_SIZE_FIT || getItemSize(items[itemIndex + 1]) === LAYOUT_SIZE_FIT) {
    return false
  }

  return true
}

const round = (value: number): number => Math.floor(value * 2) / 2

const pushOffsets = (pushDistance: number, itemIndex: number, numItems: number, itemOffsets: number[]): boolean => {
  const inverter = pushDistance < 0 ? -1 : 1
  const dist = pushDistance * inverter
  const canPushLeft = itemIndex > 1
  const allowedLeft = canPushLeft ? Math.max(0, itemOffsets[itemIndex - 1] * inverter) : 0
  const canPushRight = itemIndex < numItems - 2
  const allowedRight = canPushRight ? Math.max(0, -itemOffsets[itemIndex + 1] * inverter) : 0

  let leftPush = Math.min(round(dist / 2), allowedLeft)
  const rightPush = Math.min(dist - leftPush, allowedRight)

  leftPush = Math.min(dist - rightPush, allowedLeft)

  if (allowedLeft !== 0) {
    itemOffsets[itemIndex - 1] -= leftPush * inverter
  }

  if (allowedRight !== 0) {
    itemOffsets[itemIndex + 1] += rightPush * inverter
  }

  return canPushLeft && leftPush > 0
}

export const adjustDragValue = (
  itemIndex: number,
  dragValue: number,
  items: readonly ReactElement[],
  renderedSizes: readonly number[],
  getItemMinSize: (item: ReactElement) => number | undefined,
  getItemMaxSize: (item: ReactElement) => number | undefined
) => {
  if (dragValue === 0 || itemIndex <= 0 || itemIndex >= items.length - 1) {
    return 0
  }

  // Dragging to the left
  if (dragValue < 0) {
    const leftItemMinWidth = getItemMinSize(items[itemIndex - 1]) ?? 0
    const allowedDragLeftItem = leftItemMinWidth - renderedSizes[itemIndex - 1]

    if (dragValue < allowedDragLeftItem) {
      return allowedDragLeftItem
    }

    const rightItemMaxWidth = getItemMaxSize(items[itemIndex + 1]) ?? 0

    if (rightItemMaxWidth > 0) {
      const allowedDragRightItem = renderedSizes[itemIndex + 1] - rightItemMaxWidth

      if (dragValue < allowedDragRightItem) {
        return allowedDragRightItem
      }
    }

    return dragValue
  }

  // Dragging to the right
  const rightItemMinWidth = getItemMinSize(items[itemIndex + 1]) ?? 0
  const allowedDragRightItem = renderedSizes[itemIndex + 1] - rightItemMinWidth

  if (dragValue > allowedDragRightItem) {
    return allowedDragRightItem
  }

  const leftItemMaxWidth = getItemMaxSize(items[itemIndex - 1]) ?? 0

  if (leftItemMaxWidth > 0) {
    const allowedDragLeftItem = leftItemMaxWidth - renderedSizes[itemIndex - 1]

    if (dragValue > allowedDragLeftItem) {
      return allowedDragLeftItem
    }
  }

  return dragValue
}

export const prepareRenderState = (
  items: ReactElement[],
  renderState: TLayoutRenderState,
  isWidthMeasureMode: boolean,
  isHeightMeasureMode: boolean
) => {
  const numItems = items.length
  const prevNumItems = renderState.lefts.length
  const doubleArraySize = numItems + prevNumItems

  renderState.hasContainerWidthChanged = renderState.hasContainerWidthChanged || isWidthMeasureMode && numItems !== prevNumItems
  renderState.hasContainerHeightChanged = renderState.hasContainerHeightChanged || isHeightMeasureMode && numItems !== prevNumItems

  const {
    keys,
    lefts,
    tops,
    offsets,
    maxWidths,
    maxHeights,
    measuredWidths,
    measuredHeights,
    renderedWidths,
    renderedHeights,
    onItemWidthChangeFns,
    onItemHeightChangeFns,
    onItemMovedFns,
  } = renderState

  // Equalize array lengths
  lefts.length = numItems
  tops.length = numItems
  maxWidths.length = numItems
  maxHeights.length = numItems
  keys.length = doubleArraySize
  offsets.length = doubleArraySize
  measuredWidths.length = doubleArraySize
  measuredHeights.length = doubleArraySize
  renderedWidths.length = doubleArraySize
  renderedHeights.length = doubleArraySize
  onItemWidthChangeFns.length = numItems
  onItemHeightChangeFns.length = numItems
  onItemMovedFns.length = numItems

  // PASS 0: Tranfer values to backbuffer
  for (let i = prevNumItems - 1; i >= 0; --i) {
    const k = i + numItems

    keys[k] = keys[i]
    offsets[k] = offsets[i]
    measuredWidths[k] = measuredWidths[i]
    measuredHeights[k] = measuredHeights[i]
    renderedWidths[k] = renderedWidths[i]
    renderedHeights[k] = renderedHeights[i]
  }

  // PASS 1: Check items indices from prev render
  let itemIndexKey = 0

  for (let i = 0; i < numItems; ++i) {
    // Reset values
    maxWidths[i] = 0
    maxHeights[i] = 0
    onItemWidthChangeFns[i] = UNDEFINED
    onItemHeightChangeFns[i] = UNDEFINED
    onItemMovedFns[i] = UNDEFINED

    const item = items[i]
    const itemKey = String(item.key ?? itemIndexKey++)

    // Find Item prev index
    let prevIndex: number | undefined

    // Find prev key index
    for (let p = numItems; p < doubleArraySize; ++p) {
      if (keys[p] === itemKey) {
        prevIndex = p - numItems

        break
      }
    }

    // Check if itemKey is new
    if (prevIndex === UNDEFINED) {
      keys[i] = itemKey
      offsets[i] = 0
      measuredWidths[i] = 0
      measuredHeights[i] = 0
      renderedWidths[i] = 0
      renderedHeights[i] = 0

      continue
    }

    // Check if Item index has not changed
    if (prevIndex === i) {
      continue
    }

    // Item index has changed
    const k = prevIndex + numItems

    keys[i] = keys[k]
    offsets[i] = offsets[k]
    measuredWidths[i] = measuredWidths[k]
    measuredHeights[i] = measuredHeights[k]
    renderedWidths[i] = renderedWidths[k]
    renderedHeights[i] = renderedHeights[k]
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
  onItemMovedFns: (TOnItemMove | undefined)[],
  onItemMoved: TOnItemMove,
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

  if (isNumber(containerMaxSize)) {
    let numLayoutParts = 0

    // Collect num parts
    for (let i = 0; i < numItems; i++) {
      numLayoutParts += getNumLayoutParts(getItemLayoutSize(items[i]))
    }

    let availablePixels = containerMaxSize
    let shouldRecalculate = true
    const stabilizedItems: boolean[] = Array(numItems).fill(false)

    while (shouldRecalculate) {
      shouldRecalculate = false

      const itemMaxPartSize = round(availablePixels / Math.max(numLayoutParts, 1))

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
            shouldRecalculate = true

            break
          }

          if (isNumber(userDefinedMaxSize) && userDefinedMaxSize < itemLayoutMaxSize && isValueNear(itemSize, userDefinedMaxSize)) {
            availablePixels -= userDefinedMaxSize
            numLayoutParts -= itemNumLayoutParts
            itemMaxSizes[i] = userDefinedMaxSize
            stabilizedItems[i] = true
            shouldRecalculate = true

            break
          }

          itemMaxSizes[i] = itemLayoutMaxSize

          if (!isValueNear(itemSize, itemLayoutMaxSize)) {
            availablePixels -= itemSize
            numLayoutParts -= itemNumLayoutParts
            stabilizedItems[i] = true
            shouldRecalculate = true

            break
          }
        }
      }
    }
  }

  // Assign Item sizes
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
    // TODO add onItemMoved if both neighbours are user set sizes | 200 || 300 |
  }

  if (shouldReportSizeChange) {
    onContainerSizeChanged()
  }
}

/**
 * Calculates and assigns Cross-Axis values for each Item in Measure mode
 * @param items - array of Items collected by `mapChildren`
 * @param itemPositions - array of `_left` or `_top` values for a specific Item
 * @param itemRenderSizes - array of `_width` or `_height` values for a specific Item
 * @param itemMeasuredSizes - array of `measured` sizes reported by Items
 * @param itemMaxSizes - array of `_maxWidth` or `_maxHeight` values for a specific Item
 * @param onItemSizeChangeFns - array of measure callback functions. Each element contains ether defined or undefined value, if specific Item requires measurement
 * @param onItemSizeChange - function to assign to put into `onItemSizeChangeFns`, if required, for a specific item
 * @param getItemSize - function returning width or height value, defined in props, for a specific Item
 * @param getItemMinSize - function returning `minWidth` or `minHeight` value, defined in props, for a specific Item
 * @param getItemMaxSize - function returning `maxWidth` or `maxHeight` value, defined in props, for a specific Item
 * @param onContainerSizeChanged - function to report if `Layout` size change has been detected
 * @param containerMaxSize - value of `_maxWidth` or `_maxHeight` propagated to `Layout` from parent container
 * @param padding - value of `padding` prop, assigned to Layout
 */
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
  const prevItemsLargestSize = calcMax(itemRenderSizes, numItems)
  let itemsLargestSize = 0

  // Check User defined sizes and limits
  for (let i = 0; i < numItems; i++) {
    const item = items[i]
    const userSize = getItemSize(item)
    const size = clampValue(itemMeasuredSizes[i], userSize, getItemMinSize(item), getItemMaxSize(item))

    // Accumulate next largest size
    if (size > itemsLargestSize) {
      itemsLargestSize = size
    }

    // Do not measure Item if User explicitly defines its size
    onItemSizeChangeFns[i] = isNumber(userSize) ? UNDEFINED : onItemSizeChange
  }

  // Assign new values
  const eachItemMaxSize = containerMaxSize ?? 0

  for (let i = 0; i < numItems; i++) {
    itemPositions[i] = padding
    itemRenderSizes[i] = itemsLargestSize
    itemMaxSizes[i] = eachItemMaxSize
  }

  // Report if size has changed
  if (Math.abs(prevItemsLargestSize - itemsLargestSize) > 1) {
    onContainerSizeChanged()
  }
}

/**
 * Calculates and assigns Main-Axis values for each Item in Explicit mode
 * @param items - array of Items collected by `mapChildren`
 * @param itemPositions - array of `_left` or `_top` values for a specific Item
 * @param itemOffsets
 * @param itemRenderSizes - array of _width or _height values for a specific Item
 * @param itemMeasuredSizes - array of `measured` sizes reported by Items
 * @param itemMaxSizes
 * @param onItemSizeChangeFns - array of measure callback functions. Each element contains ether defined or undefined value, if specific Item requires measurement
 * @param onItemSizeChange - function to assign to put into `onItemSizeChangeFns`, if required, for a specific item
 * @param getItemLayoutSize - function returning `width` or `height` value, defined in props, for a specific Item
 * @param getItemMinSize - function returning `minWidth` or `minHeight` value, defined in props, for a specific Item
 * @param getItemMaxSize - function returning `maxWidth` or `maxHeight` value, defined in props, for a specific Item
 * @param containerSize - value of `_width` or `_height` propagated to `Layout` from parent container
 * @param padding - value of `padding` prop, assigned to `Layout`
 * @param spacing - value of `spaceBetween` prop, assigned to `Layout`
 */
export const calcExplicitMainAxisLayout = (
  items: ReactElement[],
  itemPositions: number[],
  itemOffsets: number[],
  itemRenderSizes: number[],
  itemMeasuredSizes: readonly number[],
  onItemSizeChangeFns: (TOnItemSizeChange | undefined)[],
  onItemSizeChange: TOnItemSizeChange,
  onItemMovedFns: (TOnItemMove | undefined)[],
  onItemMoved: TOnItemMove,
  getItemLayoutSize: (item: ReactElement) => TLayoutSize,
  getItemMinSize: (item: ReactElement) => number | undefined,
  getItemMaxSize: (item: ReactElement) => number | undefined,
  containerSize: number,
  padding: number,
  spacing: number
) => {
  const numItems = items.length
  // How many layout parts are requested by Dynamic Items
  let totalLayoutParts = 0
  // Pixels that are NOT taken by Staticly defined sizes or limits
  let containerFreePixels = containerSize - Math.max(numItems - 1, 0) * spacing - padding * 2

  // PHASE 1: Collect Static and Dynamic size values
  for (let i = 0; i < numItems; ++i) {
    const item = items[i]
    const layoutValue = getItemLayoutSize(item)

    // Check if Item has Static size
    if (isNumber(layoutValue)) {
      // Do not calc offsets here. It is done later
      // Do not clamp the value.

      containerFreePixels -= layoutValue
      itemRenderSizes[i] = layoutValue

      continue
    }

    // Check if Item has Dynamic size
    const numParts = getNumLayoutParts(layoutValue)

    if (numParts > 0) {
      totalLayoutParts += numParts
      // Zeroify render size to indicate to the next Phase that Item's size is Dynamic
      itemRenderSizes[i] = 0

      continue
    }

    // Item has Fit Size
    containerFreePixels -= itemMeasuredSizes[i]
    itemRenderSizes[i] = itemMeasuredSizes[i]
    onItemSizeChangeFns[i] = onItemSizeChange
    resetNeighbourOffsets(i, numItems, itemOffsets)
  }

  // PHASE 2: Stabilize Dynamic sizes
  // Check all Items for Dynamic size to hit the limits
  // If positive - turn Dynamic size into the Static one
  let shouldRecalc = true

  while (shouldRecalc) {
    shouldRecalc = false

    // Free pixels / total requested parts
    const singlePartSize = round(Math.max(containerFreePixels, 0) / Math.max(totalLayoutParts, 1))
    let freeLayoutParts = totalLayoutParts

    for (let i = 0; i < numItems; i++) {
      const item = items[i]

      // Check if Item has 0 size value, which indicates Dynamic size
      if (itemRenderSizes[i] !== 0) {
        continue
      }

      // Item has Dynamic size
      const numParts = getNumLayoutParts(getItemLayoutSize(item))

      // Check if Item requests for un-occupied space
      if (numParts === 0) {
        continue
      }

      freeLayoutParts -= numParts

      // Calc Dynamic size
      const size = freeLayoutParts === 0
        ? containerFreePixels - singlePartSize * (totalLayoutParts - numParts)
        : singlePartSize * numParts
      const itemMinSize = getItemMinSize(item)
      const itemMaxSize = getItemMaxSize(item)

      // Calc Item limits
      const clampedSize = clampValue(size, size, itemMinSize, itemMaxSize)
      // adjust result size by offset
      const sizeWithOffset = adjustSizeByOffsets(clampedSize, i, numItems, itemOffsets)
      const clampedSizeWithOffset = clampValue(sizeWithOffset, sizeWithOffset, itemMinSize, itemMaxSize)

      // if offsets push the limit
      if (sizeWithOffset !== clampedSizeWithOffset) {
        // get overflow distance
        const overflowDist = clampedSizeWithOffset - sizeWithOffset

        // Try to push offsets outside of the Item
        // If has pushed left offset - recalculate
        if (pushOffsets(overflowDist, i, numItems, itemOffsets)) {
          // Restart Phase 2
          shouldRecalc = true

          break
        }
      }

      // Check if Dynamic size hits the limits
      if (clampedSize !== size) {
        // Turn Dynamic size into the Static one
        itemRenderSizes[i] = clampedSize
        containerFreePixels -= clampedSize
        totalLayoutParts -= numParts

        // Restart Phase 2
        shouldRecalc = true

        break
      }
    }
  }

  // PHASE 3: Assign values
  // Assign Dynamic sizes
  const singlePartSize = round(Math.max(containerFreePixels, 0) / Math.max(totalLayoutParts, 1))
  let nextItemPosition = 0
  let freeLayoutParts = totalLayoutParts

  for (let i = 0; i < numItems; i++) {
    const item = items[i]
    const layoutValue = getItemLayoutSize(item)

    // Check if Item has unnassigned size, meaning the size is Dynamic
    if (itemRenderSizes[i] === 0) {
      const numParts = getNumLayoutParts(layoutValue)

      freeLayoutParts -= numParts

      itemRenderSizes[i] = freeLayoutParts === 0
        ? containerFreePixels - singlePartSize * (totalLayoutParts - numParts)
        : singlePartSize * numParts
    }

    // Adjust size by offsets now
    // Do not check if adjusted Dynamic size hits the limits
    // Limit check should happen during offset value assignment (drag process)
    itemRenderSizes[i] = adjustSizeByOffsets(itemRenderSizes[i], i, numItems, itemOffsets)

    // Assign Item positions
    itemPositions[i] = nextItemPosition + padding
    nextItemPosition += itemRenderSizes[i] + spacing

    if (isDraggable(i, items, getItemLayoutSize)) {
      onItemMovedFns[i] = onItemMoved
    }
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
  const itemSize = Math.max(containerSize - padding * 2, 0)

  for (let i = 0; i < numItems; i++) {
    itemRenderSizes[i] = itemSize
    itemPositions[i] = padding
    onItemSizeChangeFns[i] = UNDEFINED
  }
}
