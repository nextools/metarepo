import type { FC } from 'react'
import { serializeElement } from './serialize-element'
import type { TConfig, TLine } from './types'
import { getDisplayName } from './utils'

export const serializeComponent = (Component: FC<any>, props: any, config: TConfig): TLine[] => {
  const name = getDisplayName(Component)
  const { body } = serializeElement({
    name,
    currentIndent: 0,
    props,
    config,
    meta: config.meta,
  })

  return body
}
