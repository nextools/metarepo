// @ts-ignore
// eslint-disable-next-line
import { App as TargetApp } from '__BRIEW_TARGET_APP_PATH__'
import React from 'react'
import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue'
import { SERVER_HOST, SERVER_PORT } from './constants'

let createViewCallCount = 0

MessageQueue.spy((msg) => {
  if (msg.method === 'createView') {
    createViewCallCount++
  }

  if (msg.method === 'callTimers') {
    MessageQueue.spy(false)

    return fetch(`http://${SERVER_HOST}:${SERVER_PORT}/?count=${createViewCallCount}`)
  }
})

export const App = () => (
  <TargetApp/>
)
