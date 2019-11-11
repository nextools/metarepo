/* eslint-disable import/no-cycle */
import { TConfig, TSerializedElement, TMeta } from './types'
import { filterProps, hasKeys, isValidChildren, sanitizeLines, optMetaValue } from './utils'
import { serializeIndent } from './serialize-indent'
import { serializeProps } from './serialize-props'
import { serializeChildren } from './serialize-children'
import { TYPE_COMPONENT_BRACKET, TYPE_COMPONENT_NAME } from './constants'

export type TSerializeElement = {
  name: string,
  props: any,
  currentIndent: number,
  config: TConfig,
  meta?: TMeta,
}

export const serializeElement = ({ name, props, currentIndent, meta, config }: TSerializeElement): TSerializedElement => {
  const { indent } = config
  const { children, ...restProps } = props
  const hasChildren = isValidChildren(children)
  const filteredProps = filterProps(restProps)
  const hasProps = hasKeys(filteredProps)

  if (!hasProps && !hasChildren) {
    return {
      head: [],
      body: sanitizeLines([
        {
          meta: optMetaValue(meta),
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
      meta,
    })

    return {
      head: [],
      body: sanitizeLines([
        {
          meta: optMetaValue(meta),
          elements: [
            serializeIndent(currentIndent),
            { type: TYPE_COMPONENT_BRACKET, value: '<' },
            { type: TYPE_COMPONENT_NAME, value: name },
          ],
        },
        ...body,
        {
          meta: optMetaValue(meta),
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
      meta,
    })

    return {
      head: [],
      body: sanitizeLines([
        {
          meta: optMetaValue(meta),
          elements: [
            serializeIndent(currentIndent),
            { type: TYPE_COMPONENT_BRACKET, value: '<' },
            { type: TYPE_COMPONENT_NAME, value: name },
            { type: TYPE_COMPONENT_BRACKET, value: '>' },
          ],
        },
        ...body,
        {
          meta: optMetaValue(meta),
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
    meta,
  })
  const { body: childrenBody } = serializeChildren({
    children,
    currentIndent: currentIndent + indent,
    config,
    meta,
  })

  return {
    head: [],
    body: sanitizeLines([
      {
        meta: optMetaValue(meta),
        elements: [
          serializeIndent(currentIndent),
          { type: TYPE_COMPONENT_BRACKET, value: '<' },
          { type: TYPE_COMPONENT_NAME, value: name },
        ],
      },
      ...propsBody,
      {
        meta: optMetaValue(meta),
        elements: [
          serializeIndent(currentIndent),
          { type: TYPE_COMPONENT_BRACKET, value: '>' },
        ],
      },
      ...childrenBody,
      {
        meta: optMetaValue(meta),
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
