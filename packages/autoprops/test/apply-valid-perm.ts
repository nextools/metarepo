import test from 'tape'
import { applyValidPerm, TCommonComponentConfig } from '../src'

test('applyValidPerm: required', (t) => {
  const childMeta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      c: childMeta,
      d: childMeta,
    },
    required: ['a', 'c'],
  }
  const values = ['0', '2']
  const expected = ['0', '2']

  t.deepEquals(
    values.map((v) => applyValidPerm(config, v)),
    expected,
    'should properly modify values'
  )

  t.end()
})

test('applyValidPerm: no required', (t) => {
  const childMeta = {
    config: { props: {} },
    Component: () => null,
  }
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      c: childMeta,
      d: childMeta,
    },
  }
  const values = ['0', '2']
  const expected = ['0', '2']

  t.deepEquals(
    values.map((v) => applyValidPerm(config, v)),
    expected,
    'should properly modify values'
  )

  t.end()
})
