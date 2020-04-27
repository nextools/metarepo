import React, { FC } from 'react'
import { map, range } from 'iterama'
import { Svg as NativeSvg, Ellipse } from 'react-native-svg'
import { TExample } from '@x-ray/core'
import { serializeComponent } from 'syntx'

const Svg: FC<{ i: number }> = ({ i }) => (
  <NativeSvg height="100" width="110">
    <Ellipse
      cx="55"
      cy="55"
      rx="50"
      ry="30"
      stroke="purple"
      strokeWidth={i}
      fill="yellow"
    />
  </NativeSvg>
)

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <Svg i={i}/>,
  options: {
    hasOwnWidth: true,
  },
  meta: () => serializeComponent(Svg, { i }, { indent: 2 }).map((line) => line.elements),
}))(range(10))

export const name = 'Svg'
