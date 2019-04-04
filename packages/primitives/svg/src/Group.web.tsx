import React, { FC, SVGProps } from 'react'

export type TGroupProps = {
  x?: number,
  y?: number,
  scale?: number
} & SVGProps<SVGGElement>

export const Group: FC<TGroupProps> = ({ x = 0, y = 0, scale = 1, ...props }) => (
  <g {...props} transform={`translate(${x}, ${y}) scale(${scale})`}/>
)
