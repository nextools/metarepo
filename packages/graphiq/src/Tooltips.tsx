import React, { Fragment, FC } from 'react'
import { Tooltip } from './Tooltip'
import { GRAPH_OFFSET } from './constants'
import { TGraphTooltips } from './types'

export const Tooltips: FC<TGraphTooltips> = ({
  isActive,
  activePoint,
  points,
  width,
}) => (
  <Fragment>
    {points.map((point, index) => {
      const nextValue = index + 1 < points.length ? points[index + 1].value : 0
      const differenceWithPrePoint = Number(nextValue ? ((point.value - nextValue) / nextValue * 100.0).toFixed(2) : 0)
      const keyID = `${point.value}-tooltip-${index}`

      return (
        <Tooltip
          isActive={isActive && (index === points.length - 1 || index === 0 || activePoint === keyID)}
          key={keyID}
          value={Math.round(point.value * 1000) / 1000}
          valueDifference={differenceWithPrePoint}
          version={point.version}
          viewportRight={width - GRAPH_OFFSET}
          viewportTop={GRAPH_OFFSET}
          x={point.x}
          y={point.y}
        />
      )
    })}
  </Fragment>
)

Tooltips.displayName = 'Tooltips'
