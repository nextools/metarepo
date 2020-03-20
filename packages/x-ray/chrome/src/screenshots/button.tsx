import React from 'react'

export const examples = new Array(1000).fill(null).map((_, i) => {
  return () => ({
    id: String(i),
    element: <button>{i}</button>,
    meta: [i],
  })
})
