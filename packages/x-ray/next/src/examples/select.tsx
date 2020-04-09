import React from 'react'
import { map, range } from 'iterama'
import { TExample } from '../types'

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <select><option>{i}</option></select>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))(range(10))
