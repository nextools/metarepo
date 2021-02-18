/* eslint-disable import/no-extraneous-dependencies */
import { getIterable } from '@iproto/client'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type TApp = {
  port: number,
}

export const App: FC<TApp> = ({ port }) => {
  const [state, setState] = useState(0)
  const [color, setColor] = useState('#000000')

  useEffect(() => {
    void (async () => {
      try {
        const iterable = getIterable<number>({ host: 'localhost', port })
        const iterator = iterable[Symbol.asyncIterator]()
        let result = await iterator.next()

        while (result.done !== true) {
          setState(result.value)

          result = await iterator.next(`from client: got ${result.value}`)
        }

        setColor('#00dd00')
      } catch (e) {
        setColor('#dd0000')
        console.error(e)
      }
    })()
  }, [])

  return (
    <h1 style={{ color }}>{state}</h1>
  )
}
