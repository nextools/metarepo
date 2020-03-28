import test from 'tape'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { unique } from '../src/unique'

const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)

test('iterama unique: works with arrays', (t) => {
  const data = [1, 1, 3, 4, 3]
  const result = [...unique(data)]

  t.deepEquals(result, [1, 3, 4])

  t.end()
})

test('iterama unique: works chained', (t) => {
  const data = [1, 1, 3, 4, 3]
  const result = [...pipe(map(mult2), unique)(data)]

  t.deepEquals(result, [2, 6, 8])

  t.end()
})
