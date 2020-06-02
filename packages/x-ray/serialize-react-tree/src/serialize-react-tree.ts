/* eslint-disable import/no-cycle */
import { ReactElement } from 'react'
import renderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { isString, isNumber, isBoolean, isDefined } from 'tsfn'
import serializeProps from './serialize-props'
import { makeIndent, nextIndent } from './make-indent'

export type ReactElementJson = {
  type: string,
  props: { [k: string]: any },
  children: ReactElementJson[] | null,
} | string | number | boolean

const hasValidProps = (obj: any) => Object.values(obj).some((v) => isDefined(v))

const serializeReactTree = (reactNode: ReactElement<any>, indent: number) => {
  const go = (json: ReactElementJson, indent: number) => {
    let result = makeIndent(indent)

    if (isString(json)) {
      return result + json
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/{/g, '&#123;')
        .replace(/}/g, '&#125;')
        .replace(/^( +)/, (match) => match.replace(/ /g, '&#32;'))
        .replace(/( +)$/, (match) => match.replace(/ /g, '&#32;'))
    }

    if (isNumber(json) || isBoolean(json)) {
      return result + json
    }

    const hasProps = hasValidProps(json.props)

    result += '<'
    result += json.type

    if (hasProps) {
      result += '\n'
      result += serializeProps(json.props, nextIndent(indent))
    }

    if (Array.isArray(json.children)) {
      if (hasProps) {
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
      if (hasProps) {
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
