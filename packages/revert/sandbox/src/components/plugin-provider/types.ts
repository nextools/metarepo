import type { FC } from 'react'

export type TPopoverPlugin = {
  Icon: FC,
  Popover: FC,
  tooltip: string,
}

export type TProviderPlugin = FC<{ Component: FC, props: any }>
