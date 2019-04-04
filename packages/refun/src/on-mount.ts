import { useEffectFn } from './utils'

export const onMount = <P extends {}> (onMount: (props: P) => void | (() => void)) => (props: P): P => {
  useEffectFn(() => onMount(props), [])

  return props
}
