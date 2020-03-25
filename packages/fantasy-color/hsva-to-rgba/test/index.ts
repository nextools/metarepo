import test from 'tape'
import hsvaToRgba from '../src'

test('hsvaToRgba: white', (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 0,
    value: 100,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvaToRgba: gray', (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 0,
    value: 50,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 128,
      green: 128,
      blue: 128,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvaToRgba: black', (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 0,
    value: 0,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvaToRgba: red', (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 0,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvaToRgba: yellow', (t) => {
  const color = hsvaToRgba({
    hue: 60,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 255,
      green: 255,
      blue: 0,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvaToRgba: green', (t) => {
  const color = hsvaToRgba({
    hue: 120,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 0,
      green: 255,
      blue: 0,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvaToRgba: cyan', (t) => {
  const color = hsvaToRgba({
    hue: 180,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 0,
      green: 255,
      blue: 255,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvaToRgba: blue', (t) => {
  const color = hsvaToRgba({
    hue: 240,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 255,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvaToRgba: purple', (t) => {
  const color = hsvaToRgba({
    hue: 300,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 255,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvaToRgba: some color', (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 50,
    value: 30,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      red: 77,
      green: 38,
      blue: 38,
      alpha: 0.5,
    },
    'must turn to RGB'
  )

  t.end()
})
