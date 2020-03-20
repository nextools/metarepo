import React from 'react'
import { TExample } from '../types'

export const examples: TExample[] = new Array(10).fill(null).map((_, i) => {
  return () => ({
    id: String(i),
    element: <button>{i}</button>,
    meta: [i],
  })
})
