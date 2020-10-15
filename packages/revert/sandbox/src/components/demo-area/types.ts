import type { ReactElement } from 'react'

export type TPosition = {
  readonly left: number,
  readonly top: number,
}

export type TRect = TPosition & {
  readonly width: number,
  readonly height: number,
}

export type TDemoComponent = TRect & {
  onHeightChange?: (value: number) => void,
  shouldUse3d?: boolean,
  children: ReactElement,
}
