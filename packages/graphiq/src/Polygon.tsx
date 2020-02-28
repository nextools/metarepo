import React, { Fragment, FC } from 'react'
import { colorToString } from 'colorido'
import { easeInOutCubic } from '@primitives/animation'
import { Animate } from './Animate'
import { TGraphPolygon } from './types'

export const Polygon: FC<TGraphPolygon> = ({
  colors,
  id,
  isActive,
  points,
}) => (
  <Animate
    easing={easeInOutCubic}
    time={300}
    from={0}
    to={0.15}
    isActive={isActive}
  >
    {([opacity]) => (
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
