import React, { Component } from 'react'
import { View } from 'react-native'
import ViewShot from 'react-native-view-shot' // eslint-disable-line
import files from './files' // eslint-disable-line

const defaultStyles = {}
const hasOwnWidthStyles = {
  flexDirection: 'row',
  alignItems: 'flex-start',
}

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

    this.state = {
      fileIndex: 0,
      iterator: null,
      item: null,
      path: null,
    }

    this.onCapture = this.onCapture.bind(this)
  }

  componentDidMount() {
    const { path, content } = files[0]
    const iterator = content[Symbol.iterator]()

    this.setState(() => ({
      path,
      item: iterator.next().value,
      iterator,
    }))
  }

  async onCapture(data) {
    const res = await fetch('http://localhost:3002/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        id: this.state.item.id,
        serializedElement: this.state.item.serializedElement,
        path: this.state.path,
      }),
      keepalive: true,
    })

    if (!res.ok) {
      return
    }

    const nextResult = this.state.iterator.next()

    if (!nextResult.done) {
      this.setState({
        item: nextResult.value,
      })
    } else if (this.state.fileIndex < files.length - 1) {
      const nextFileIndex = this.state.fileIndex + 1
      const { path, content } = files[nextFileIndex]
      const iterator = content[Symbol.iterator]()

      this.setState(() => ({
        item: iterator.next().value,
        fileIndex: nextFileIndex,
        path,
        iterator,
      }))
    } else {
      // finish
      await fetch('http://localhost:3002/done')
    }
  }

  onCaptureFailure(err) {
    console.log(err)
  }

  render() {
    const { item, fileIndex } = this.state

    if (item === null) {
      return null
    }

    return (
      <View style={item.options.hasOwnWidth ? hasOwnWidthStyles : defaultStyles}>
        <ViewShot
          captureMode="mount"
          options={{ result: 'base64' }}
          key={`${fileIndex}:${item.id}`}
          style={{
            padding: item.options.negativeOverflow,
            maxWidth: item.options.maxWidth,
            backgroundColor: item.options.backgroundColor || '#fff',
          }}
          onCapture={this.onCapture}
          onCaptureFailure={this.onCaptureFailure}
        >
          {item.element}
        </ViewShot>
      </View>
    )
  }
}
