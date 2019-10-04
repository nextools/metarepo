import { useRef, MutableRefObject } from 'react'
import { TExtend } from 'tsfn'

export const mapRef = <N extends string, T> (name: N, initialValue: T) =>
  <P extends {}> (props: P): TExtend<P, { [K in N]: MutableRefObject<T> }> => {
    const ref = useRef(initialValue)

    return {
      ...props,
      [name]: ref,
      // FIXME: https://github.com/Microsoft/TypeScript/issues/13948
    } as any
  }
