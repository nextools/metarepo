/* eslint-disable import/no-cycle */
import { ReactElement } from 'react'
import renderer, { ReactTestRendererJSON } from 'react-test-renderer'
import is from '@sindresorhus/is'
import serializeProps from './serialize-props'
import { makeIndent, nextIndent } from './make-indent'

export type ReactElementJson = {
  type: string,
  props: { [k: string]: any },
  children: ReactElementJson[] | null,
} | string | number | boolean

const hasKeys = (obj: any) => Object.keys(obj).length > 0

const serializeReactTree = (reactNode: ReactElement<any>, indent: number) => {
  const go = (json: ReactElementJson, indent: number) => {
    let result = makeIndent(indent)

    if (is.string(json)) {
      return result + json
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/{/g, '&#123;')
        .replace(/}/g, '&#125;')
        .replace(/^( +)/, (match) => match.replace(/ /g, '&#32;'))
        .replace(/( +)$/, (match) => match.replace(/ /g, '&#32;'))
    }

    if (is.number(json) || is.boolean(json)) {
      return result + json
    }

    result += '<'
    result += json.type

    if (hasKeys(json.props)) {
      result += '\n'
      result += serializeProps(json.props, nextIndent(indent))
    }

    if (Array.isArray(json.children)) {
      if (hasKeys(json.props)) {
        result += '\n'
        result += makeIndent(indent)
      }

      result += '>\n'

      result += json.children
        .map((child) => go(child, nextIndent(indent)))
        .join('\n')

      result += '\n'
      result += makeIndent(indent)
      result += '</'
      result += json.type
      result += '>'
    } else {
      if (hasKeys(json.props)) {
        result += '\n'
        result += makeIndent(indent)
      }

      result += '/>'
    }

    return result
  }

  const elementJson = renderer.create(reactNode).toJSON() as ReactTestRendererJSON

  return go(elementJson, indent)
}

export default serializeReactTree
