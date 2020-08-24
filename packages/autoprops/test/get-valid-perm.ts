import I from 'big-integer'
import test from 'tape'
import { getValidPermImpl } from '../src/get-valid-perm'
import type { TCommonComponentConfig } from '../src/types'

test('getValidPerm: simple case', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
  }

  const ints = [I(0), I(1), I(2), I(3), I(4)]
  const expected = [I(0), I(1), I(2), I(3), null]

  t.deepEquals(
    ints.map((int) => getValidPermImpl(config, int)),
    expected,
    'should validate perm'
  )

  t.end()
})

test('getValidPerm: props mutex', (t) => {
  const config: TCommonComponentConfig = {
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

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), I(8)]
  const expected = [I(0), I(1), I(2), I(4), I(4), I(6), I(6), null, null]

  t.deepEquals(
    decimals.map((int) => getValidPermImpl(config, int)),
    expected,
    'should validate perm'
  )

  t.end()
})

test('getValidPerm: props mutex with required', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    required: ['b'],
    mutex: [
      ['a', 'b'],
      ['a', 'c'],
    ],
  }

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), I(8)]
  const expected = [I(0), I(1), I(2), null, null, null, null, null, null]

  t.deepEquals(
    decimals.map((int) => getValidPermImpl(config, int)),
    expected,
    'should validate perm'
  )

  t.end()
})

test('getValidPerm: props invalid mutex group', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    required: ['a', 'b'],
    mutex: [
      ['a', 'b'],
      ['a', 'c'],
    ],
  }

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), I(8)]
  const expected = [I(0), I(1), null, null, null, null, null, null, null]

  t.deepEquals(
    decimals.map((int) => getValidPermImpl(config, int)),
    expected,
    'should validate perm'
  )

  t.end()
})

test('getValidPerm: props deps', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
      c: [true],
    },
    deps: {
      a: ['c'],
    },
  }

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), I(8)]
  const expected = [I(0), I(2), I(2), I(4), I(4), I(5), I(6), I(7), null]

  t.deepEquals(
    decimals.map((int) => getValidPermImpl(config, int)),
    expected,
    'should return next perm'
  )

  t.end()
})

test('getValidPerm: children', (t) => {
  const config: TCommonComponentConfig = {
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
      child2: {
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

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6)]
  const expected = [I(0), I(1), I(2), I(3), I(4), I(5), null]

  t.deepEquals(
    decimals.map((int) => getValidPermImpl(config, int)),
    expected,
    'should return next perm'
  )

  t.end()
})

test('getValidPerm: props mutex children', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    mutex: [
      ['a', 'b'],
      ['a', 'child'],
    ],
    children: {
      child: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
  }

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), I(8)]
  const expected = [I(0), I(1), I(2), I(4), I(4), I(6), I(6), null, null]

  t.deepEquals(
    decimals.map((int) => getValidPermImpl(config, int)),
    expected,
    'should return next perm'
  )

  t.end()
})

test('getValidPerm: required "children"', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      child: {
        config: {
          props: {},
        },
        Component: () => null,
      },
      child2: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
    required: ['children'],
  }

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), I(8), I(9), I(10), I(11), I(12), I(13), I(14), I(15), I(16)]
  const expected = [I(4), I(4), I(4), I(4), I(4), I(5), I(6), I(7), I(8), I(9), I(10), I(11), I(12), I(13), I(14), I(15), null]

  t.deepEquals(
    decimals.map((int) => getValidPermImpl(config, int)),
    expected,
    'should return next perm'
  )

  t.end()
})

test('getValidPerm: required "children" and one child', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
    },
    children: {
      child: {
        config: {
          props: {},
        },
        Component: () => null,
      },
      child2: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
    required: ['children', 'child2'],
  }

  const decimals = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), I(8)]
  const expected = [I(0), I(1), I(2), I(3), I(4), I(5), I(6), I(7), null]

  t.deepEquals(
    decimals.map((int) => getValidPermImpl(config, int)),
    expected,
    'should return next perm'
  )

  t.end()
})

test('getValidPerm: required "children", no children', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      a: [true],
      b: [true],
      children: ['a'],
    },
    required: ['children'],
  }

  const decimals = [I(0), I(1), I(2), I(3), I(4)]
  const expected = [I(0), I(1), I(2), I(3), null]

  t.deepEquals(
    decimals.map((int) => getValidPermImpl(config, int)),
    expected,
    'should return next perm'
  )

  t.end()
})
