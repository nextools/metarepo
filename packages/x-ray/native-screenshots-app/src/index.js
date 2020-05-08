import React, { Component } from 'react'
import { View } from 'react-native'
import ViewShot from 'react-native-view-shot' // eslint-disable-line
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler'
import { SizeContext } from '@primitives/size'
import { ImageContext } from '@primitives/image'
import files from './files' // eslint-disable-line

const exceptionHandler = (error) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  fetch('http://localhost:3002/error', {
    method: 'POST',
    body: String(error),
  })
}

setJSExceptionHandler(exceptionHandler)
setNativeExceptionHandler(exceptionHandler)

const defaultStyles = {}
const hasOwnWidthStyles = {
  flexDirection: 'row',
  alignItems: 'flex-start',
}

const Provider = ({ shouldWaitForResize, shouldWaitForImages, onCapture, children }) => {
  if (shouldWaitForResize || shouldWaitForImages) {
    const sizesIds = new Set()
    let numSizesReady = 0
    const imagesIds = new Set()
    let numImagesReady = 0

    const onSizeReady = (id) => {
      if (sizesIds.has(id)) {
        numSizesReady++

        if (numSizesReady === sizesIds.size && numImagesReady === imagesIds.size) {
          onCapture()
        }
      } else {
        sizesIds.add(id)
      }
    }
    const onImageReady = (id) => {
      if (imagesIds.has(id)) {
        numImagesReady++

        if (numImagesReady === imagesIds.size && numSizesReady === sizesIds.size) {
          onCapture()
        }
      } else {
        imagesIds.add(id)
      }
    }

    if (shouldWaitForImages && shouldWaitForResize) {
      return (
        <SizeContext.Provider value={{
          onSizeMount: onSizeReady,
          onSizeUpdate: onSizeReady,
        }}
        >
          <ImageContext.Provider value={{
            onImageMount: onImageReady,
            onImageLoad: onImageReady,
          }}
          >
            {children}
          </ImageContext.Provider>
        </SizeContext.Provider>
      )
    }

    if (shouldWaitForImages) {
      return (
        <ImageContext.Provider value={{
          onImageMount: onImageReady,
          onImageLoad: onImageReady,
        }}
        >
          {children}
        </ImageContext.Provider>
      )
    }

    return (
      <SizeContext.Provider value={{
        onSizeMount: onSizeReady,
        onSizeUpdate: onSizeReady,
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

    if (item !== null && !item.options.shouldWaitForResize && !item.options.shouldWaitForImages) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.onCapture()
    }
  }

  async onCapture() {
    if (this.viewShot === null || this.isCapturing) {
      return
    }

    this.isCapturing = true

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
  }

  render() {
    const { item, fileIndex } = this.state

    if (item === null) {
      return null
    }

    return (
      <Provider
        shouldWaitForResize={item.options.shouldWaitForResize}
        shouldWaitForImages={item.options.shouldWaitForImages}
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
      </Provider>
    )
  }
}
