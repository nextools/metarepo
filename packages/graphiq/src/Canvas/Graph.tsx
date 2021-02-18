import { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapWithPropsMemo, mapState, mapHandlers } from 'refun'
import { GRAPH_OFFSET } from '../constants'
import type { TEntry, TGraphColors } from '../types'
import { Path } from './Path'
import { Points } from './Points'
import { Polygon } from './Polygon'
import { Tooltips } from './Tooltips'
import type { TGraphPoint } from './types'
import { getPastMonthsDate, pointsToString } from './utils'

export type TGraph = {
  colors: TGraphColors,
  entries: TEntry[],
  height: number,
  id: string,
  isSelected: boolean,
  isHovered: boolean,
  selectedMonths: number,
  scale: number,
  width: number,
  onHover: (key: string | null) => void,
  onSelect: (key: string) => void,
}

export const Graph = component(
  startWithType<TGraph>(),
  mapWithPropsMemo(({ entries, selectedMonths }) => {
    const monthsAgoDate = getPastMonthsDate(selectedMonths)

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
  }, ['entries', 'selectedMonths']),
  mapWithProps(({ width, height, scale, maxValue, minValue, values }) => ({
    stepX: (width - GRAPH_OFFSET * 2) / (values.length === 1 ? 1 : values.length - 1),
    stepY: (height - GRAPH_OFFSET * 2) * scale / 100 / Math.abs(maxValue - minValue === 0 ? 1 : maxValue - minValue),
  })),
  mapWithProps(({ height, stepY, maxValue, minValue }) => ({
    halfHeight: (height - GRAPH_OFFSET * 2) / 2,
    halfPathHeight: (maxValue - minValue) * stepY / 2,
  })),
  mapWithPropsMemo(({ width, height, entries, minValue, halfHeight, halfPathHeight, stepX, stepY }) => {
    const points = entries.map(({ value, version }, index): TGraphPoint => {
      const x = stepX * index + GRAPH_OFFSET
      const y = height - (value * stepY + halfHeight - halfPathHeight - minValue * stepY) - GRAPH_OFFSET

      return {
        x,
        y,
        value,
        version,
      }
    })

    const pointsString = pointsToString(points)

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
  isSelected,
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
        isActive={isSelected}
        points={polygonPointsString}
      />

    )}
    <Path
      colors={colors}
      id={id}
      isActive={isHovered || isSelected}
      points={pointsString}
      onHover={onHover}
      onSelect={onSelect}
    />
    <Points
      isActive={isSelected}
      fill={colors[0]}
      points={points}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
    <Tooltips
      isActive={isSelected}
      activePoint={activePoint}
      points={points}
      width={width}
    />
  </Fragment>
))

Graph.displayName = 'Graph'
