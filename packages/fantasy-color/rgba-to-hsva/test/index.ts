import test from 'tape'
import rgbaToHsva from '../src'

test('rgbaToHsva: white', (t) => {
  const color = rgbaToHsva({
    red: 255,
    green: 255,
    blue: 255,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )

  t.end()
})

test('rgbaToHsva: gray', (t) => {
  const color = rgbaToHsva({
    red: 127,
    green: 127,
    blue: 127,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 50,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )

  t.end()
})

test('rgbaToHsva: black', (t) => {
  const color = rgbaToHsva({
    red: 0,
    green: 0,
    blue: 0,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 0,
      value: 0,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )

  t.end()
})

test('rgbaToHsva: red', (t) => {
  const color = rgbaToHsva({
    red: 255,
    green: 0,
    blue: 0,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      saturation: 100,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )

  t.end()
})

test('rgbaToHsva: green', (t) => {
  const color = rgbaToHsva({
    red: 0,
    green: 255,
    blue: 0,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      hue: 120,
      saturation: 100,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )

  t.end()
})

test('rgbaToHsva: blue', (t) => {
  const color = rgbaToHsva({
    red: 0,
    green: 0,
    blue: 255,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      hue: 240,
      saturation: 100,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )

  t.end()
})

test('rgbaToHsva: purple', (t) => {
  const color = rgbaToHsva({
    red: 255,
    green: 0,
    blue: 255,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      hue: 300,
      saturation: 100,
      value: 100,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )

  t.end()
})

test('rgbaToHsva: some color', (t) => {
  const color = rgbaToHsva({
    red: 60,
    green: 32,
    blue: 23,
    alpha: 0.5,
  })

  t.deepEquals(
    color,
    {
      hue: 15,
      saturation: 62,
      value: 24,
      alpha: 0.5,
    },
    'must turn to HSVA'
  )

  t.end()
})
