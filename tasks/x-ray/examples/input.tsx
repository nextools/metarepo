import React from 'react'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <input defaultValue={i}/>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))(range(10))

export const name = 'input'