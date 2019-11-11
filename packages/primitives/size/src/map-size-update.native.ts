import { MutableRefObject } from 'react'
import { pipe } from '@psxcode/compose'
import { startWithType, mapContext, onMount, onUpdate, mapRef } from 'refun'
import { isFunction, TExtend3 } from 'tsfn'
import { SizeContext, TSizeContext } from './Context'
import { TSize } from './types'

const getId = (() => {
  let id = 0

  return () => id++
})()

export const mapSizeUpdate = <P extends TSize> () => {
  if (process.env.NODE_ENV !== 'production') {
    return pipe(
      startWithType<P & TSize>(),
      mapContext(SizeContext),
      mapRef('sizeId', getId()),
      onMount(({ sizeId, onSizeMount }) => {
        if (isFunction(onSizeMount)) {
          onSizeMount(sizeId.current)
        }
      }),
      onUpdate(({ sizeId, onSizeUpdate }) => {
        if (isFunction(onSizeUpdate)) {
          onSizeUpdate(sizeId.current)
        }
      }, ['width', 'height'])
    )
  }

  // same function type as above
  return (props: P) => props as any as TExtend3<P, TSizeContext, {sizeId: MutableRefObject<number>}>
}
