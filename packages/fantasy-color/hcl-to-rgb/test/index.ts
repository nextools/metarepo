import test from 'tape'
import hclToRgb from '../src'

test('hclToRgb: white', (t) => {
  const color = hclToRgb({
    luminance: 100,
    chroma: 0,
    hue: 0,
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

test('hclToRgb: gray', (t) => {
  const color = hclToRgb({
    luminance: 53.19277745493915,
    chroma: 0,
    hue: 0,
  })

  t.deepEquals(
    color,
    {
      red: 127,
      green: 127,
      blue: 127,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hclToRgb: black', (t) => {
  const color = hclToRgb({
    luminance: 0,
    chroma: 0,
    hue: 0,
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

test('hclToRgb: red', (t) => {
  const color = hclToRgb({
    hue: 40.85261277607024,
    chroma: 106.83899941284552,
    luminance: 54.29173376861782,
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

test('hclToRgb: dark red', (t) => {
  const color = hclToRgb({
    hue: 40.85261277607024,
    chroma: 106.83899941284552,
    luminance: 24.29173376861782,
  })

  t.deepEquals(
    color,
    {
      red: 157,
      green: -147,
      blue: -70,
    },
    'must turn to RGB'
  )

  t.end()
})

test('hclToRgb: green', (t) => {
  const color = hclToRgb({
    hue: 134.39124580493436,
    chroma: 113.33973051832488,
    luminance: 87.81812823940444,
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

test('hclToRgb: blue', (t) => {
  const color = hclToRgb({
    hue: 301.368540512089,
    chroma: 131.2070851917203,
    luminance: 29.567572863553245,
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

test('hclToRgb: purple', (t) => {
  const color = hclToRgb({
    hue: 327.1093569922719,
    chroma: 111.40773057519527,
    luminance: 60.16969588191749,
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

test('hclToRgb: some color', (t) => {
  const color = hclToRgb({
    hue: 42.99820879411349,
    chroma: 17.893501433259868,
    luminance: 15.966897718378611,
  })

  t.deepEquals(
    color,
    {
      red: 60,
      green: 32,
      blue: 23,
    },
    'must turn to RGB'
  )

  t.end()
})
