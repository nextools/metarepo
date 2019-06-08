import test from 'blue-tape'
import rgbaToHsva from '../src'

test('rgbaToHsva: white', async (t) => {
  const color = rgbaToHsva({
    red: 255,
    green: 255,
    blue: 255,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )
})

test('rgbaToHsva: gray', async (t) => {
  const color = rgbaToHsva({
    red: 127,
    green: 127,
    blue: 127,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 50,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )
})

test('rgbaToHsva: black', async (t) => {
  const color = rgbaToHsva({
    red: 0,
    green: 0,
    blue: 0,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 0,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )
})

test('rgbaToHsva: red', async (t) => {
  const color = rgbaToHsva({
    red: 255,
    green: 0,
    blue: 0,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 100,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )
})

test('rgbaToHsva: green', async (t) => {
  const color = rgbaToHsva({
    red: 0,
    green: 255,
    blue: 0,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      hue: 120,
      saturation: 100,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )
})

test('rgbaToHsva: blue', async (t) => {
  const color = rgbaToHsva({
    red: 0,
    green: 0,
    blue: 255,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      hue: 240,
      saturation: 100,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )
})

test('rgbaToHsva: purple', async (t) => {
  const color = rgbaToHsva({
    red: 255,
    green: 0,
    blue: 255,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      hue: 300,
      saturation: 100,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )
})

test('rgbaToHsva: some color', async (t) => {
  const color = rgbaToHsva({
    red: 60,
    green: 32,
    blue: 23,
    alpha: 0.5,
  })

  await t.deepEquals(
    color,
    {
      hue: 15,
      saturation: 62,
      value: 24,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )
})
