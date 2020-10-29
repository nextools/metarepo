import { createContext } from 'react'

export type TTransformContext = {
  _scale: number,
}

export const TransformContext = createContext<TTransformContext>({
  _scale: 1,
})

TransformContext.displayName = 'TransformContext'
