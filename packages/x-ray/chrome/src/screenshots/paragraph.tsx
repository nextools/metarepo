import React from 'react'
import { TExample } from '../types'
import { mapIterable, makeNumIterable } from '../iterable'

export const examples = mapIterable<number, TExample>(makeNumIterable(100), (i) => ({
  id: String(i),
  element: <p>{i}</p>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))
