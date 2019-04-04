import { ReactElement } from 'react'
import { TConfig, TSerializedElement } from './types'
import {
  filterProps,
  getElementName,
  hasKeys,
  isNull,
  isUndefined,
} from './utils'
import { serializeIndent } from './serialize-indent'
import { serializeProps } from './serialize-props'
import { serializeChildren } from './serialize-children'

export const serializeElement = (element: ReactElement<any>, currentIndent: number, childDepth: number, config: TConfig): TSerializedElement => {
  const { indent, components: { Line, ComponentBracket, ComponentName } } = config
  const name = getElementName(element)
  const { children, ...props } = element.props
  const hasChildren = !isUndefined(children) && !isNull(children)
  const filteredProps = filterProps(props)
  const hasProps = hasKeys(filteredProps)

  if (!hasProps && !hasChildren) {
    return {
      head: null,
      body: Line([
        serializeIndent(currentIndent, config),
        ComponentBracket('<'),
        ComponentName(name),
        ComponentBracket('/>'),
      ]),
      tail: null,
    }
  }

  if (hasProps && !hasChildren) {
    const { body } = serializeProps(filteredProps, currentIndent + indent, config)

    return {
      head: null,
      body: [
        Line([
          serializeIndent(currentIndent, config),
          ComponentBracket('<'),
          ComponentName(name),
        ]),
        body,
        Line([
          serializeIndent(currentIndent, config),
          ComponentBracket('/>'),
        ]),
      ],
      tail: null,
    }
  }

  if (!hasProps && hasChildren) {
    const { body } = serializeChildren(children, currentIndent + indent, childDepth + 1, config)

    return {
      head: null,
      body: [
        Line([
          serializeIndent(currentIndent, config),
          ComponentBracket('<'),
          ComponentName(name),
          ComponentBracket('>'),
        ]),
        body,
        Line([
          serializeIndent(currentIndent, config),
          ComponentBracket('</'),
          ComponentName(name),
          ComponentBracket('>'),
        ]),
      ],
      tail: null,
    }
  }

  const { body: propsBody } = serializeProps(filteredProps, currentIndent + indent, config)
  const { body: childrenBody } = serializeChildren(children, currentIndent + indent, childDepth + 1, config)

  return {
    head: null,
    body: [
      Line([
        serializeIndent(currentIndent, config),
        ComponentBracket('<'),
        ComponentName(name),
      ]),
      propsBody,
      Line([
        serializeIndent(currentIndent, config),
        ComponentBracket('>'),
      ]),
      childrenBody,
      Line([
        serializeIndent(currentIndent, config),
        ComponentBracket('</'),
        ComponentName(name),
        ComponentBracket('>'),
      ]),
    ],
    tail: null,
  }
}
