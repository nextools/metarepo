/* eslint-disable no-invalid-this */
import React, { Component, Fragment } from 'react'
import { View } from 'react-native'
import ViewShot from 'react-native-view-shot'
import files from './files' // eslint-disable-line

const SERVER_HOST = 'localhost'
const SERVER_PORT = 3003

const defaultStyles = {}
const hasOwnWidthStyles = {
  marginTop: 30,
  flexDirection: 'row',
  alignItems: 'flex-start',
}

const SCREENSHOTS_CONCURRENCY = 2

export class App extends Component {
  async componentDidCatch(error) {
    console.log(error)

    await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/error`, {
      method: 'POST',
      body: error.message,
    })
  }

  render() {
    return (
      <Main/>
    )
  }
}

class Main extends Component {
  constructor(...args) {
    super(...args)

    const state = {}

    for (let i = 0; i < SCREENSHOTS_CONCURRENCY; i++) {
      const file = files[i]
      const iterator = file.examples[Symbol.iterator]()

      state[file.path] = {
        iterator,
        example: iterator.next().value,
      }
    }

    this.state = state
    this.fileIndex = SCREENSHOTS_CONCURRENCY - 1
    this.filesInProgressCount = SCREENSHOTS_CONCURRENCY
  }

  onCapture = async (path, id, base64data) => {
    const { iterator } = this.state[path]
    const result = iterator.next()

    const res = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/upload?path=${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isDone: result.done,
        path,
        id,
        base64data,
      }),
      keepalive: true,
    })

    if (!res.ok) {
      throw new Error(`${res.statusText}: ${res.statusText}`)
    }

    if (result.done) {
      this.filesInProgressCount--

      if (this.fileIndex + 1 === files.length) {
        if (this.filesInProgressCount === 0) {
          await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/done`, {
            method: 'POST',
          })

          console.warn('DONE')
        }

        return
      }

      this.fileIndex++
      this.filesInProgressCount++

      const nextFile = files[this.fileIndex]
      const nextIterator = nextFile.examples[Symbol.iterator]()

      this.setState((state) => ({
        ...state,
        [nextFile.path]: {
          iterator: nextIterator,
          example: nextIterator.next().value,
        },
      }))

      return
    }

    this.setState((state) => ({
      ...state,
      [path]: {
        iterator: state[path].iterator,
        example: result.value,
      },
    }))
  }

  render() {
    return (
      <Fragment>
        {
          Object.entries(this.state).map(([path, value]) => (
            <View
              key={`${path}:${value.example.id}`}
              style={value.example.options.hasOwnWidth ? hasOwnWidthStyles : defaultStyles}
            >
              <ViewShot
                onCapture={(data) => this.onCapture(path, value.example.id, data)}
                captureMode="mount"
                options={{ result: 'base64' }}
                style={{
                  padding: value.example.options.overflow,
                  paddingTop: value.example.options.overflowTop,
                  paddingBottom: value.example.options.overflowBottom,
                  paddingLeft: value.example.options.overflowLeft,
                  paddingRight: value.example.options.overflowRight,
                  maxWidth: value.example.options.maxWidth,
                  backgroundColor: value.example.options.backgroundColor || '#fff',
                }}
              >
                {value.example.element}
              </ViewShot>
            </View>
          ))
        }
      </Fragment>
    )
  }
}
