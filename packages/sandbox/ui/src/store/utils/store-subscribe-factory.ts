import { Store } from 'redux'
import { EMPTY_OBJECT } from 'tsfn'
import { shallowEqualByKeys } from 'refun'

const objectPick = <T extends {}, K extends keyof T>(obj: T, keys: K[]): { [k in K]: T[k] } => {
  const res = {} as { [k in K]: T[k] }

  for (const k of keys) {
    res[k] = obj[k]
  }

  return res
}

export const storeSubscribeFactory = <S extends {}>(store: Store<S>) => <K extends keyof S>(keys: K[], fn: (state: { [k in K]: S[k] }) => void) => {
  let prevValue = EMPTY_OBJECT as { [k in K]: S[k] }

  store.subscribe(() => {
    const nextValue = objectPick(store.getState(), keys)
    const shouldCall = !shallowEqualByKeys(prevValue, nextValue, keys)

    prevValue = nextValue

    if (shouldCall) {
      fn({ ...nextValue })
    }
  })
}
