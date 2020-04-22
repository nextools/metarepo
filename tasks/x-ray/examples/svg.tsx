import React from 'react'
import { map, range } from 'iterama'
import { Svg, Ellipse } from 'react-native-svg'
import { TExample } from '@x-ray/core'

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: (
    <Svg height="100" width="110">
      <Ellipse
        cx="55"
        cy="55"
        rx="50"
        ry="30"
        stroke="purple"
        strokeWidth="2"
        fill="yellow"
      />
    </Svg>
  ),
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))(range(10))

export const name = 'Svg'
