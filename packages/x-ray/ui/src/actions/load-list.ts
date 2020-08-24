import { apiLoadList } from '../api'
import type { TApiLoadListResult } from '../api'
import type { TActionWithPayload, TActionAsync, TAnyAction } from '../types'
import { actionError } from './error'
import type { TActionError } from './error'
import { actionLoadingStart, actionLoadingEnd } from './loading'
import type { TActionLoadingStart, TActionLoadingEnd } from './loading'

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
