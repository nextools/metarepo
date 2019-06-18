import React, { FC } from 'react'
import { TConfig } from './types'
import { serializeElement } from './serialize-element'
import { getDisplayName } from './utils'

export * from './types'

export const highlighter = (Component: FC<any>, props: any, config: TConfig) => {
  const { components: { Root } } = config
  const name = getDisplayName(Component)
  const { body } = serializeElement({
    name,
    currentIndent: 0,
    childIndex: 0,
    props,
    config,
    path: [],
  })

  return (
    <Root>{body}</Root>
  )
}
