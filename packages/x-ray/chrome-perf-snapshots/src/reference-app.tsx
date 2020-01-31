import React from 'react'

const APP_DUPILCATE_COUNT = 50000

export const App = () => new Array(APP_DUPILCATE_COUNT).fill(
  <button style={{ backgroundColor: 'red' }}>test</button>
)
