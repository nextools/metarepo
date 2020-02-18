import React from 'react'
import { Button } from '../src'

const APP_DUPILCATE_COUNT = 50000

export const App = () => new Array(APP_DUPILCATE_COUNT).fill(
  <Button>test</Button>
)
