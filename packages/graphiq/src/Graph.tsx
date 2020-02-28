import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapWithPropsMemo, mapDefaultProps, mapState, mapHandlers } from 'refun'
import { TGraphItem } from './types'
import { Points } from './Points'
import { GRAPH_OFFSET } from './constants'
import { getPastMonthsDate } from './utils'
import { Polygon } from './Polygon'
import { Path } from './Path'
import { Tooltips } from './Tooltips'

export const Graph = component(
  startWithType<TGraphItem>(),
  mapDefaultProps({
    shouldShowDots: false,
    isActive: false,
  }),
  mapWithPropsMemo(({ entries, monthsAgo }) => {
    const monthsAgoDate = getPastMonthsDate(monthsAgo)

    let timedEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp * 1000)

      return entryDate >= monthsAgoDate
    })

    if (timedEntries.length === 0) {
      timedEntries = entries
    }

    const values = timedEntries.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    return {
      entries: timedEntries,
      maxValue,
      minValue,
      values,
    }
  }, ['entries', 'monthsAgo']),
  mapWithProps(({ width, height, scale, maxValue, minValue, values }) => ({
    stepX: (width - GRAPH_OFFSET * 2) / (values.length === 1 ? 1 : values.length - 1),
    stepY: (height - GRAPH_OFFSET * 2) * scale / 100 / Math.abs(maxValue - minValue === 0 ? 1 : maxValue - minValue),
  })),
  mapWithProps(({ height, stepY, maxValue, minValue }) => ({
    halfHeight: (height - GRAPH_OFFSET * 2) / 2,
    halfPathHeight: (maxValue - minValue) * stepY / 2,
  })),
  mapWithPropsMemo(({ width, height, entries, minValue, halfHeight, halfPathHeight, stepX, stepY }) => {
    const points = entries.map(({ value, version }, index) => {
      const x = stepX * index + GRAPH_OFFSET
      const y = height - (value * stepY + halfHeight - halfPathHeight - minValue * stepY) - GRAPH_OFFSET

      return {
        x,
        y,
        value,
        version,
      }
    })

    const pointsString = points.length === 1
      ? `${points[0].x}, ${points[0].y} ${points[0].x}, ${points[0].y}`
      : points.map(({ x, y }) => `${x}, ${y}`).join(' ')

    return {
      points: points.slice(0).reverse(),
      pointsString,
      polygonPointsString: `${GRAPH_OFFSET}, ${height - GRAPH_OFFSET} ${pointsString} ${width - GRAPH_OFFSET}, ${height - GRAPH_OFFSET}`,
    }
  }, ['entries', 'minValue', 'halfHeight', 'halfPathHeight', 'stepX', 'stepY', 'height', 'width']),
  mapState('activePoint', 'setActivePoint', () => null as string | null, []),
  mapHandlers({
    onPointerEnter: ({ setActivePoint }) => (id) => {
      setActivePoint(id)
    },
    onPointerLeave: ({ setActivePoint }) => () => {
      setActivePoint(null)
    },
  })
)(({
  activePoint,
  colors,
  id,
  isActive,
  isHovered,
  onSelect,
  points,
  pointsString,
  width,
  polygonPointsString,
  onHover,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Fragment>
    {points.length > 1 && (
      <Polygon
        colors={colors}
        id={id}
        isActive={isActive}
        points={polygonPointsString}
      />

    )}
    <Path
      colors={colors}
      id={id}
      isActive={isHovered}
      points={pointsString}
      onHover={onHover}
      onSelect={onSelect}
    />
    <Points
      isActive={isActive}
      fill={colors[0]}
      points={points}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
    <Tooltips
      isActive={isActive}
      activePoint={activePoint}
      points={points}
      width={width}
    />
  </Fragment>
))

Graph.displayName = 'Graph'
