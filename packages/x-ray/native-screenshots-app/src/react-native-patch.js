const { createElement, useRef, useContext, useEffect, forwardRef } = require('react')
const ReactNative = require('react-native')
const { nanoid } = require('nanoid/non-secure')
const { ImageContext } = require('./image-context')
const { ViewContext } = require('./view-context')

const OrigImage = ReactNative.Image
const OrigView = ReactNative.View

const Image = (props) => {
  const refId = useRef()
  const context = useContext(ImageContext)

  context.onRender()

  useEffect(() => {
    refId.current = nanoid()

    context.onMount(refId.current)
  }, [])

  return createElement(OrigImage, {
    ...props,
    onLoadEnd() {
      context.onLoad(refId.current)

      if (typeof props.onLoadEnd === 'function') {
        props.onLoadEnd()
      }
    },
  })
}

Image.displayName = 'Image'

Object.defineProperty(ReactNative, 'Image', {
  configurable: true,
  get() {
    return Image
  },
})

const View = forwardRef((props, ref) => {
  const hasOnLayout = typeof props.onLayout === 'function'
  const refId = useRef()
  const context = useContext(ViewContext)

  if (hasOnLayout) {
    context.onRender()
  }

  useEffect(() => {
    if (hasOnLayout) {
      refId.current = nanoid()

      context.onMount(refId.current)
    }
  }, [])

  return createElement(OrigView, {
    ...props,
    ref,
    onLayout(e) {
      if (hasOnLayout) {
        context.onLayout(refId.current)
        props.onLayout(e)
      }
    },
  })
})

View.displayName = 'View'

Object.defineProperty(ReactNative, 'View', {
  configurable: true,
  get() {
    return View
  },
})

module.exports = ReactNative
