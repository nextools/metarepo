import { easeInOutCubic } from '@primitives/animation'
import { colorToString } from 'colorido'
import React, { Fragment } from 'react'
import type { FC } from 'react'
import { Animate } from './Animate'
import { PATH_WIDTH } from './constants'
import type { TGraphPath } from './types'

export const Path: FC<TGraphPath> = ({
  colors,
  isActive,
  id,
  points,
  onHover,
  onSelect,
}) => (
  <Animate
    easing={easeInOutCubic}
    time={300}
    from={0.15}
    to={1}
    isActive={isActive}
  >
    {([opacity]) => (
      <Fragment>
        <defs>
          <linearGradient
            id={`line-${id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={colorToString(colors[0])}/>
            <stop offset="1" stopColor={colorToString(colors[1])}/>
          </linearGradient>
        </defs>
        <path
          cursor="pointer"
          d={`M ${points}`}
          fill="none"
          opacity={opacity}
          stroke={`url(#line-${id})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={PATH_WIDTH}
          onClick={() => {
            onSelect(id)
          }}
          onPointerEnter={() => {
            onHover(id)
          }}
          onPointerLeave={() => {
            onHover(null)
          }}
        />
      </Fragment>
    )}
  </Animate>
)

Path.displayName = 'Path'
