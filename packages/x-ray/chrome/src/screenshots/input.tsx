import React from 'react'
import { TExample } from '../types'

export const examples: TExample[] = new Array(1000).fill(null).map((_, i) => {
  return () => ({
    id: String(i),
    element: <input defaultValue={i}/>,
    meta: [i],
  })
})
