import { FC } from 'react'
import { TAnyObject } from 'tsfn'
import { serializeComponent } from 'syntx'
import { TSyntxLines } from './types'

export const serializeElement = (Comp: FC<any>, props: TAnyObject): TSyntxLines => {
  return serializeComponent(Comp, props, { indent: 2 }).map(({ elements }) => elements)
}
