import { createContext } from 'react'
import type { TImageContext } from './types'

export const ImageContext = createContext<TImageContext>({})

ImageContext.displayName = 'ImageContext'
