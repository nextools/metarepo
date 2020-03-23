import React from 'react'
import { TExample } from '../types'
import { mapIterable, makeNumIterable } from '../iterable'

// export const examples: TExample[] = Array(10).fill(null).map((_, i) => {
//   return () => ({
//     id: String(i),
//     element: <button>{i}</button>,
//     meta: [i],
//   })
// })

export const examples = mapIterable<number, TExample>(makeNumIterable(10), (i) => ({
  id: String(i),
  element: <button>{i}-</button>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))

// export const examples = makeIterable<TExample>(
//   () => ({
//     id: '1',
//     element: <button>1</button>,
//     meta: [1],
//   }),
//   () => ({
//     id: '2',
//     element: <button>2</button>,
//     meta: [2],
//   }),
//   () => ({
//     id: '3',
//     element: <button>3</button>,
//     meta: [3],
//   })
// )
