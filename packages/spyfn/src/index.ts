const GET_SPY_CALLS_SYMBOL = Symbol('get-spy-calls')

type TProps <T extends any[]> = {
  index: number,
  args: T,
}
type TCalls <T extends any> = T[]
type TSpy <T extends any[], R> = (...args: T) => R

export const createSpy = <T extends any[], R>(getResult: (props: TProps<T>) => R) => {
  const calls: TCalls<T> = []

  const spy: TSpy<T, R> = (...args) => {
    if (args[0] === GET_SPY_CALLS_SYMBOL) {
      return calls as any
    }

    calls.push(args)

    const result = getResult({
      index: calls.length - 1,
      args,
    })

    return result
  }

  return spy
}

export const getSpyCalls = (spy: TSpy<any, any>): TCalls<any> => spy(GET_SPY_CALLS_SYMBOL)
