import { useRef, MutableRefObject } from 'react'
import { TExtend } from 'tsfn'

export const mapRef = <N extends string, T> (name: N, initialValue: T) => <P extends {}> (props: P) => {
  const ref = useRef(initialValue)

  return {
    ...props,
    [name]: ref,
    // FIXME: https://github.com/Microsoft/TypeScript/issues/13948
  } as any as TExtend<P, { [K in N]: MutableRefObject<T> }>
}
