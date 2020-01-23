import { useContext, Context } from 'react'
import { Store } from 'redux'
import { TExtend } from 'tsfn'

export const ReduxDispatchFactory = <STORE extends Store>(context: Context<STORE>) => <K extends string>(dispatchName: K) =>
<P extends {}>(props: P): TExtend<P, { [k in K]: STORE['dispatch'] }> => ({
    ...props,
    [dispatchName]: useContext(context).dispatch,
  }) as any
