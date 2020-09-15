import { isArray, isDefined } from 'tsfn'
import type { TDoc, TNode, TTag } from './types'

export const getDoc = (node: TNode): TDoc | null => {
  if (isArray(node.jsDoc)) {
    // support only first one
    const doc = node.jsDoc[0]
    const result: TDoc = {}

    if (isDefined(doc.comment)) {
      result.description = doc.comment
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
          tagResult.description = tag.comment
        }

        result.tags.push(tagResult)
      }
    }

    return result
  }

  return null
}
