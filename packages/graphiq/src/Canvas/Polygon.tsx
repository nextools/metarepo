import { colorToString } from '@revert/color'
import { Fragment } from 'react'
import type { FC } from 'react'
import { Animate } from '../Animate'
import type { TGraphColors } from '../types'

export type TGraphPolygon = {
  colors: TGraphColors,
  id: string,
  isActive: boolean,
  points: string,
}

export const Polygon: FC<TGraphPolygon> = ({
  colors,
  id,
  isActive,
  points,
}) => (
  <Animate
    fromValue={0}
    toValue={0.15}
    isEnabled={isActive}
  >
    {(opacity) => (
      <Fragment>
        <defs>
          <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorToString(colors[1])}/>
            <stop offset="100%" stopColor="#1e2730"/>
          </linearGradient>
        </defs>
        <polygon
          style={{ pointerEvents: 'none' }}
          opacity={opacity}
          points={points}
          stroke="none"
          fill={`url(#gradient-${id})`}
        />
      </Fragment>
    )}
  </Animate>
)

Polygon.displayName = 'Polygon'
