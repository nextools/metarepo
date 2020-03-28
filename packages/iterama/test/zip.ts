import test from 'tape'
import { zip } from '../src/zip'

test('iterama zip: works with arrays', (t) => {
  const data0 = [1, 2, 3]
  const data1 = ['1', '2', '3']
  const result = [...zip(data0, data1)]

  t.deepEquals(result, [[1, '1'], [2, '2'], [3, '3']])

  t.end()
})

test('iterama zip: works with different length arrays', (t) => {
  const data0 = [1, 2, 3, 4, 5]
  const data1 = ['1', '2']
  const result = [...zip(data0, data1)]

  t.deepEquals(result, [[1, '1'], [2, '2']])

  t.end()
})

test('iterama zip: works with different length arrays', (t) => {
  const data0 = [1, 2, 3, 4, 5]
  const data1 = ['1', '2']
  const data2 = [true]
  const result = [...zip(data0, data1, data2)]

  t.deepEquals(result, [[1, '1', true]])

  t.end()
})
