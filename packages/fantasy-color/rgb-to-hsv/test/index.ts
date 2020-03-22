import test from 'tape'
import rgbToHsv from '../src'

test('rgbToHsv: white', (t) => {
  const color = rgbToHsv({
    red: 255,
    green: 255,
    blue: 255,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 100,
    },
    'must turn to HSV'
  )

  t.end()
})

test('rgbToHsv: gray', (t) => {
  const color = rgbToHsv({
    red: 127,
    green: 127,
    blue: 127,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 50,
    },
    'must turn to HSV'
  )

  t.end()
})

test('rgbToHsv: black', (t) => {
  const color = rgbToHsv({
    red: 0,
    green: 0,
    blue: 0,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 0,
    },
    'must turn to HSV'
  )

  t.end()
})

test('rgbToHsv: red', (t) => {
  const color = rgbToHsv({
    red: 255,
    green: 0,
    blue: 0,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 100,
      value: 100,
    },
    'must turn to HSV'
  )

  t.end()
})

test('rgbToHsv: green', (t) => {
  const color = rgbToHsv({
    red: 0,
    green: 255,
    blue: 0,
  })

  t.deepEquals(
    color,
    {
      hue: 120,
      saturation: 100,
      value: 100,
    },
    'must turn to HSV'
  )

  t.end()
})

test('rgbToHsv: blue', (t) => {
  const color = rgbToHsv({
    red: 0,
    green: 0,
    blue: 255,
  })

  t.deepEquals(
    color,
    {
      hue: 240,
      saturation: 100,
      value: 100,
    },
    'must turn to HSV'
  )

  t.end()
})

test('rgbToHsv: purple', (t) => {
  const color = rgbToHsv({
    red: 255,
    green: 0,
    blue: 255,
  })

  t.deepEquals(
    color,
    {
      hue: 300,
      saturation: 100,
      value: 100,
    },
    'must turn to HSV'
  )

  t.end()
})

test('rgbToHsv: some color', (t) => {
  const color = rgbToHsv({
    red: 60,
    green: 32,
    blue: 23,
  })

  t.deepEquals(
    color,
    {
      hue: 15,
      saturation: 62,
      value: 24,
    },
    'must turn to HSV'
  )

  t.end()
})
