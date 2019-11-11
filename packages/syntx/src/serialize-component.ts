import { FC } from 'react'
import { TConfig, TLine } from './types'
import { serializeElement } from './serialize-element'
import { getDisplayName } from './utils'

export const serializeComponent = (Component: FC<any>, props: any, config: TConfig): readonly TLine[] => {
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
