import I from 'big-integer'
import { Fragment } from 'react'
import test from 'tape'
import { serializeProps } from '../src/serialize-props'
import type { TCommonComponentConfig } from '../src/types'

test('serializeProps: props', (t) => {
  const Comp = () => null

  Comp.displayName = 'Comp'

  const Comp2 = () => null

  const config: TCommonComponentConfig = {
    props: {
      isOk: [true],
      str: ['value'],
      num: [2],
      obj: [{}],
      arr: [[]],
      onUnnamed: [() => {}],
      onNamed: [function namedFn() {}],
      symbolNoName: [Symbol()],
      symbolName: [Symbol('namedSymbol')],
      regex: [/reg/],
      element: [<span key="0"/>],
      elementComp: [<Comp key="0"/>],
      elementComp2: [<Comp2 key="0"/>],
    },
    required: ['isOk', 'str', 'num', 'obj', 'arr', 'onUnnamed', 'onNamed', 'symbolNoName', 'symbolName', 'regex', 'element', 'elementComp', 'elementComp2'],
  }
  const index = I(0)

  t.deepEquals(
    serializeProps(config, index),
    '{"arr":"[array(0)]","element":"[react(span) (0)]","elementComp":"[react(Comp) (0)]","elementComp2":"[react(Comp2) (0)]","num":"2","obj":"[object(0)]","regex":"[regexp(/reg/) (0)]","str":"value","symbolName":"[Symbol(namedSymbol) (0)]","symbolNoName":"[Symbol() (0)]","isOk":"true","onNamed":"[function(namedFn) (0)]","onUnnamed":"[function(0)]"}',
    'should serialize props'
  )

  t.end()
})

test('serializeProps: children Fragment', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      isOk: [true],
      str: ['value'],
      num: [2],
      children: [
        <Fragment key="0">
          <span/>
        </Fragment>,
      ],
    },
    required: ['isOk', 'str', 'children'],
  }
  const index = I(0)

  t.deepEquals(
    serializeProps(config, index),
    '{"str":"value","children":"[react(Fragment) (0)]","isOk":"true"}',
    'should serialize props'
  )

  t.end()
})

test('serializeProps: children Element', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      isOk: [true],
      str: ['value'],
      num: [2],
      children: [
        <span key="0"/>,
      ],
    },
    required: ['isOk', 'str', 'children'],
  }
  const index = I(0)

  t.deepEquals(
    serializeProps(config, index),
    '{"str":"value","children":"[react(span) (0)]","isOk":"true"}',
    'should serialize props'
  )

  t.end()
})

test('serializeProps: children in array', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      isOk: [true],
      str: ['value'],
      num: [2],
      children: [
        [
          null,
          'text',
          <span key="0"/>,
          <span key="1"/>,
        ],
      ],
    },
    required: ['isOk', 'str', 'children'],
  }
  const index = I(0)

  t.deepEquals(
    serializeProps(config, index),
    '{"str":"value","children":"[array(0)]","isOk":"true"}',
    'should serialize props'
  )

  t.end()
})

test('serializeProps: childrenMap', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      isOk: [true],
      str: ['value'],
      num: [2],
    },
    children: {
      child2: {
        config: {
          props: {},
        },
        Component: () => null,
      },
      child: {
        config: {
          props: {
            isOk: [true],
            str: ['value'],
            num: [2],
          },
          required: ['isOk', 'str'],
        },
        Component: () => null,
      },
    },
    required: ['isOk', 'str', 'child'],
  }
  const index = I(0)

  t.deepEquals(
    serializeProps(config, index),
    '{"str":"value","isOk":"true","children":{"child":{"str":"value","isOk":"true"}}}',
    'should serialize props'
  )

  t.end()
})

test('serializeProps: childrenMap child not required case', (t) => {
  const config: TCommonComponentConfig = {
    props: {},
    children: {
      child2: {
        config: {
          props: {},
        },
        Component: () => null,
      },
      child: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
  }
  const index = I(1)

  t.deepEquals(
    serializeProps(config, index),
    '{"children":{"child2":{}}}',
    'should serialize props'
  )

  t.end()
})

test('serializeProps: childrenMap no children', (t) => {
  const config: TCommonComponentConfig = {
    props: {
      isOk: [true],
      str: ['value'],
      num: [2],
    },
    children: {
      child2: {
        config: {
          props: {},
        },
        Component: () => null,
      },
      child: {
        config: {
          props: {},
        },
        Component: () => null,
      },
    },
    required: ['isOk', 'str'],
  }
  const index = I(0)

  t.deepEquals(
    serializeProps(config, index),
    '{"str":"value","isOk":"true"}',
    'should serialize props'
  )

  t.end()
})
