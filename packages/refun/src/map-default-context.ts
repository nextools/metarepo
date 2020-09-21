import { useContext } from 'react'
import type { Context } from 'react'
import { UNDEFINED } from 'tsfn'

export const mapDefaultContext = <CP extends {}> (context: Context<CP>) => <P extends {}>(props: P): CP & P => {
  const contextProps = useContext(context)
  const mergedProps = { ...props } as any

  // eslint-disable-next-line guard-for-in
  for (const key in contextProps) {
    if ((props as any)[key] === UNDEFINED) {
      mergedProps[key] = contextProps[key]
    }
  }

  return mergedProps
}
