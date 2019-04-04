import { useRef } from 'react'

export const mapRef = <N extends string> (name: N, initialValue: any) => <P extends {}> (props: P) => {
  const ref = useRef(initialValue)

  return {
    ...props,
    [name]: ref,
    // FIXME: https://github.com/Microsoft/TypeScript/issues/13948
  } as P & { [K in N]: any }
}
