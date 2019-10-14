import React, { Component } from 'react'
import { component, startWithType, mapRef, mapHandlers, mapState, mapWithProps, onMount, onUpdate } from 'refun'
import { View, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { captureRef } from 'react-native-view-shot' // eslint-disable-line

type TSize = {
  width: number,
  height: number,
}

type TFonts = {
  file: string,
  name: string,
  weight: number,
  isItalic: boolean,
}[]

let htmlIndex = 0

const makeHtml = (element: string, fonts: TFonts) => `
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no"/>
  <style>
    html, body {
      margin: 0;
      padding: 0;
    }
${
  fonts
    .map((font) => `@font-face {
      font-family: "${font.name}";
      font-weight: ${font.weight};
      font-style: ${font.isItalic ? 'italic' : 'normal'};
      src: url("${Platform.OS === 'android' ? `file:///android_asset/fonts/${font.file}` : font.file}");
    }`)
    .join('\n')
}
  </style>
</head>
<body>
<!-- ${htmlIndex++} -->
${element}
<script>
  (async () => {
    let size

    while(true) {
      size = document.querySelector('[data-x-ray]').getBoundingClientRect()

      if (size.width > 0 && size.height > 0) {
        break
      }

      await new Promise((resolve) => requestAnimationFrame(resolve))
    }

    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        width: size.width,
        height: size.height
      })
    )
  })()
</script>
</body>
`

export class App extends Component {
  componentDidCatch(error: any) {
    console.log(error)

    fetch('http://localhost:3002/error', {
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

const Main = component(
  startWithType<{}>(),
  mapState('html', 'setHtml', () => null as string | null, []),
  mapRef('fonts', [] as TFonts),
  onMount(({ setHtml, fonts }) => {
    (async () => {
      const fontRes = await fetch('http://localhost:3002/fonts')

      if (fontRes.status === 200) {
        fonts.current = await fontRes.json() as TFonts
      }

      const htmlRes = await fetch('http://localhost:3002/next', {
        keepalive: true,
      })

      if (!htmlRes.ok) {
        return
      }

      const html = await htmlRes.text()

      setHtml(makeHtml(html, fonts.current))
    })()
  }),
  mapState('size', 'setSize', () => null as null | TSize, []),
  mapRef('viewShotRef', null as View | null),
  mapHandlers({
    onMessage: ({ setSize }) => ({ nativeEvent: state }) => {
      const { width, height } = JSON.parse(state.data)

      if (width === 0 || height === 0) {
        throw new Error('invalid width or height')
      }

      setSize({
        width,
        height,
      })
    },
  }),
  onUpdate(async ({ size, viewShotRef, setHtml, fonts }) => {
    if (size === null) {
      return
    }

    if (viewShotRef.current === null) {
      throw new Error('invalid viewShotRef')
    }

    // avoid blank screenshots
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const data = await captureRef(viewShotRef, { result: 'base64' })

    await fetch('http://localhost:3002/upload', {
      method: 'POST',
      keepalive: true,
      body: data,
    })

    const res = await fetch('http://localhost:3002/next', {
      keepalive: true,
    })

    if (!res.ok) {
      return
    }

    if (res.status === 204) {
      return
    }

    const html = await res.text()

    setHtml(makeHtml(html, fonts.current))
  }, ['size']),
  mapWithProps(({ size }) => {
    if (size !== null) {
      return {
        width: size.width,
        height: size.height,
      }
    }

    return {}
  })
)(({ width, height, viewShotRef, html, onMessage }) => {
  if (html === null) {
    return null
  }

  if (Platform.OS === 'android') {
    return (
      <View
        key={html}
        style={{ width, height }}
        collapsable={false}
        ref={viewShotRef}
      >
        <WebView
          style={{ width, height }}
          originWhitelist={['*']}
          source={{ html }}
          cacheEnabled={false}
          scalesPageToFit={false}
          bounces={false}
          scrollEnabled={false}
          onMessage={onMessage}
        />
      </View>
    )
  }

  return (
    <View
      style={{ width, height }}
      collapsable={false}
      ref={viewShotRef}
    >
      <WebView
        style={{ width, height }}
        originWhitelist={['*']}
        source={{ baseUrl: '', html }}
        cacheEnabled={false}
        scalesPageToFit={false}
        bounces={false}
        scrollEnabled={false}
        onMessage={onMessage}
      />
    </View>
  )
})

Main.displayName = 'Main'
