import request from 'request-promise-native'

const TIMEOUT = 200

const wait = async () => {
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

export const waitForChromium = async () => {
  while (!(await wait())) {
    await sleep(TIMEOUT)
  }
}
