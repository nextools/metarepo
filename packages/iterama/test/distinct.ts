import test from 'tape'
import { pipe } from '@psxcode/compose'
import { map } from '../src/map'
import { distinct } from '../src/distinct'

const multBy = (x: number) => (val: number) => val * x
const mult2 = multBy(2)

test('iterama distinct: works with arrays', (t) => {
  const data = [1, 1, 3, 3, 4, 3]
  const result = [...distinct(data)]

  t.deepEquals(result, [1, 3, 4, 3])

  t.end()
})

test('iterama distinct: works chained', (t) => {
  const data = [1, 1, 3, 3, 4, 3]
  const result = [...pipe(map(mult2), distinct)(data)]

  t.deepEquals(result, [2, 6, 8, 6])

  t.end()
})

