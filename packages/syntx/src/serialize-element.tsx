/* eslint-disable import/no-cycle */
import React from 'react'
import { TConfig, TSerializedElement, TPath } from './types'
import { filterProps, hasKeys, isValidChildren, sanitizeArray } from './utils'
import { serializeIndent } from './serialize-indent'
import { serializeProps } from './serialize-props'
import { serializeChildren } from './serialize-children'

export type TSerializeElement = {
  name: string,
  props: any,
  currentIndent: number,
  childIndex: number,
  config: TConfig,
  path: TPath,
}

export const serializeElement = ({ name, props, currentIndent, childIndex, config, path }: TSerializeElement): TSerializedElement => {
  const { indent, components: { Line, ComponentBracket, ComponentName } } = config
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
      head: null,
      body: (
        <Line path={elementPath}>
          {serializeIndent({ currentIndent, config })}
          <ComponentBracket>{'<'}</ComponentBracket>
          <ComponentName>{name}</ComponentName>
          <ComponentBracket>{'/>'}</ComponentBracket>
        </Line>
      ),
      tail: null,
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
      head: null,
      body: sanitizeArray([
        (
          <Line path={elementPath} key="element-open-line">
            {serializeIndent({ currentIndent, config })}
            <ComponentBracket>{'<'}</ComponentBracket>
            <ComponentName>{name}</ComponentName>
          </Line>
        ),
        body,
        (
          <Line path={elementPath} key="element-close-line">
            {serializeIndent({ currentIndent, config })}
            <ComponentBracket>{'/>'}</ComponentBracket>
          </Line>
        ),
      ]),
      tail: null,
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
      head: null,
      body: sanitizeArray([
        (
          <Line path={elementPath} key="element-open-line">
            {serializeIndent({ currentIndent, config })}
            <ComponentBracket>{'<'}</ComponentBracket>
            <ComponentName>{name}</ComponentName>
            <ComponentBracket>{'>'}</ComponentBracket>
          </Line>
        ),
        body,
        (
          <Line path={elementPath} key="element-close-line">
            {serializeIndent({ currentIndent, config })}
            <ComponentBracket>{'</'}</ComponentBracket>
            <ComponentName>{name}</ComponentName>
            <ComponentBracket>{'>'}</ComponentBracket>
          </Line>
        ),
      ]),
      tail: null,
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
    head: null,
    body: sanitizeArray([
      (
        <Line path={elementPath} key="element-open-line-1">
          {serializeIndent({ currentIndent, config })}
          <ComponentBracket>{'<'}</ComponentBracket>
          <ComponentName>{name}</ComponentName>
        </Line>
      ),
      propsBody,
      (
        <Line path={elementPath} key="element-open-line-2">
          {serializeIndent({ currentIndent, config })}
          <ComponentBracket>{'>'}</ComponentBracket>
        </Line>
      ),
      childrenBody,
      (
        <Line path={elementPath} key="element-close-line">
          {serializeIndent({ currentIndent, config })}
          <ComponentBracket>{'</'}</ComponentBracket>
          <ComponentName>{name}</ComponentName>
          <ComponentBracket>{'>'}</ComponentBracket>
        </Line>
      ),
    ]),
    tail: null,
  }
}
