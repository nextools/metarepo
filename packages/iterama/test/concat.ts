import test from 'tape'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { concat } from '../src/concat'

const multBy = (x: number) => (y: number) => y * x
const mult2 = multBy(2)

test('iterama concat: works with arrays', (t) => {
  const data0 = [1, 2, 3, 4, 5]
  const data1 = [6, 7, 8, 9]
  const result = [...concat(data0, data1)]

  t.deepEquals(
    result,
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
  )

  t.end()
})

test('iterama concat: works chained', (t) => {
  const data0 = [1, 2, 3, 4, 5]
  const data1 = [6, 7, 8, 9]
  const result = [...pipe(concat.bind(null, data0), map(mult2))(data1)]

  t.deepEquals(
    result,
    [2, 4, 6, 8, 10, 12, 14, 16, 18]
  )

  t.end()
})
