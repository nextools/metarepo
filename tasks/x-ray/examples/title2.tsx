import React from 'react'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <h2>{i}</h2>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))(range(1000))

export const name = 'title2'
