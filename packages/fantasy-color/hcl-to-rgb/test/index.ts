import test from 'blue-tape'
import hclToRgb from '../src'

test('hclToRgb: white', async (t) => {
  const color = hclToRgb({
    luminance: 100,
    chroma: 0,
    hue: 0,
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

test('hclToRgb: gray', async (t) => {
  const color = hclToRgb({
    luminance: 53.19277745493915,
    chroma: 0,
    hue: 0,
  })

  await t.deepEquals(
    color,
    {
      red: 127,
      green: 127,
      blue: 127,
    },
    'must turn to RGB'
  )
})

test('hclToRgb: black', async (t) => {
  const color = hclToRgb({
    luminance: 0,
    chroma: 0,
    hue: 0,
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

test('hclToRgb: red', async (t) => {
  const color = hclToRgb({
    hue: 40.85261277607024,
    chroma: 106.83899941284552,
    luminance: 54.29173376861782,
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

test('hclToRgb: dark red', async (t) => {
  const color = hclToRgb({
    hue: 40.85261277607024,
    chroma: 106.83899941284552,
    luminance: 24.29173376861782,
  })

  await t.deepEquals(
    color,
    {
      red: 157,
      green: -147,
      blue: -70,
    },
    'must turn to RGB'
  )
})

test('hclToRgb: green', async (t) => {
  const color = hclToRgb({
    hue: 134.39124580493436,
    chroma: 113.33973051832488,
    luminance: 87.81812823940444,
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

test('hclToRgb: blue', async (t) => {
  const color = hclToRgb({
    hue: 301.368540512089,
    chroma: 131.2070851917203,
    luminance: 29.567572863553245,
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

test('hclToRgb: purple', async (t) => {
  const color = hclToRgb({
    hue: 327.1093569922719,
    chroma: 111.40773057519527,
    luminance: 60.16969588191749,
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

test('hclToRgb: some color', async (t) => {
  const color = hclToRgb({
    hue: 42.99820879411349,
    chroma: 17.893501433259868,
    luminance: 15.966897718378611,
  })

  await t.deepEquals(
    color,
    {
      red: 60,
      green: 32,
      blue: 23,
    },
    'must turn to RGB'
  )
})
