import { isArray, isDefined } from 'tsfn'
import type { TJSDoc, TNode, TTag } from './types'

export const getJSDoc = (node: TNode): TJSDoc | null => {
  if (isArray(node.jsDoc)) {
    const result: TJSDoc = {}

    for (const doc of node.jsDoc) {
      if (isDefined(doc.comment)) {
        result.comment = doc.comment
      }

      if (isDefined(doc.tags)) {
        result.tags = []

        for (const tag of doc.tags) {
          const tagResult: TTag = {
            tag: tag.tagName.text,
          }

          if (isDefined(tag.name)) {
            tagResult.name = tag.name.text
          }

          if (isDefined(tag.comment)) {
            tagResult.comment = tag.comment
          }

          result.tags.push(tagResult)
        }
      }
    }

    return result
  }

  return null
}
