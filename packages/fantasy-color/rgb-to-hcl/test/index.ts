import test from 'tape'
import rgbToHcl from '../src'

test('rgbToHcl: white', (t) => {
  const color = rgbToHcl({
    red: 255,
    green: 255,
    blue: 255,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      chroma: 0,
      luminance: 100,
    },
    'must turn to HCL'
  )

  t.end()
})

test('rgbToHcl: gray', (t) => {
  const color = rgbToHcl({
    red: 127,
    green: 127,
    blue: 127,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      chroma: 0,
      luminance: 53.19277745493915,
    },
    'must turn to HCL'
  )

  t.end()
})

test('rgbToHcl: black', (t) => {
  const color = rgbToHcl({
    red: 0,
    green: 0,
    blue: 0,
  })

  t.deepEquals(
    color,
    {
      hue: 0,
      chroma: 0,
      luminance: 0,
    },
    'must turn to HCL'
  )

  t.end()
})

test('rgbToHcl: red', (t) => {
  const color = rgbToHcl({
    red: 255,
    green: 0,
    blue: 0,
  })

  t.deepEquals(
    color,
    {
      hue: 40.85261277607024,
      chroma: 106.83899941284552,
      luminance: 54.29173376861782,
    },
    'must turn to HCL'
  )

  t.end()
})

test('rgbToHcl: green', (t) => {
  const color = rgbToHcl({
    red: 0,
    green: 255,
    blue: 0,
  })

  t.deepEquals(
    color,
    {
      hue: 134.39124580493436,
      chroma: 113.33973051832488,
      luminance: 87.81812823940444,
    },
    'must turn to HCL'
  )

  t.end()
})

test('rgbToHcl: blue', (t) => {
  const color = rgbToHcl({
    red: 0,
    green: 0,
    blue: 255,
  })

  t.deepEquals(
    color,
    {
      hue: 301.368540512089,
      chroma: 131.2070851917203,
      luminance: 29.567572863553245,
    },
    'must turn to HCL'
  )

  t.end()
})

test('rgbToHcl: purple', (t) => {
  const color = rgbToHcl({
    red: 255,
    green: 0,
    blue: 255,
  })

  t.deepEquals(
    color,
    {
      hue: 327.1093569922719,
      chroma: 111.40773057519527,
      luminance: 60.16969588191749,
    },
    'must turn to HCL'
  )

  t.end()
})

test('rgbToHcl: some color', (t) => {
  const color = rgbToHcl({
    red: 60,
    green: 32,
    blue: 23,
  })

  t.deepEquals(
    color,
    {
      hue: 42.99820879411349,
      chroma: 17.893501433259868,
      luminance: 15.966897718378611,
    },
    'must turn to HCL'
  )

  t.end()
})
