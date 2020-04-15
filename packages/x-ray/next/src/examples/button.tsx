import React from 'react'
import { map, range } from 'iterama'
import { TExample } from '../types'

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <button>{i}</button>,
  options: {
    hasOwnWidth: true,
  },
  meta: [i],
}))(range(10))

export const name = 'button'
// export const examples = mapIterable<number, TExample>(makeNumIterable(10), (i) => ({
//   id: String(i),
//   element: <button>{i}</button>,
//   options: {
//     hasOwnWidth: true,
//   },
//   meta: [i],
// }))

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
