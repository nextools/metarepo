import test from 'tape'
import { startWith } from '../src/start-with'

test('iterama startWith: works with arrays', (t) => {
  const data = [1, 2, 3]
  const result = [...startWith(0)(data)]

  t.deepEquals(result, [0, 1, 2, 3])

  t.end()
})
