import React, { FC } from 'react'
import test from 'blue-tape'
import {
  serializeComponent,
  TYPE_COMPONENT_BRACKET,
  TYPE_COMPONENT_NAME,
  TYPE_WHITESPACE,
  TYPE_PROPS_KEY,
  TYPE_PROPS_EQUALS,
  TYPE_PROPS_BRACE,
  TYPE_VALUE_NUMBER,
  TYPE_VALUE_BOOLEAN,
  TYPE_VALUE_NULL,
  TYPE_QUOTE,
  TYPE_VALUE_STRING,
  TYPE_VALUE_SYMBOL,
  TYPE_OBJECT_BRACE,
  TYPE_OBJECT_KEY,
  TYPE_OBJECT_COLON,
  TYPE_OBJECT_COMMA,
  TYPE_ARRAY_BRACKET,
  TYPE_ARRAY_COMMA,
  TYPE_VALUE_FUNCTION,
} from '../src'

test('syntx: serializeComponent', (t) => {
  const Comp: FC<any> = () => null
  Comp.displayName = 'Comp'

  t.deepEquals(
    serializeComponent(Comp, {}, { indent: 2 }),
    [
      {
        elements: [
          {
            type: TYPE_COMPONENT_BRACKET,
            value: '<',
          },
          {
            type: TYPE_COMPONENT_NAME,
            value: 'Comp',
          },
          {
            type: TYPE_COMPONENT_BRACKET,
            value: '/>',
          },
        ],
      },
    ],
    'empty component'
  )

  t.deepEquals(
    serializeComponent(
      Comp,
      {
        success: 123,
        warning: true,
        error: null,
        access: undefined,
        title: 'Title',
        empty: '',
        symbDesc: Symbol('description'),
        symbNoDesc: Symbol(),
        config: {
          options: true,
          subConfig: {
            value: null,
          },
          emptyArray: [],
          ext: [123, true, { key: 'value' }, [{}]],
        },
        array: [123, true, { key: 'value' }, [{}]],
        onClick: () => {},
        icon: (
          <div>
            <span>
              <span>ICON</span>
            </span>
          </div>
        ),
      },
      {
        indent: 2,
      }
    ),
    [
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'success' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_NUMBER, value: '123' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'warning' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_BOOLEAN, value: 'true' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'error' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_NULL, value: 'null' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'title' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_QUOTE, value: '"' },
          { type: TYPE_VALUE_STRING, value: 'Title' },
          { type: TYPE_QUOTE, value: '"' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'empty' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_QUOTE, value: '""' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'symbDesc' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_SYMBOL, value: 'description' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'symbNoDesc' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_SYMBOL, value: 'symbol' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'config' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_OBJECT_BRACE, value: '{' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_OBJECT_KEY, value: 'options' },
          { type: TYPE_OBJECT_COLON, value: ':' },
          { type: TYPE_WHITESPACE, value: ' ' },
          { type: TYPE_VALUE_BOOLEAN, value: 'true' },
          { type: TYPE_OBJECT_COMMA, value: ',' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_OBJECT_KEY, value: 'subConfig' },
          { type: TYPE_OBJECT_COLON, value: ':' },
          { type: TYPE_WHITESPACE, value: ' ' },
          { type: TYPE_OBJECT_BRACE, value: '{' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_OBJECT_KEY, value: 'value' },
          { type: TYPE_OBJECT_COLON, value: ':' },
          { type: TYPE_WHITESPACE, value: ' ' },
          { type: TYPE_VALUE_NULL, value: 'null' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_OBJECT_BRACE, value: '}' },
          { type: TYPE_OBJECT_COMMA, value: ',' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_OBJECT_KEY, value: 'emptyArray' },
          { type: TYPE_OBJECT_COLON, value: ':' },
          { type: TYPE_WHITESPACE, value: ' ' },
          { type: TYPE_ARRAY_BRACKET, value: '[]' },
          { type: TYPE_OBJECT_COMMA, value: ',' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_OBJECT_KEY, value: 'ext' },
          { type: TYPE_OBJECT_COLON, value: ':' },
          { type: TYPE_WHITESPACE, value: ' ' },
          { type: TYPE_ARRAY_BRACKET, value: '[' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_VALUE_NUMBER, value: '123' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_VALUE_BOOLEAN, value: 'true' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_OBJECT_BRACE, value: '{' },
          { type: TYPE_ARRAY_COMMA, value: ',' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '        ' },
          { type: TYPE_OBJECT_KEY, value: 'key' },
          { type: TYPE_OBJECT_COLON, value: ':' },
          { type: TYPE_WHITESPACE, value: ' ' },
          { type: TYPE_QUOTE, value: '\'' },
          { type: TYPE_VALUE_STRING, value: 'value' },
          { type: TYPE_QUOTE, value: '\'' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_OBJECT_BRACE, value: '}' },
          { type: TYPE_ARRAY_COMMA, value: ',' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_ARRAY_BRACKET, value: '[' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '        ' },
          { type: TYPE_OBJECT_BRACE, value: '{}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_ARRAY_BRACKET, value: ']' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_ARRAY_BRACKET, value: ']' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_OBJECT_BRACE, value: '}' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'array' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_ARRAY_BRACKET, value: '[' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_VALUE_NUMBER, value: '123' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_VALUE_BOOLEAN, value: 'true' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_OBJECT_BRACE, value: '{' },
          { type: TYPE_ARRAY_COMMA, value: ',' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_OBJECT_KEY, value: 'key' },
          { type: TYPE_OBJECT_COLON, value: ':' },
          { type: TYPE_WHITESPACE, value: ' ' },
          { type: TYPE_QUOTE, value: '\'' },
          { type: TYPE_VALUE_STRING, value: 'value' },
          { type: TYPE_QUOTE, value: '\'' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_OBJECT_BRACE, value: '}' },
          { type: TYPE_ARRAY_COMMA, value: ',' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_ARRAY_BRACKET, value: '[' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_OBJECT_BRACE, value: '{}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_ARRAY_BRACKET, value: ']' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_ARRAY_BRACKET, value: ']' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'onClick' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_FUNCTION, value: '() => {}' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'icon' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'div' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '        ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '          ' },
          { type: TYPE_VALUE_STRING, value: 'ICON' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '        ' },
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'div' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '/>' },
        ],
      },
    ],
    'props only'
  )

  t.deepEquals(
    serializeComponent(
      Comp,
      {
        children: [
          'content1',
          'content2',
          (
            <div key="1">
              <span>
                {null}
                {false}
                {2}
                conc
                oacao<span/>asdasd
              </span>
            </div>
          ),
          'content3',
        ],
      },
      { indent: 2 }
    ),
    [
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_VALUE_STRING, value: 'content1' },
          { type: TYPE_VALUE_STRING, value: 'content2' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'div' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_VALUE_STRING, value: '2' },
          { type: TYPE_VALUE_STRING, value: 'conc oacao' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '/>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_VALUE_STRING, value: 'asdasd' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'div' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_VALUE_STRING, value: 'content3' },
        ],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
    ],
    'children only'
  )

  t.deepEquals(
    serializeComponent(
      Comp,
      {
        success: 123,
        children: (
          <div>
            <span>Content</span>
          </div>
        ),
      },
      {
        indent: 2,
      }
    ),
    [
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'success' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_NUMBER, value: '123' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'div' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_VALUE_STRING, value: 'Content' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'div' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
    ],
    'props and children'
  )

  const Comp2 = () => null

  t.deepEquals(
    serializeComponent(
      Comp2,
      {
        success: 123,
        children: [
          null,
          <Comp key="1"/>,
        ],
      },
      {
        indent: 2,
      }
    ),
    [
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp2' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'success' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_NUMBER, value: '123' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp' },
          { type: TYPE_COMPONENT_BRACKET, value: '/>' },
        ],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp2' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
    ],
    'edge cases'
  )

  t.end()
})

test('syntx: serializeComponent meta', (t) => {
  const Comp: FC<any> = () => null
  Comp.displayName = 'Comp'

  t.deepEquals(
    serializeComponent(
      Comp,
      {},
      {
        indent: 2,
        meta: {
          value: ['root'],
        },
      }
    ),
    [
      {
        meta: ['root'],
        elements: [
          {
            type: TYPE_COMPONENT_BRACKET,
            value: '<',
          },
          {
            type: TYPE_COMPONENT_NAME,
            value: 'Comp',
          },
          {
            type: TYPE_COMPONENT_BRACKET,
            value: '/>',
          },
        ],
      },
    ],
    'empty component'
  )

  t.deepEquals(
    serializeComponent(
      Comp,
      {
        success: 123,
        warning: true,
        error: null,
        access: undefined,
        title: 'Title',
        empty: '',
        symbDesc: Symbol('description'),
        symbNoDesc: Symbol(),
        config: {
          options: true,
          subConfig: {
            value: null,
          },
          emptyArray: [],
          ext: [123, true, { key: 'value' }, [{}]],
        },
        array: [123, true, { key: 'value' }, [{}]],
        onClick: () => {},
        icon: (
          <div>
            <span>
              <span>ICON</span>
            </span>
          </div>
        ),
      },
      {
        indent: 2,
        meta: {
          value: ['root'],
        },
      }
    ),
    [
      {
        elements: [
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'Comp' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'success' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'PROPS_BRACE', value: '{' },
          { type: 'VALUE_NUMBER', value: '123' },
          { type: 'PROPS_BRACE', value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'warning' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'PROPS_BRACE', value: '{' },
          { type: 'VALUE_BOOLEAN', value: 'true' },
          { type: 'PROPS_BRACE', value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'error' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'PROPS_BRACE', value: '{' },
          { type: 'VALUE_NULL', value: 'null' },
          { type: 'PROPS_BRACE', value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'title' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'QUOTE', value: '"' },
          { type: 'VALUE_STRING', value: 'Title' },
          { type: 'QUOTE', value: '"' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'empty' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'QUOTE', value: '""' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'symbDesc' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'PROPS_BRACE', value: '{' },
          { type: 'VALUE_SYMBOL', value: 'description' },
          { type: 'PROPS_BRACE', value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'symbNoDesc' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'PROPS_BRACE', value: '{' },
          { type: 'VALUE_SYMBOL', value: 'symbol' },
          { type: 'PROPS_BRACE', value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'config' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'PROPS_BRACE', value: '{' },
          { type: 'OBJECT_BRACE', value: '{' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'OBJECT_KEY', value: 'options' },
          { type: 'OBJECT_COLON', value: ':' },
          { type: 'WHITESPACE', value: ' ' },
          { type: 'VALUE_BOOLEAN', value: 'true' },
          { type: 'OBJECT_COMMA', value: ',' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'OBJECT_KEY', value: 'subConfig' },
          { type: 'OBJECT_COLON', value: ':' },
          { type: 'WHITESPACE', value: ' ' },
          { type: 'OBJECT_BRACE', value: '{' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'OBJECT_KEY', value: 'value' },
          { type: 'OBJECT_COLON', value: ':' },
          { type: 'WHITESPACE', value: ' ' },
          { type: 'VALUE_NULL', value: 'null' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'OBJECT_BRACE', value: '}' },
          { type: 'OBJECT_COMMA', value: ',' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'OBJECT_KEY', value: 'emptyArray' },
          { type: 'OBJECT_COLON', value: ':' },
          { type: 'WHITESPACE', value: ' ' },
          { type: 'ARRAY_BRACKET', value: '[]' },
          { type: 'OBJECT_COMMA', value: ',' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'OBJECT_KEY', value: 'ext' },
          { type: 'OBJECT_COLON', value: ':' },
          { type: 'WHITESPACE', value: ' ' },
          { type: 'ARRAY_BRACKET', value: '[' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'VALUE_NUMBER', value: '123' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'VALUE_BOOLEAN', value: 'true' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'OBJECT_BRACE', value: '{' },
          { type: 'ARRAY_COMMA', value: ',' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '        ' },
          { type: 'OBJECT_KEY', value: 'key' },
          { type: 'OBJECT_COLON', value: ':' },
          { type: 'WHITESPACE', value: ' ' },
          { type: 'QUOTE', value: '\'' },
          { type: 'VALUE_STRING', value: 'value' },
          { type: 'QUOTE', value: '\'' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'OBJECT_BRACE', value: '}' },
          { type: 'ARRAY_COMMA', value: ',' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'ARRAY_BRACKET', value: '[' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '        ' },
          { type: 'OBJECT_BRACE', value: '{}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'ARRAY_BRACKET', value: ']' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'ARRAY_BRACKET', value: ']' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'OBJECT_BRACE', value: '}' },
          { type: 'PROPS_BRACE', value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'array' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'PROPS_BRACE', value: '{' },
          { type: 'ARRAY_BRACKET', value: '[' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'VALUE_NUMBER', value: '123' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'VALUE_BOOLEAN', value: 'true' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'OBJECT_BRACE', value: '{' },
          { type: 'ARRAY_COMMA', value: ',' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'OBJECT_KEY', value: 'key' },
          { type: 'OBJECT_COLON', value: ':' },
          { type: 'WHITESPACE', value: ' ' },
          { type: 'QUOTE', value: '\'' },
          { type: 'VALUE_STRING', value: 'value' },
          { type: 'QUOTE', value: '\'' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'OBJECT_BRACE', value: '}' },
          { type: 'ARRAY_COMMA', value: ',' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'ARRAY_BRACKET', value: '[' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'OBJECT_BRACE', value: '{}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'ARRAY_BRACKET', value: ']' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'ARRAY_BRACKET', value: ']' },
          { type: 'PROPS_BRACE', value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'onClick' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'PROPS_BRACE', value: '{' },
          { type: 'VALUE_FUNCTION', value: '() => {}' },
          { type: 'PROPS_BRACE', value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_KEY', value: 'icon' },
          { type: 'PROPS_EQUALS', value: '=' },
          { type: 'PROPS_BRACE', value: '{' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'div' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'span' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '        ' },
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'span' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '          ' },
          { type: 'VALUE_STRING', value: 'ICON' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '        ' },
          { type: 'COMPONENT_BRACKET', value: '</' },
          { type: 'COMPONENT_NAME', value: 'span' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'COMPONENT_BRACKET', value: '</' },
          { type: 'COMPONENT_NAME', value: 'span' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'COMPONENT_BRACKET', value: '</' },
          { type: 'COMPONENT_NAME', value: 'div' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'PROPS_BRACE', value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'COMPONENT_BRACKET', value: '/>' },
        ],
        meta: ['root'],
      },
    ],
    'props only'
  )

  t.deepEquals(
    serializeComponent(
      Comp,
      {
        children: [
          'content1',
          'content2',
          (
            <div key="1">
              <span>
                {null}
                {false}
                {2}
                conc
                oacao<span/>asdasd
              </span>
            </div>
          ),
          'content3',
        ],
      },
      {
        indent: 2,
        meta: {
          value: ['root'],
          children: [
            { value: ['cont1'] },
            { value: ['cont2'] },
            {
              value: ['View'],
              children: [{
                value: ['span'],
                children: [
                  { value: ['null'] },
                  { value: ['null'] },
                  { value: ['number'] },
                  { value: ['text'] },
                  { value: ['span'] },
                ],
              }],
            },
          ],
        },
      }
    ),
    [
      {
        elements: [
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'Comp' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'VALUE_STRING', value: 'content1' },
          { type: 'VALUE_STRING', value: 'content2' },
        ],
        meta: ['cont2'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'div' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['View'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'span' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['span'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'VALUE_STRING', value: '2' },
          { type: 'VALUE_STRING', value: 'conc oacao' },
        ],
        meta: ['text'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'span' },
          { type: 'COMPONENT_BRACKET', value: '/>' },
        ],
        meta: ['span'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '      ' },
          { type: 'VALUE_STRING', value: 'asdasd' },
        ],
        meta: ['span'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'COMPONENT_BRACKET', value: '</' },
          { type: 'COMPONENT_NAME', value: 'span' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['span'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'COMPONENT_BRACKET', value: '</' },
          { type: 'COMPONENT_NAME', value: 'div' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['View'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'VALUE_STRING', value: 'content3' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'COMPONENT_BRACKET', value: '</' },
          { type: 'COMPONENT_NAME', value: 'Comp' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
    ],
    'children only'
  )

  t.deepEquals(
    serializeComponent(
      Comp,
      {
        success: 123,
        children: (
          <div>
            <span>Content</span>
          </div>
        ),
      },
      {
        indent: 2,
      }
    ),
    [
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'success' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_NUMBER, value: '123' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'div' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '      ' },
          { type: TYPE_VALUE_STRING, value: 'Content' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '    ' },
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'span' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'div' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
    ],
    'props and children'
  )

  const Comp2: FC<any> = () => null

  t.deepEquals(
    serializeComponent(
      Comp2,
      {
        success: 123,
        children: [
          null,
          <Comp key="1"/>,
        ],
      },
      {
        indent: 2,
        meta: {
          value: ['root'],
          children: [
            { value: ['null'] },
            { value: ['Comp'] },
          ],
        },
      }
    ),
    [
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp2' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_PROPS_KEY, value: 'success' },
          { type: TYPE_PROPS_EQUALS, value: '=' },
          { type: TYPE_PROPS_BRACE, value: '{' },
          { type: TYPE_VALUE_NUMBER, value: '123' },
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: TYPE_WHITESPACE, value: '  ' },
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp' },
          { type: TYPE_COMPONENT_BRACKET, value: '/>' },
        ],
        meta: ['Comp'],
      },
      {
        elements: [
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: 'Comp2' },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
        meta: ['root'],
      },
    ],
    'edge cases'
  )

  t.deepEquals(
    serializeComponent(
      Comp,
      {
        children: (
          <Comp2>
            <span/>
          </Comp2>
        ),
      },
      {
        indent: 2,
        meta: {
          value: ['root'],
          children: [{
            value: ['Comp'],
          }],
        },
      }
    ),
    [
      {
        elements: [
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'Comp' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'Comp2' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['Comp'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '    ' },
          { type: 'COMPONENT_BRACKET', value: '<' },
          { type: 'COMPONENT_NAME', value: 'span' },
          { type: 'COMPONENT_BRACKET', value: '/>' },
        ],
        meta: ['Comp'],
      },
      {
        elements: [
          { type: 'WHITESPACE', value: '  ' },
          { type: 'COMPONENT_BRACKET', value: '</' },
          { type: 'COMPONENT_NAME', value: 'Comp2' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['Comp'],
      },
      {
        elements: [
          { type: 'COMPONENT_BRACKET', value: '</' },
          { type: 'COMPONENT_NAME', value: 'Comp' },
          { type: 'COMPONENT_BRACKET', value: '>' },
        ],
        meta: ['root'],
      },
    ],
    'non-array children'
  )

  t.end()
})
