import React from 'react'
import { map, range } from 'iterama'
import { TExample } from '../types'

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <h3>{i}</h3>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))(range(1000))

export const name = 'title3'
