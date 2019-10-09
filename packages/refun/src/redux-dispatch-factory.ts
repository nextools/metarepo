import { useContext, Context } from 'react'
import { Dispatch } from 'redux'
import { TExtend } from 'tsfn'
import { TStoreContextValue } from './redux-state-factory'

export const ReduxDispatchFactory = <S, D extends Dispatch>(context: Context<TStoreContextValue<S, D>>) => <P extends {}>(props: P): TExtend<P, { dispatch: D }> => {
  const { dispatch } = useContext(context)

  return {
    ...props,
    dispatch,
  }
}
