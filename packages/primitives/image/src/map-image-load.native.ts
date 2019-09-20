import { MutableRefObject } from 'react'
import { pipe } from '@psxcode/compose'
import { isFunction, TExtend } from 'tsfn'
import { startWithType, mapContext, onMount, mapHandlers, mapRef } from 'refun'
import { ImageContext, TImageContext } from './Context'
import { TImage } from './types'

const getId = (() => {
  let id = 0

  return () => id++
})()

export const mapImageLoad = <P extends TImage> () => {
  if (process.env.NODE_ENV !== 'production') {
    return pipe(
      startWithType<P & TImage>(),
      mapContext(ImageContext),
      mapRef('imageId', getId()),
      onMount(({ imageId, onImageMount }) => {
        if (isFunction(onImageMount)) {
          onImageMount(imageId.current)
        }
      }),
      mapHandlers(({
        onLoad: ({ imageId, onLoad, onImageLoad }) => () => {
          if (isFunction(onLoad)) {
            onLoad()
          }

          if (isFunction(onImageLoad)) {
            onImageLoad(imageId.current)
          }
        },
        onError: ({ imageId, onError, onImageLoad }) => () => {
          if (isFunction(onError)) {
            onError()
          }

          if (isFunction(onImageLoad)) {
            onImageLoad(imageId.current)
          }
        },
      }))
    )
  }

  // same function type as above
  return (props: P) => props as any as TExtend<TExtend<P, TImageContext>, {imageId: MutableRefObject<number>}>
}
