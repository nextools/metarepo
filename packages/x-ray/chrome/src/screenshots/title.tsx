import React from 'react'
import { TExample } from '../types'

export const examples: TExample[] = new Array(1000).fill(null).map((_, i) => {
  return () => ({
    id: String(i),
    element: <h1>{i}</h1>,
    meta: [i],
  })
})
