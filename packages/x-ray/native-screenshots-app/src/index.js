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

const SCREENSHOTS_CONCURRENCY = 4

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

    const { path, examples } = files[0]
    const iterator = examples[Symbol.iterator]()

    this.state = {
      fileIndex: 0,
      items: Array.from(
        { length: SCREENSHOTS_CONCURRENCY },
        () => iterator.next().value
      ),
    }

    this.iterator = iterator
    this.path = path
    this.examplesDoneCount = 0
  }

  onCapture = async (data, id) => {
    const res = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        id,
        path: this.path,
      }),
      keepalive: true,
    })

    if (!res.ok) {
      throw new Error(`${res.statusText}: ${res.statusText}`)
    }

    const iteration = this.iterator.next()

    if (!iteration.done) {
      this.setState((state) => ({
        fileIndex: state.fileIndex,
        items: state.items
          .filter((item) => item.id !== id)
          .concat(iteration.value),
      }))
    } else {
      this.examplesDoneCount++

      if (this.examplesDoneCount === SCREENSHOTS_CONCURRENCY) {
        this.examplesDoneCount = 0

        const nextFileIndex = this.state.fileIndex + 1

        if (nextFileIndex === files.length) {
          console.warn('DONE')

          return
        }

        const { path, examples } = files[nextFileIndex]
        const iterator = examples[Symbol.iterator]()

        this.path = path
        this.iterator = iterator

        this.setState((state) => ({
          fileIndex: nextFileIndex,
          items: state.items.map(() => this.iterator.next().value),
        }))
      }
    }
  }

  render() {
    return (
      <Fragment>
        {
          this.state.items.map((item) => (
            <View
              key={`${this.state.fileIndex}:${item.id}`}
              style={item.options.hasOwnWidth ? hasOwnWidthStyles : defaultStyles}
            >
              <ViewShot
                onCapture={(data) => this.onCapture(data, item.id)}
                captureMode="mount"
                options={{ result: 'base64' }}
                style={{
                  padding: item.options.overflow,
                  paddingTop: item.options.overflowTop,
                  paddingBottom: item.options.overflowBottom,
                  paddingLeft: item.options.overflowLeft,
                  paddingRight: item.options.overflowRight,
                  maxWidth: item.options.maxWidth,
                  backgroundColor: item.options.backgroundColor || '#fff',
                }}
              >
                {item.element}
              </ViewShot>
            </View>
          ))
        }
      </Fragment>
    )
  }
}
