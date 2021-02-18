import { colorToString } from '@revert/color'
import { Fragment } from 'react'
import { pureComponent, startWithType, mapHandlers } from 'refun'
import { Animate } from '../Animate'
import { PATH_WIDTH } from '../constants'
import type { TGraphColors } from '../types'

export type TPath = {
  colors: TGraphColors,
  id: string,
  isActive: boolean,
  points: string,
  onHover: (key: string | null) => void,
  onSelect: (key: string) => void,
}

export const Path = pureComponent(
  startWithType<TPath>(),
  mapHandlers({
    onClick: ({ id, onSelect }) => () => {
      onSelect(id)
    },
    onPointerEnter: ({ id, onHover }) => () => {
      onHover(id)
    },
    onPointerLeave: ({ onHover }) => () => {
      onHover(null)
    },
  })
)(({
  colors,
  isActive,
  id,
  points,
  onClick,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Animate
    fromValue={0.15}
    toValue={1}
    isEnabled={isActive}
  >
    {(opacity) => (
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
          onClick={onClick}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
      </Fragment>
    )}
  </Animate>
))

Path.displayName = 'Path'
