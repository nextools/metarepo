import { ReactNode } from 'react'

export type TDimensions = {
  width: number,
  height: number,
}

export type TRoot = {
  children: (dimensions: TDimensions) => ReactNode,
}
