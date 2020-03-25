import test from 'tape'
import hsvToRgb from '../src'

test('hsvToRgb: white', (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 0,
    value: 100,
  })

  t.deepEquals(
    color,
    {
      red: 255,
      green: 255,
      blue: 255,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvToRgb: gray', (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 0,
    value: 50,
  })

  t.deepEquals(
    color,
    {
      red: 128,
      green: 128,
      blue: 128,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvToRgb: black', (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 0,
    value: 0,
  })

  t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 0,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvToRgb: red', (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 100,
    value: 100,
  })

  t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 0,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvToRgb: yellow', (t) => {
  const color = hsvToRgb({
    hue: 60,
    saturation: 100,
    value: 100,
  })

  t.deepEquals(
    color,
    {
      red: 255,
      green: 255,
      blue: 0,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvToRgb: green', (t) => {
  const color = hsvToRgb({
    hue: 120,
    saturation: 100,
    value: 100,
  })

  t.deepEquals(
    color,
    {
      red: 0,
      green: 255,
      blue: 0,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvToRgb: cyan', (t) => {
  const color = hsvToRgb({
    hue: 180,
    saturation: 100,
    value: 100,
  })

  t.deepEquals(
    color,
    {
      red: 0,
      green: 255,
      blue: 255,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvToRgb: blue', (t) => {
  const color = hsvToRgb({
    hue: 240,
    saturation: 100,
    value: 100,
  })

  t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 255,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvToRgb: purple', (t) => {
  const color = hsvToRgb({
    hue: 300,
    saturation: 100,
    value: 100,
  })

  t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 255,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hsvToRgb: some color', (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 50,
    value: 30,
  })

  t.deepEquals(
    color,
    {
      red: 77,
      green: 38,
      blue: 38,
    },
    'must turn to RGB'
  )

  t.end()
})
