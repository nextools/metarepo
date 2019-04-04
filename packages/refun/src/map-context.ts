import { Context, useContext } from 'react'
import { TExtend } from 'tsfn'

export const mapContext = <CP extends {}> (context: Context<CP>) => <P extends {}>(props: P): TExtend<P, CP> => {
  const contextProps = useContext(context)

  return {
    ...props,
    ...contextProps,
  }
}
