import { useEffect, useRef } from 'react'
import { objectHas } from 'tsfn'

const globalObject = (global as unknown) as Window

export type TMapKeyPress<P> = {
  [key: string]: (props: P) => void,
}

export const onKeyDown = <P extends {}>(map: TMapKeyPress<P>) => (props: P) => {
  const propsRef = useRef<P>(props)

  propsRef.current = props

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (objectHas(map, e.key)) {
        e.preventDefault()

        map[e.key](propsRef.current)
      }
    }

    globalObject.addEventListener('keydown', onKeyDown)

    return () => {
      globalObject.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return props
}
