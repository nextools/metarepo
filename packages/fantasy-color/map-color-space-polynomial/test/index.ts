import test from 'blue-tape'
import { mapColorSpace } from '../src'
import exampleCoefficientsMatrix from './exampleCoefficientsMatrix'

test('mapColorSpace: degree zero, replaces by coefficients', async (t) => {
  const result = mapColorSpace(
    [[1.5], [1.5], [1.5]],
    0
  )([60.16969588191749, 93.55002493980824, -60.498555897447304])

  await t.deepEqual(
    result,
    [1.5, 1.5, 1.5],
    'must return updated mapped color'
  )
})

test('mapColorSpace: exampleCoefficientsMatrix, 2nd degree', async (t) => {
  const result = mapColorSpace(
    exampleCoefficientsMatrix,
    2
  )([60.16969588191749, 93.55002493980824, -60.498555897447304])

  await t.deepEqual(
    result,
    [56.312232697106005, 88.206939784304, -56.340863699838685],
    'must return updated mapped color'
  )
})
