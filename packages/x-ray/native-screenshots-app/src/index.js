/* eslint-disable no-invalid-this */
import React, { Component, Fragment } from 'react'
import { View } from 'react-native'
import ViewShot from 'react-native-view-shot'
import { ImageContext } from './image-context'
import { ViewContext } from './view-context'
import './react-native-patch'
import { files, screenshotsConcurrency } from './meta'

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
  }

  async componentDidMount() {
    if (!this.props.options.shouldWaitForImages && !this.props.options.shouldWaitForViews) {
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

  onImageMount = (id) => {
    this.imageIds.add(id)
  }

  onImageLoad = async (id) => {
    this.imageIds.delete(id)

    if (this.imageIds.size === 0) {
      if (this.props.options.shouldWaitForViews && this.viewIds.size > 0) {
        return
      }

      await this.onCapture()
    }
  }

  onViewMount = (id) => {
    this.viewIds.add(id)
  }

  onViewLayout = async (id) => {
    this.viewIds.delete(id)

    if (this.viewIds.size === 0) {
      if (this.props.options.shouldWaitForImages && this.imageIds.size > 0) {
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
          <ImageContext.Provider value={{ onMount: this.onImageMount, onLoad: this.onImageLoad }}>
            <ViewContext.Provider value={{ onMount: this.onViewMount, onLayout: this.onViewLayout }}>
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

    this.state = {
      paths: {},
    }

    for (let i = 0; i < screenshotsConcurrency; i++) {
      const file = files[i]
      const iterator = file.examples[Symbol.iterator]()

      this.state.paths[file.path] = {
        name: file.name,
        iterator,
        example: iterator.next().value,
      }
    }

    this.fileIndex = screenshotsConcurrency - 1
    this.filesInProgressCount = screenshotsConcurrency
  }

  onCapture = (path) => async (base64data) => {
    const { iterator, example, name } = this.state.paths[path]
    const result = iterator.next()

    const res = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/upload?path=${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isDone: result.done,
        path,
        name,
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

      this.setState((state) => {
        Reflect.deleteProperty(state.paths, path)

        return ({
          paths: {
            ...state.paths,
            [nextFile.path]: {
              iterator: nextIterator,
              name: nextFile.name,
              example: nextIterator.next().value,
            },
          },
        })
      })

      return
    }

    this.setState((state) => ({
      paths: {
        ...this.state.paths,
        [path]: {
          ...state.paths[path],
          example: result.value,
        },
      },
    }))
  }

  render() {
    return (
      <Fragment>
        {
          Object.entries(this.state.paths).map(([path, value]) => (
            <Example
              key={`${path}:${value.example.id}`}
              options={value.example.options}
              onCapture={this.onCapture(path)}
            >
              {value.example.element}
            </Example>
          ))
        }
      </Fragment>
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
