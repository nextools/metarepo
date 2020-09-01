const GET_SPY_CALLS_SYMBOL = Symbol('get-spy-calls')

type TProps = {
  index: number,
  args: any[],
}
type TSpy<R> = (...args: any[]) => R

export const createSpy = <R>(getResult: (props: TProps) => R): TSpy<R> => {
  const calls = [] as any[]

  const spy: TSpy<R> = (...args) => {
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

export const getSpyCalls = (spy: TSpy<any>): any[] => spy(GET_SPY_CALLS_SYMBOL)
