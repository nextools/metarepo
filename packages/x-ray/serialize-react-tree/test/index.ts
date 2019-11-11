import test from 'tape'
import { createElement } from 'react'
import serialize from '../src/index'

test('serialize-react-tree', (t) => {
  t.deepEquals(
    serialize(
      createElement('div')
    ),
    '<div/>',
    'single element'
  )

  t.deepEquals(
    serialize(
      createElement('div', {
        a: 'string',
        b: 123,
        c: true,
        d: false,
        e: null,
        f: undefined,
        g: (a: any) => a + 1,
        h: {
          a: {},
          b: ['string', 123, true, false, null, undefined, () => {
          }, [], {}],
          c: 'string',
          d: 123,
          e: true,
          f: null,
          g: undefined,
          s: Symbol(),
          sn: Symbol('named'),
        },
        i: [
          {
            a: [],
            b: (a: any) => a + 1,
          },
          'string',
          123,
          Symbol(),
          Symbol('named'),
        ],
        s: Symbol(),
        sn: Symbol('named'),
      })
    ),
    `<div
  a="string"
  b={123}
  c={true}
  d={false}
  e={null}
  g={() => {}}
  h={{
    a: {},
    b: [
      'string',
      123,
      true,
      false,
      null,
      null,
      () => {},
      [],
      {}
    ],
    c: 'string',
    d: 123,
    e: true,
    f: null,
    s: 'Symbol()',
    sn: 'Symbol(named)'
  }}
  i={[
    {
      a: [],
      b: () => {}
    },
    'string',
    123,
    'Symbol()',
    'Symbol(named)'
  ]}
  s="Symbol()"
  sn="Symbol(named)"
/>`,
    'props combinations'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {},
        createElement('span')
      )
    ),
    `<div>
  <span/>
</div>`,
    'children arg single'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {},
        createElement(
          'div',
          {},
          createElement('span')
        )
      )
    ),
    `<div>
  <div>
    <span/>
  </div>
</div>`,
    'children arg tree'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {},
        [
          createElement(
            'div',
            { key: '1' },
            createElement('span')
          ),
          createElement(
            'div',
            { key: '2' },
            createElement('span')
          ),
        ]
      )
    ),
    `<div>
  <div>
    <span/>
  </div>
  <div>
    <span/>
  </div>
</div>`,
    'children arg array'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {},
        createElement(
          'div',
          {},
          createElement('span')
        ),
        createElement(
          'div',
          {},
          createElement('span')
        )
      )
    ),
    `<div>
  <div>
    <span/>
  </div>
  <div>
    <span/>
  </div>
</div>`,
    'children arg 3rd 4th'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {},
        createElement(
          'div',
          {
            a: {
              title: createElement('span'),
              items: [
                createElement('span'),
              ],
            },
          },
          'string',
          123
        ),
        createElement(
          'div',
          {},
          createElement('span'),
          true,
          false
        ),
        createElement(
          'div',
          {},
          null,
          undefined
        )
      )
    ),
    `<div>
  <div
    a={{
      title: (
        <span/>
      ),
      items: [
        (
          <span/>
        )
      ]
    }}
  >
    string
    123
  </div>
  <div>
    <span/>
  </div>
  <div/>
</div>`,
    'children arg mixed types'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {
          a: createElement(
            'div',
            {},
            createElement('span')
          ),
        }
      )
    ),
    `<div
  a={
    <div>
      <span/>
    </div>
  }
/>`,
    'children named prop'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {
          a: [
            createElement(
              'div',
              { key: '1' },
              createElement('span')
            ),
            createElement(
              'div',
              { key: '2' },
              createElement('span')
            ),
          ],
        }
      )
    ),
    `<div
  a={[
    (
      <div>
        <span/>
      </div>
    ),
    (
      <div>
        <span/>
      </div>
    )
  ]}
/>`,
    'children named prop array'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {
          a: [
            createElement(
              'div',
              { key: '1' },
              createElement('span')
            ),
            'string',
            123,
            true,
            false,
            null,
            undefined,
          ],
        }
      )
    ),
    `<div
  a={[
    (
      <div>
        <span/>
      </div>
    ),
    'string',
    123,
    true,
    false,
    null,
    null
  ]}
/>`,
    'children named prop array with mixed types'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {
          children: createElement(
            'div',
            {},
            createElement('span')
          ),
        }
      )
    ),
    `<div>
  <div>
    <span/>
  </div>
</div>`,
    '\'children\' named prop'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {
          children: [
            createElement(
              'div',
              { key: '1' },
              createElement('span')
            ),
            createElement(
              'div',
              { key: '2' },
              createElement('span')
            ),
          ],
        }
      )
    ),
    `<div>
  <div>
    <span/>
  </div>
  <div>
    <span/>
  </div>
</div>`,
    '\'children\' prop array'
  )

  t.deepEquals(
    serialize(
      createElement(
        'div',
        {
          children: [
            createElement(
              'div',
              { key: '1' },
              createElement('span')
            ),
            'string',
            123,
            true,
            false,
            null,
            undefined,
          ],
        }
      )
    ),
    `<div>
  <div>
    <span/>
  </div>
  string
  123
</div>`,
    '\'children\' prop array with mixed types'
  )

  t.end()
})
