import React, { Component } from 'react'
import { View } from 'react-native'
import ViewShot from 'react-native-view-shot' // eslint-disable-line
import { SizeContext } from '@primitives/size'
import files from './files' // eslint-disable-line

const defaultStyles = {}
const hasOwnWidthStyles = {
  flexDirection: 'row',
  alignItems: 'flex-start',
}

const SizeProvider = ({ shouldWaitForResize, onCapture, children }) => {
  if (shouldWaitForResize) {
    let numMountedSizes = 0
    let numUpdatedSizes = 0

    return (
      <SizeContext.Provider value={{
        onSizeMount: () => {
          numMountedSizes++
        },
        onSizeUpdate: () => {
          numUpdatedSizes++

          if (numUpdatedSizes === numMountedSizes) {
            onCapture()
          }
        },
      }}
      >
        {children}
      </SizeContext.Provider>
    )
  }

  return children
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

    this.isCapturing = false
    this.viewShot = null
    this.onRef = this.onRef.bind(this)
    this.onCapture = this.onCapture.bind(this)
  }

  componentDidMount() {
    const { path, content } = files[0]
    const iterator = content[Symbol.iterator]()

    this.setState(() => ({
      path,
      item: iterator.next().value,
      iterator,
    }), async () => {

    })
  }

  onRef(ref) {
    this.viewShot = ref

    const { item } = this.state

    if (item !== null && !item.options.shouldWaitForResize) {
      this.onCapture()
    }
  }

  async onCapture() {
    if (this.viewShot === null || this.isCapturing) {
      return
    }

    this.isCapturing = true

    try {
      const data = await this.viewShot.capture()

      this.isCapturing = false

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
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { item, fileIndex } = this.state

    if (item === null) {
      return null
    }

    return (
      <SizeProvider
        shouldWaitForResize={item.options.shouldWaitForResize}
        onCapture={this.onCapture}
      >
        <View
          style={item.options.hasOwnWidth ? hasOwnWidthStyles : defaultStyles}
          key={`${fileIndex}:${item.id}`}
        >
          <ViewShot
            ref={this.onRef}
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
      </SizeProvider>
    )
  }
}
