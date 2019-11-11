import test from 'blue-tape'
import { TComponentConfig } from '../src/types'
import { applyPropValue } from '../src'

test('applyPropValue: boolean case', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [false, true],
      b: [false, true],
    },
    required: ['b'],
  }

  t.equals(
    applyPropValue(config, '0', ['a'], true),
    '2',
    'undefined to true'
  )

  t.equals(
    applyPropValue(config, '2', ['a'], false),
    '1',
    'true to false'
  )

  t.equals(
    applyPropValue(config, '1', ['a'], undefined),
    '0',
    'false to undefined'
  )

  t.equals(
    applyPropValue(config, '0', ['b'], true),
    '3',
    'required false to true'
  )

  t.equals(
    applyPropValue(config, '4', ['b'], false),
    '1',
    'required true to false'
  )

  t.equals(
    applyPropValue(config, '4', ['b'], undefined),
    '1',
    'required true to undefined'
  )

  t.equals(
    applyPropValue(config, '4', ['b'], 'incorrect'),
    '1',
    'incorrect value'
  )

  t.end()
})

test('applyPropValue: non primitive values', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [() => {}, [1, 2], { a: 1 }],
    },
  }

  t.equals(
    applyPropValue(config, '0', ['a'], config.props.a[0]),
    '1',
    'should find function'
  )

  t.equals(
    applyPropValue(config, '0', ['a'], config.props.a[1]),
    '2',
    'should find array'
  )

  t.equals(
    applyPropValue(config, '0', ['a'], config.props.a[2]),
    '3',
    'should find object'
  )

  t.end()
})

test('applyPropValue: prop mutex', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    mutex: [
      ['a', 'b'],
      ['a', 'c'],
    ],
  }

  t.equals(
    applyPropValue(config, '1', ['c'], true),
    '4',
    'disable prop by mutex'
  )

  t.end()
})

test('applyPropValue: prop mutin', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    mutin: [
      ['a', 'b'],
      ['b', 'c'],
    ],
  }

  t.equals(
    applyPropValue(config, '0', ['c'], true),
    '7',
    'enable props by mutin'
  )

  t.equals(
    applyPropValue(config, '7', ['c'], false),
    '0',
    'disable props by mutin'
  )

  t.end()
})

test('applyPropValue: boolean inside child', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      child: {
        config: {
          props: {
            a: [true],
          },
        },
        Component: () => null,
      },
    },
  }

  t.equals(
    applyPropValue(config, '2', ['child', 'a'], true),
    '4',
    'child undefined to true'
  )

  t.equals(
    applyPropValue(config, '5', ['child', 'a'], false),
    '3',
    'true to false'
  )

  t.equals(
    applyPropValue(config, '5', ['child', 'a'], undefined),
    '3',
    'false to undefined'
  )

  t.end()
})

test('applyPropPath: enable disable child', (t) => {
  const config: TComponentConfig = {
    props: {},
    children: {
      child: {
        config: { props: {} },
        Component: () => null,
      },
    },
  }

  t.equals(
    applyPropValue(config, '0', ['child'], {}),
    '1',
    'should enable child'
  )

  t.equals(
    applyPropValue(config, '1', ['child'], undefined),
    '0',
    'should disable child'
  )

  t.end()
})

test('applyPropPath: child mutins', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      b: { config: { props: {} }, Component: () => null },
      c: { config: { props: {} }, Component: () => null },
    },
    mutin: [
      ['a', 'b'],
      ['a', 'c'],
    ],
  }

  t.equals(
    applyPropValue(config, '0', ['c'], true),
    '7',
    'enable child by mutin'
  )

  t.equals(
    applyPropValue(config, '7', ['c'], undefined),
    '0',
    'disable child by mutin'
  )

  t.end()
})

test('applyPropPath: child mutexes', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      b: { config: { props: {} }, Component: () => null },
      c: { config: { props: {} }, Component: () => null },
    },
    mutex: [
      ['a', 'b'],
      ['a', 'c'],
    ],
  }

  t.equals(
    applyPropValue(config, '1', ['c'], {}),
    '4',
    'should disable child by mutex'
  )

  t.end()
})

test('applyPropPath: change required child prop', (t) => {
  const config: TComponentConfig = {
    props: {},
    children: {
      child: {
        config: {
          props: {
            a: [true],
          },
        },
        Component: () => null,
      },
    },
    required: ['child'],
  }

  t.equals(
    applyPropValue(config, '0', ['child', 'a'], true),
    '1',
    'should enable prop in child'
  )

  t.equals(
    applyPropValue(config, '1', ['child', 'a'], undefined),
    '0',
    'should enable prop in child'
  )

  t.end()
})

test('applyPropPath: errors', (t) => {
  const config: TComponentConfig = {
    props: {
      a: [true],
    },
    children: {
      child: {
        config: {
          props: {
            a: [true],
          },
        },
        Component: () => null,
      },
    },
  }

  t.throws(
    () => applyPropValue(config, '0', ['child', 'a'], true),
    /was not enabled/,
    'should throw if previous state is not compatible with path'
  )

  t.throws(
    () => applyPropValue(config, '0', ['b'], true),
    /incorrect path/,
    'should throw if path is incorrect'
  )

  t.throws(
    () => applyPropValue(config, '2', ['child', 'a', 'a'], true),
    /incorrect path/,
    'should throw if children not exist'
  )

  t.end()
})
