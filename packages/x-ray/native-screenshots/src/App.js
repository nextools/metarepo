import React, { Component } from 'react'
import { AppRegistry, View } from 'react-native' // eslint-disable-line
import ViewShot from 'react-native-view-shot'
import files from './files' // eslint-disable-line

const defaultStyles = {}
const hasOwnWidthStyles = {
  alignItems: 'flex-start',
}

class App extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      fileIndex: 0,
      elementIndex: 0,
      path: null,
      fixture: null,
    }

    this.onCapture = this.onCapture.bind(this)
  }

  async componentDidMount() {
    try {
      const { path, content } = files[0]()
      const { default: { default: fixture } } = await content

      this.setState(() => ({
        path,
        fixture,
      }))
    } catch (e) {
      console.log(e)
    }
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
        name: this.state.fixture[this.state.elementIndex].options.name,
        path: this.state.path,
      }),
      keepalive: true,
    })

    if (!res.ok) {
      throw new Error('Server is down')
    }

    if (this.state.elementIndex < this.state.fixture.length - 1) {
      this.setState((prev) => ({
        elementIndex: prev.elementIndex + 1,
      }))
    } else if (this.state.fileIndex < files.length - 1) {
      const nextFileIndex = this.state.fileIndex + 1
      const { path, content } = files[nextFileIndex]()
      const { default: { default: fixture } } = await content

      this.setState(() => ({
        elementIndex: 0,
        fileIndex: nextFileIndex,
        path,
        fixture,
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
    const { fixture, elementIndex, fileIndex } = this.state
    const { options } = fixture[elementIndex]

    if (fixture === null) {
      return null
    }

    return (
      <View style={options.hasOwnWidth ? hasOwnWidthStyles : defaultStyles}>
        <ViewShot
          captureMode="mount"
          options={{ result: 'base64' }}
          key={`${fileIndex}${elementIndex}`}
          onCapture={this.onCapture}
          onCaptureFailure={this.onCaptureFailure}
        >
          <View
            style={{
              padding: options.negativeOverflow,
              maxWidth: options.maxWidth,
              backgroundColor: options.backgroundColor || '#fff',
            }}
          >
            {fixture[elementIndex].element}
          </View>
        </ViewShot>
      </View>
    )
  }
}

AppRegistry.registerComponent('xray', () => App)
