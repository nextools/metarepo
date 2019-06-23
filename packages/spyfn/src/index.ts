const GET_SPY_CALLS_SYMBOL = Symbol('get-spy-calls')

type TProps = {
  index: number,
  args: any[],
}
type TCalls = any[][]
type TSpy = (...args: any[]) => any

export const createSpy = (getResult: (props: TProps) => any) => {
  const calls: TCalls = []

  const spy: TSpy = (...args) => {
    if (args[0] === GET_SPY_CALLS_SYMBOL) {
      return calls
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

export const getSpyCalls = (spy: TSpy): TCalls => spy(GET_SPY_CALLS_SYMBOL)
