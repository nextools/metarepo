import fetch from 'node-fetch'
import plugin from '@start/plugin'

const TIMEOUT = 200

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

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))

export default plugin('wait-for-chromium', () => async () => {
  while (!(await waitForChromium())) {
    await sleep(200)
  }
})
