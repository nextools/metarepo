// @ts-ignore
// eslint-disable-next-line
import { App as TargetApp } from '__PERFA_TARGET_APP_PATH__'
import { getUsedMemory } from 'react-native-device-info'
import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue'
import { SERVER_HOST, SERVER_PORT } from './constants'

let createViewCallCount = 0

MessageQueue.spy(async (msg) => {
  if (msg.method === 'createView') {
    createViewCallCount++
  }

  if (msg.method === 'callTimers') {
    MessageQueue.spy(false)

    const usedMemory = await getUsedMemory()

    await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/?viewCount=${createViewCallCount}&usedMemory=${usedMemory}`)
  }
})

export const App = () => (
  <TargetApp/>
)
