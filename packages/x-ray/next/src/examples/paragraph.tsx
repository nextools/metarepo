import React from 'react'
import { map, range } from 'iterama'
import { TExample } from '../types'

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <p>{i}</p>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))(range(1000))

export const name = 'paragraph'
