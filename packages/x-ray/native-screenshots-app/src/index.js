/* eslint-disable no-invalid-this */
import React, { Component, Fragment } from 'react'
import { View } from 'react-native'
import ViewShot from 'react-native-view-shot'
import files from './files' // eslint-disable-line

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

    await fetch('http://localhost:3002/error', {
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
  }

  onCapture = (data, id) => {
    const iteration = this.iterator.next()

    // console.warn(data.length)

    if (!iteration.done) {
      this.setState((state) => ({
        fileIndex: state.fileIndex,
        items: state.items
          .filter((item) => item.id !== id)
          .concat(iteration.value),
      }))
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
