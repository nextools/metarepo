import test from 'tape'
import { pipe } from '@psxcode/compose'
import { take } from '../src/take'
import { map } from '../src/map'
import { range } from '../src/range'

const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)

test('iterama range: works with arrays', (t) => {
  const result = [...range(5)]

  t.deepEquals(result, [0, 1, 2, 3, 4])

  t.end()
})

test('iterama range: works chained', (t) => {
  const result = [...pipe(map(mult2), take(-1))(range(6))]

  t.deepEquals(result, [10])

  t.end()
})
