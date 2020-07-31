import { useContext } from 'react'
import type { Context } from 'react'
import type { TExtend } from 'tsfn'

export const mapContext = <CP extends {}> (context: Context<CP>) => <P extends {}>(props: P): TExtend<P, CP> => {
  const contextProps = useContext(context)

  return {
    ...props,
    ...contextProps,
  }
}
