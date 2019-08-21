import { TActionWithPayload, TActionAsync, TAnyAction } from '../types'
import { apiLoadList, TApiLoadListResult } from '../api'
import { TActionError, actionError } from './error'
import { TActionLoadingStart, TActionLoadingEnd, actionLoadingStart, actionLoadingEnd } from './loading'

const TYPE_LOAD_LIST = 'LOAD_LIST'

export type TActionLoadList = TActionWithPayload<typeof TYPE_LOAD_LIST, TApiLoadListResult>

export const actionLoadList = (): TActionAsync<TActionLoadList | TActionError | TActionLoadingStart | TActionLoadingEnd> =>
  async (dispatch) => {
    try {
      dispatch(actionLoadingStart())

      const result = await apiLoadList()

      dispatch({ type: TYPE_LOAD_LIST, payload: result })
    } catch (err) {
      console.log(err)
      dispatch(actionError(err))
    } finally {
      dispatch(actionLoadingEnd())
    }
  }

export const isActionLoadList = (obj: TAnyAction): obj is TActionLoadList => obj.type === TYPE_LOAD_LIST
