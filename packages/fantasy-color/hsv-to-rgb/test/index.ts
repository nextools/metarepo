import test from 'blue-tape'
import hsvToRgb from '../src'

test('hsvToRgb: white', async (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 0,
    value: 100,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 255,
      blue: 255,
    },
    'must turn to RGB'
  )
})

test('hsvToRgb: gray', async (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 0,
    value: 50,
  })

  await t.deepEquals(
    color,
    {
      red: 128,
      green: 128,
      blue: 128,
    },
    'must turn to RGB'
  )
})

test('hsvToRgb: black', async (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 0,
    value: 0,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 0,
    },
    'must turn to RGB'
  )
})

test('hsvToRgb: red', async (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 100,
    value: 100,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 0,
    },
    'must turn to RGB'
  )
})

test('hsvToRgb: yellow', async (t) => {
  const color = hsvToRgb({
    hue: 60,
    saturation: 100,
    value: 100,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 255,
      blue: 0,
    },
    'must turn to RGB'
  )
})

test('hsvToRgb: green', async (t) => {
  const color = hsvToRgb({
    hue: 120,
    saturation: 100,
    value: 100,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 255,
      blue: 0,
    },
    'must turn to RGB'
  )
})

test('hsvToRgb: cyan', async (t) => {
  const color = hsvToRgb({
    hue: 180,
    saturation: 100,
    value: 100,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 255,
      blue: 255,
    },
    'must turn to RGB'
  )
})

test('hsvToRgb: blue', async (t) => {
  const color = hsvToRgb({
    hue: 240,
    saturation: 100,
    value: 100,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 255,
    },
    'must turn to RGB'
  )
})

test('hsvToRgb: purple', async (t) => {
  const color = hsvToRgb({
    hue: 300,
    saturation: 100,
    value: 100,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 255,
    },
    'must turn to RGB'
  )
})

test('hsvToRgb: some color', async (t) => {
  const color = hsvToRgb({
    hue: 0,
    saturation: 50,
    value: 30,
  })

  await t.deepEquals(
    color,
    {
      red: 77,
      green: 38,
      blue: 38,
    },
    'must turn to RGB'
  )
})
