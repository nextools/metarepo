import { useContext, Context } from 'react'
import { TExtend } from 'tsfn'
import { TStoreContextValue } from './redux-state-factory'

export const ReduxDispatchFactory = <S, D>(context: Context<TStoreContextValue<S, D>>) => <P extends {}>(props: P): TExtend<P, { dispatch: D }> => {
  const { dispatch } = useContext(context)

  return {
    ...props,
    dispatch,
  }
}
