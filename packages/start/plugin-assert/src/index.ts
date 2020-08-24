import plugin from '@start/plugin'

export default (value: any, message?: string) =>
  plugin('assert', () => async () => {
    const { default: assertLib } = await import('assert')

    // @ts-ignore
    assertLib(value, message)
  })
