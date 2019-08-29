import request from 'request-promise-native'
import plugin from '@start/plugin'

const TIMEOUT = 200

const waitForChromium = async () => {
  try {
    await request({
      timeout: TIMEOUT,
      uri: 'http://localhost:9222/json',
      json: true,
    })

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
