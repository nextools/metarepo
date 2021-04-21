/* eslint-disable no-invalid-this */
import { Component } from 'react'
import { View } from 'react-native'
import ViewShot from 'react-native-view-shot'
import { ImageContext } from './image-context'
import { ViewContext } from './view-context'
import './react-native-patch'
// eslint-disable-next-line import/no-unresolved
import { files } from './meta'

const SERVER_HOST = 'localhost'
const SERVER_PORT = 3002

const defaultStyles = {}
const hasOwnWidthStyles = {
  flexDirection: 'row',
  alignItems: 'flex-start',
}

class Example extends Component {
  constructor(...args) {
    super(...args)

    this.imageIds = new Set()
    this.viewIds = new Set()
    this.hasImages = false
    this.hasViews = false
  }

  async componentDidMount() {
    if (!this.hasImages && !this.hasViews) {
      await this.onCapture()
    }
  }

  onRef = (ref) => {
    this.ref = ref
  }

  onCapture = async () => {
    if (this.ref === null) {
      return
    }

    const base64data = await this.ref.capture()

    this.props.onCapture(base64data)
  }

  onImageRender = () => {
    this.hasImages = true
  }

  onImageMount = (id) => {
    this.imageIds.add(id)
  }

  onImageLoad = async (id) => {
    this.imageIds.delete(id)

    if (this.imageIds.size === 0) {
      if (this.hasViews && this.viewIds.size > 0) {
        return
      }

      await this.onCapture()
    }
  }

  onViewRender = () => {
    this.hasViews = true
  }

  onViewMount = (id) => {
    this.viewIds.add(id)
  }

  onViewLayout = async (id) => {
    this.viewIds.delete(id)

    if (this.viewIds.size === 0) {
      if (this.hasImages && this.imageIds.size > 0) {
        return
      }

      await this.onCapture()
    }
  }

  render() {
    const { options, children } = this.props

    return (
      <View style={options.hasOwnWidth ? hasOwnWidthStyles : defaultStyles}>
        <ViewShot
          ref={this.onRef}
          options={{ result: 'base64' }}
          style={{
            padding: options.overflow,
            paddingTop: options.overflowTop,
            paddingBottom: options.overflowBottom,
            paddingLeft: options.overflowLeft,
            paddingRight: options.overflowRight,
            maxWidth: options.maxWidth,
            backgroundColor: options.backgroundColor || '#fff',
          }}
        >
          <ImageContext.Provider value={{ onMount: this.onImageMount, onLoad: this.onImageLoad, onRender: this.onImageRender }}>
            <ViewContext.Provider value={{ onMount: this.onViewMount, onLayout: this.onViewLayout, onRender: this.onViewRender }}>
              {children}
            </ViewContext.Provider>
          </ImageContext.Provider>
        </ViewShot>
      </View>
    )
  }
}

class Main extends Component {
  constructor(...args) {
    super(...args)

    const file = files[0]
    const iterator = file.examples[Symbol.iterator]()

    this.state = {
      path: file.path,
      name: file.name,
      iterator,
      example: iterator.next().value,
    }

    this.fileIndex = 0
  }

  onCapture = async (base64data) => {
    const { path, name, iterator, example } = this.state
    const result = iterator.next()

    const res = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        name,
        isDone: result.done,
        id: example.id,
        meta: example.meta(example.element),
        base64data,
      }),
      keepalive: true,
    })

    if (!res.ok) {
      throw new Error(`${res.statusText}: ${res.statusText}`)
    }

    if (result.done) {
      this.fileIndex++

      if (this.fileIndex === files.length) {
        await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/done`, {
          method: 'POST',
        })

        console.warn('DONE')

        return
      }

      const nextFile = files[this.fileIndex]
      const nextIterator = nextFile.examples[Symbol.iterator]()

      this.setState({
        path: nextFile.path,
        name: nextFile.name,
        iterator: nextIterator,
        example: nextIterator.next().value,
      })

      return
    }

    this.setState({
      path,
      name,
      iterator,
      example: result.value,
    })
  }

  render() {
    return (
      <Example
        key={`${this.state.path}:${this.state.example.id}`}
        options={this.state.example.options}
        onCapture={this.onCapture}
      >
        {this.state.example.element}
      </Example>
    )
  }
}

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
