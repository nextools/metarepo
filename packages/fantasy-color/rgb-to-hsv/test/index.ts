import test from 'blue-tape'
import rgbToHsv from '../src'

test('rgbToHsv: white', async (t) => {
  const color = rgbToHsv({
    red: 255,
    green: 255,
    blue: 255,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 100,
    },
    'must turn to HSV'
  )
})

test('rgbToHsv: gray', async (t) => {
  const color = rgbToHsv({
    red: 127,
    green: 127,
    blue: 127,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 50,
    },
    'must turn to HSV'
  )
})

test('rgbToHsv: black', async (t) => {
  const color = rgbToHsv({
    red: 0,
    green: 0,
    blue: 0,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 0,
    },
    'must turn to HSV'
  )
})

test('rgbToHsv: red', async (t) => {
  const color = rgbToHsv({
    red: 255,
    green: 0,
    blue: 0,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 100,
      value: 100,
    },
    'must turn to HSV'
  )
})

test('rgbToHsv: green', async (t) => {
  const color = rgbToHsv({
    red: 0,
    green: 255,
    blue: 0,
  })

  await t.deepEquals(
    color,
    {
      hue: 120,
      saturation: 100,
      value: 100,
    },
    'must turn to HSV'
  )
})

test('rgbToHsv: blue', async (t) => {
  const color = rgbToHsv({
    red: 0,
    green: 0,
    blue: 255,
  })

  await t.deepEquals(
    color,
    {
      hue: 240,
      saturation: 100,
      value: 100,
    },
    'must turn to HSV'
  )
})

test('rgbToHsv: purple', async (t) => {
  const color = rgbToHsv({
    red: 255,
    green: 0,
    blue: 255,
  })

  await t.deepEquals(
    color,
    {
      hue: 300,
      saturation: 100,
      value: 100,
    },
    'must turn to HSV'
  )
})

test('rgbToHsv: some color', async (t) => {
  const color = rgbToHsv({
    red: 60,
    green: 32,
    blue: 23,
  })

  await t.deepEquals(
    color,
    {
      hue: 15,
      saturation: 62,
      value: 24,
    },
    'must turn to HSV'
  )
})
