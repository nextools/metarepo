import { easeInOutCubic } from '@revert/animation'
import { colorToString } from '@revert/color'
import React, { Fragment } from 'react'
import type { FC } from 'react'
import { Animate } from './Animate'
import { POINT_BORDER, POINT_RADIUS } from './constants'
import type { TGraphPoints } from './types'

export const Points: FC<TGraphPoints> = ({
  fill,
  isActive,
  points,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Animate
    easing={easeInOutCubic}
    time={300}
    from={0}
    to={POINT_RADIUS}
    isActive={isActive}
  >
    {(radius) => (
      <Fragment>
        {points.map((point, index) => {
          const tooltipKeyID = `${point.value}-tooltip-${index}`

          return (
            <circle
              cursor="pointer"
              cx={point.x}
              cy={point.y}
              fill={colorToString(fill)}
              key={`${point.value}-${index}`}
              r={radius}
              stroke="white"
              strokeWidth={POINT_BORDER}
              onPointerEnter={() => {
                onPointerEnter(tooltipKeyID)
              }}
              onPointerLeave={() => {
                onPointerLeave()
              }}
            />
          )
        })}
      </Fragment>
    )}
  </Animate>
)

Points.displayName = 'Points'
