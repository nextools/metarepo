import test from 'blue-tape'
import hsvaToRgba from '../src'

test('hsvaToRgba: white', async (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 0,
    value: 100,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})

test('hsvaToRgba: gray', async (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 0,
    value: 50,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 128,
      green: 128,
      blue: 128,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})

test('hsvaToRgba: black', async (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 0,
    value: 0,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})

test('hsvaToRgba: red', async (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 0,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})

test('hsvaToRgba: yellow', async (t) => {
  const color = hsvaToRgba({
    hue: 60,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 255,
      blue: 0,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})

test('hsvaToRgba: green', async (t) => {
  const color = hsvaToRgba({
    hue: 120,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 255,
      blue: 0,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})

test('hsvaToRgba: cyan', async (t) => {
  const color = hsvaToRgba({
    hue: 180,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 255,
      blue: 255,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})

test('hsvaToRgba: blue', async (t) => {
  const color = hsvaToRgba({
    hue: 240,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 0,
      green: 0,
      blue: 255,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})

test('hsvaToRgba: purple', async (t) => {
  const color = hsvaToRgba({
    hue: 300,
    saturation: 100,
    value: 100,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 0,
      blue: 255,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})

test('hsvaToRgba: some color', async (t) => {
  const color = hsvaToRgba({
    hue: 0,
    saturation: 50,
    value: 30,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      red: 77,
      green: 38,
      blue: 38,
      alpha: 0.5,
    },
    'must turn to RGB'
  )
})
