import { createContext } from 'react'

export type TImageContext = {
  onImageMount?: (id: number) => void,
  onImageLoad?: (id: number) => void,
}

export const ImageContext = createContext<TImageContext>({})
