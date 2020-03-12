import plugin from '@start/plugin'

const TIMEOUT = 200

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))

export default plugin('wait-for-chromium', () => async () => {
  const { default: fetch } = await import('node-fetch')

  const waitForChromium = async () => {
    try {
      await fetch(
        'http://localhost:9222/json',
        { timeout: TIMEOUT }
      )

      return true
    } catch (e) {
      return false
    }
  }

  while (!(await waitForChromium())) {
    await sleep(200)
  }
})
