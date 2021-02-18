import { colorToString } from '@revert/color'
import type { TColor } from '@revert/color'
import { Fragment } from 'react'
import type { FC } from 'react'
import { Animate } from '../Animate'
import { POINT_BORDER, POINT_RADIUS } from '../constants'
import type { TGraphPoint } from './types'

export type TGraphPoints = {
  isActive: boolean,
  fill: TColor,
  points: TGraphPoint[],
  onPointerEnter: (id: string) => void,
  onPointerLeave: () => void,
}

export const Points: FC<TGraphPoints> = ({
  fill,
  isActive,
  points,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Animate
    fromValue={0}
    toValue={POINT_RADIUS}
    isEnabled={isActive}
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
              key={index}
              r={radius}
              stroke="white"
              strokeWidth={POINT_BORDER}
              onPointerEnter={() => {
                onPointerEnter(tooltipKeyID)
              }}
              onPointerLeave={onPointerLeave}
            />
          )
        })}
      </Fragment>
    )}
  </Animate>
)

Points.displayName = 'Points'
