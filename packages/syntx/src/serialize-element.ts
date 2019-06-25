/* eslint-disable import/no-cycle */
import { TConfig, TSerializedElement, TPath } from './types'
import { filterProps, hasKeys, isValidChildren, sanitizeLines } from './utils'
import { serializeIndent } from './serialize-indent'
import { serializeProps } from './serialize-props'
import { serializeChildren } from './serialize-children'
import { TYPE_COMPONENT_BRACKET, TYPE_COMPONENT_NAME } from './constants'

export type TSerializeElement = {
  name: string,
  props: any,
  currentIndent: number,
  childIndex: number,
  config: TConfig,
  path: TPath,
}

export const serializeElement = ({ name, props, currentIndent, childIndex, config, path }: TSerializeElement): TSerializedElement => {
  const { indent } = config
  const { children, ...restProps } = props
  const hasChildren = isValidChildren(children)
  const filteredProps = filterProps(restProps)
  const hasProps = hasKeys(filteredProps)
  const elementPath = [
    ...path,
    { name, index: childIndex },
  ]

  if (!hasProps && !hasChildren) {
    return {
      head: [],
      body: sanitizeLines([
        {
          path: elementPath,
          elements: [
            serializeIndent(currentIndent),
            { type: TYPE_COMPONENT_BRACKET, value: '<' },
            { type: TYPE_COMPONENT_NAME, value: name },
            { type: TYPE_COMPONENT_BRACKET, value: '/>' },
          ],
        },
      ]),
      tail: [],
    }
  }

  if (hasProps && !hasChildren) {
    const { body } = serializeProps({
      props: filteredProps,
      currentIndent: currentIndent + indent,
      config,
      path: elementPath,
    })

    return {
      head: [],
      body: sanitizeLines([
        {
          path: elementPath,
          elements: [
            serializeIndent(currentIndent),
            { type: TYPE_COMPONENT_BRACKET, value: '<' },
            { type: TYPE_COMPONENT_NAME, value: name },
          ],
        },
        ...body,
        {
          path: elementPath,
          elements: [
            serializeIndent(currentIndent),
            { type: TYPE_COMPONENT_BRACKET, value: '/>' },
          ],
        },
      ]),
      tail: [],
    }
  }

  if (!hasProps && hasChildren) {
    const { body } = serializeChildren({
      children,
      currentIndent: currentIndent + indent,
      config,
      path: elementPath,
    })

    return {
      head: [],
      body: sanitizeLines([
        {
          path: elementPath,
          elements: [
            serializeIndent(currentIndent),
            { type: TYPE_COMPONENT_BRACKET, value: '<' },
            { type: TYPE_COMPONENT_NAME, value: name },
            { type: TYPE_COMPONENT_BRACKET, value: '>' },
          ],
        },
        ...body,
        {
          path: elementPath,
          elements: [
            serializeIndent(currentIndent),
            { type: TYPE_COMPONENT_BRACKET, value: '</' },
            { type: TYPE_COMPONENT_NAME, value: name },
            { type: TYPE_COMPONENT_BRACKET, value: '>' },
          ],
        },
      ]),
      tail: [],
    }
  }

  const { body: propsBody } = serializeProps({
    props: filteredProps,
    currentIndent: currentIndent + indent,
    config,
    path: elementPath,
  })
  const { body: childrenBody } = serializeChildren({
    children,
    currentIndent: currentIndent + indent,
    config,
    path: elementPath,
  })

  return {
    head: [],
    body: sanitizeLines([
      {
        path: elementPath,
        elements: [
          serializeIndent(currentIndent),
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: name },
        ],
      },
      ...propsBody,
      {
        path: elementPath,
        elements: [
          serializeIndent(currentIndent),
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      ...childrenBody,
      {
        path: elementPath,
        elements: [
          serializeIndent(currentIndent),
          { type: TYPE_COMPONENT_BRACKET, value: '</' },
          { type: TYPE_COMPONENT_NAME, value: name },
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
    ]),
    tail: [],
  }
}
