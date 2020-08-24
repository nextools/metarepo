import type { ReactElement } from 'react'

export type TDimensions = {
  width: number,
  height: number,
}

export type TRoot = {}

export type TPrimitiveRoot = {
  children: (dimensions: TDimensions) => ReactElement,
}
