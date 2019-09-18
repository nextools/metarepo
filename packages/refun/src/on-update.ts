import { useRef } from 'react'
import { useEffectFn } from './utils'

export const onUpdate = <P extends {}> (updateFn: (props: P) => void, watchKeys: (keyof P)[]) => (props: P): P => {
  const isMounted = useRef(false)

  useEffectFn(() => {
    if (isMounted.current) {
      updateFn(props)
    }

    isMounted.current = true
  }, watchKeys.map((k) => props[k]))

  return props
}
