import React from 'react'
import { TExample } from '../types'
import { mapIterable, makeNumIterable } from '../iterable'

export const examples = mapIterable<number, TExample>(makeNumIterable(1000), (i) => ({
  id: String(i),
  element: <select><option>{i}</option></select>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))
