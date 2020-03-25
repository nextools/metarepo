import test from 'tape'
import rgbToLab from '../src'

test('rgbToLab: white', (t) => {
  const color = rgbToLab({
    red: 255,
    green: 255,
    blue: 255,
  })

  t.deepEquals(
    color,
    {
      luminance: 100,
      a: 0,
      b: 0,
    },
    'must turn to LAB'
  )

  t.end()
})

test('rgbToLab: gray', (t) => {
  const color = rgbToLab({
    red: 127,
    green: 127,
    blue: 127,
  })

  t.deepEquals(
    color,
    {
      luminance: 53.19277745493915,
      a: 0,
      b: 0,
    },
    'must turn to LAB'
  )

  t.end()
})

test('rgbToLab: black', (t) => {
  const color = rgbToLab({
    red: 0,
    green: 0,
    blue: 0,
  })

  t.deepEquals(
    color,
    {
      luminance: 0,
      a: 0,
      b: 0,
    },
    'must turn to LAB'
  )

  t.end()
})

test('rgbToLab: red', (t) => {
  const color = rgbToLab({
    red: 255,
    green: 0,
    blue: 0,
  })

  t.deepEquals(
    color,
    {
      luminance: 54.29173376861782,
      a: 80.8124553179771,
      b: 69.88504032350531,
    },
    'must turn to LAB'
  )

  t.end()
})

test('rgbToLab: green', (t) => {
  const color = rgbToLab({
    red: 0,
    green: 255,
    blue: 0,
  })

  t.deepEquals(
    color,
    {
      luminance: 87.81812823940444,
      a: -79.28728092989567,
      b: 80.99025618375525,
    },
    'must turn to LAB'
  )

  t.end()
})

test('rgbToLab: blue', (t) => {
  const color = rgbToLab({
    red: 0,
    green: 0,
    blue: 255,
  })

  t.deepEquals(
    color,
    {
      luminance: 29.567572863553245,
      a: 68.29865326565671,
      b: -112.02942991288025,
    },
    'must turn to LAB'
  )

  t.end()
})

test('rgbToLab: purple', (t) => {
  const color = rgbToLab({
    red: 255,
    green: 0,
    blue: 255,
  })

  t.deepEquals(
    color,
    {
      luminance: 60.16969588191749,
      a: 93.55002493980824,
      b: -60.498555897447304,
    },
    'must turn to LAB'
  )

  t.end()
})

test('rgbToLab: some color', (t) => {
  const color = rgbToLab({
    red: 60,
    green: 32,
    blue: 23,
  })

  t.deepEquals(
    color,
    {
      luminance: 15.966897718378611,
      a: 13.086860007892998,
      b: 12.202929512042749,
    },
    'must turn to LAB'
  )

  t.end()
})
