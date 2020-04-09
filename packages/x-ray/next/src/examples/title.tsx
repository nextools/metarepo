import React from 'react'
import { map, range } from 'iterama'
import { TExample } from '../types'

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <h1>{i}</h1>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))(range(10))
