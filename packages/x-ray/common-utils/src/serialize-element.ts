import { FC } from 'react'
import { TAnyObject } from 'tsfn'
import { serializeComponent, TLineElement } from 'syntx'

export const serializeElement = (Comp: FC<any>, props: TAnyObject): TLineElement[][] => {
  return serializeComponent(Comp, props, { indent: 2 }).map(({ elements }) => elements)
}
