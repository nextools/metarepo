import { TAction, TActionAsync, TAnyAction } from '../types'
import { apiSave } from '../api'
import { TActionError, actionError } from './error'
import { TActionLoadingStart, TActionLoadingEnd, actionLoadingStart, actionLoadingEnd } from './loading'

const TYPE_SAVE = 'SAVE'

export type TActionSave = TAction<typeof TYPE_SAVE>

export const actionSave = (items: string[], discardedItems: string[]): TActionAsync<TActionSave | TActionError | TActionLoadingStart | TActionLoadingEnd> =>
  async (dispatch) => {
    try {
      dispatch(actionLoadingStart())

      await apiSave(items.filter((item) => !discardedItems.includes(item)))

      dispatch({ type: TYPE_SAVE })
    } catch (err) {
      console.log(err)
      dispatch(actionError(err.message))
    } finally {
      dispatch(actionLoadingEnd())
    }
  }

export const isActionSave = (obj: TAnyAction): obj is TActionSave => obj.type === TYPE_SAVE
