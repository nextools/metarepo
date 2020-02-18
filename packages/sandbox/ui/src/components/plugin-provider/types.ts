import { FC } from 'react'

export type TPlugin = {
  Icon: FC,
  Popover: FC,
  tooltip: string,
  Provider: FC<{ Component: FC, props: any }>,
}
