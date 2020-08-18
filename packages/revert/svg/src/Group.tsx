import React from 'react'
import type { FC, SVGProps } from 'react'

export type TGroup = {
  x?: number,
  y?: number,
  scale?: number,
} & SVGProps<SVGGElement>

export const Group: FC<TGroup> = ({ x = 0, y = 0, scale = 1, ...props }) => (
  <g {...props} transform={`translate(${x}, ${y}) scale(${scale})`}/>
)

Group.displayName = 'Group'
