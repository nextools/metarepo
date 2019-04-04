import { ComponentClass, FC } from 'react'
import {
  filterProps,
  hasKeys,
  INITIAL_CHILD_DEPTH,
  isNull,
  isUndefined,
  getDisplayName,
} from './utils'
import { TConfig, TSerializedElement } from './types'
import { serializeProps } from './serialize-props'
import { serializeChildren } from './serialize-children'

export const serializeComponent = (Component: ComponentClass<any> | FC<any>, { children, ...props }: any, config: TConfig): TSerializedElement => {
  const { indent, components: { ComponentBracket, ComponentName, Line } } = config
  const name = getDisplayName(Component)
  const hasChildren = !isUndefined(children) && !isNull(children)
  const filteredProps = filterProps(props)
  const hasProps = hasKeys(filteredProps)

  if (!hasProps && !hasChildren) {
    return {
      head: null,
      body: Line([
        ComponentBracket('<'),
        ComponentName(name),
        ComponentBracket('/>'),
      ]),
      tail: null,
    }
  }

  if (hasProps && !hasChildren) {
    const { body } = serializeProps(filteredProps, indent, config)

    return {
      head: null,
      body: [
        Line([
          ComponentBracket('<'),
          ComponentName(name),
        ]),
        body,
        Line(ComponentBracket('/>')),
      ],
      tail: null,
    }
  }

  if (!hasProps && hasChildren) {
    const { body } = serializeChildren(children, indent, INITIAL_CHILD_DEPTH, config)

    return {
      head: null,
      body: [
        Line([
          ComponentBracket('<'),
          ComponentName(name),
          ComponentBracket('>'),
        ]),
        body,
        Line([
          ComponentBracket('</'),
          ComponentName(name),
          ComponentBracket('>'),
        ]),
      ],
      tail: null,
    }
  }

  const { body: propsBody } = serializeProps(filteredProps, indent, config)
  const { body: childrenBody } = serializeChildren(children, indent, INITIAL_CHILD_DEPTH, config)

  return {
    head: null,
    body: [
      Line([
        ComponentBracket('<'),
        ComponentName(name),
      ]),
      propsBody,
      Line(
        ComponentBracket('>')
      ),
      childrenBody,
      Line([
        ComponentBracket('</'),
        ComponentName(name),
        ComponentBracket('>'),
      ]),
    ],
    tail: null,
  }
}
