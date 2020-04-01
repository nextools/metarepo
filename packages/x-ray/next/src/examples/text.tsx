import React from 'react'
import { Text } from 'react-native'
import { TExample } from '../types'
import { mapIterable, makeNumIterable } from '../iterable'

export const examples = mapIterable<number, TExample>(makeNumIterable(1000), (i) => ({
  id: String(i),
  element: <Text>{i}</Text>,
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
