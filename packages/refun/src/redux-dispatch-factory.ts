import { useContext } from 'react'
import type { Context } from 'react'
import type { Store } from 'redux'
import type { TExtend } from 'tsfn'

export const ReduxDispatchFactory = <STORE extends Store>(context: Context<STORE>) => <K extends string>(dispatchName: K) =>
<P extends {}>(props: P): TExtend<P, { [k in K]: STORE['dispatch'] }> => ({
    ...props,
    [dispatchName]: useContext(context).dispatch,
  }) as any
