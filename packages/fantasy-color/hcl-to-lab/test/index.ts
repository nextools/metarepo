import test from 'blue-tape'
import hclToLab from '../src'

test('hclToLab: white', async (t) => {
  const color = hclToLab({
    luminance: 100,
    chroma: 0,
    hue: 0,
  })

  await t.deepEquals(
    color,
    {
      luminance: 100,
      a: 0,
      b: 0,
    },
    'must turn to LAB'
  )
})

test('hclToLab: gray', async (t) => {
  const color = hclToLab({
    luminance: 53.19277745493915,
    chroma: 0,
    hue: 0,
  })

  await t.deepEquals(
    color,
    {
      luminance: 53.19277745493915,
      a: 0,
      b: 0,
    },
    'must turn to LAB'
  )
})

test('hclToLab: black', async (t) => {
  const color = hclToLab({
    luminance: 0,
    chroma: 0,
    hue: 0,
  })

  await t.deepEquals(
    color,
    {
      luminance: 0,
      a: 0,
      b: 0,
    },
    'must turn to LAB'
  )
})

test('hclToLab: red', async (t) => {
  const color = hclToLab({
    hue: 40.85261277607024,
    chroma: 106.83899941284552,
    luminance: 54.29173376861782,
  })

  await t.deepEquals(
    color,
    {
      luminance: 54.29173376861782,
      a: 80.8124553179771,
      b: 69.88504032350531,
    },
    'must turn to LAB'
  )
})

test('hclToLab: dark red', async (t) => {
  const color = hclToLab({
    hue: 40.85261277607024,
    chroma: 106.83899941284552,
    luminance: 24.29173376861782,
  })

  await t.deepEquals(
    color,
    {
      luminance: 24.29173376861782,
      a: 80.8124553179771,
      b: 69.88504032350531,
    },
    'must turn to LAB'
  )
})

test('hclToLab: green', async (t) => {
  const color = hclToLab({
    hue: 134.39124580493436,
    chroma: 113.33973051832488,
    luminance: 87.81812823940444,
  })

  await t.deepEquals(
    color,
    {
      luminance: 87.81812823940444,
      a: -79.28728092989572,
      b: 80.99025618375522,
    },
    'must turn to LAB'
  )
})

test('hclToLab: blue', async (t) => {
  const color = hclToLab({
    hue: 301.368540512089,
    chroma: 131.2070851917203,
    luminance: 29.567572863553245,
  })

  await t.deepEquals(
    color,
    {
      luminance: 29.567572863553245,
      a: 68.29865326565665,
      b: -112.02942991288029,
    },
    'must turn to LAB'
  )
})

test('hclToLab: purple', async (t) => {
  const color = hclToLab({
    hue: 327.1093569922719,
    chroma: 111.40773057519527,
    luminance: 60.16969588191749,
  })

  await t.deepEquals(
    color,
    {
      luminance: 60.16969588191749,
      a: 93.5500249398082,
      b: -60.49855589744735,
    },
    'must turn to LAB'
  )
})

test('hclToLab: some color', async (t) => {
  const color = hclToLab({
    hue: 42.99820879411349,
    chroma: 17.893501433259868,
    luminance: 15.966897718378611,
  })

  await t.deepEquals(
    color,
    {
      luminance: 15.966897718378611,
      a: 13.086860007892996,
      b: 12.202929512042747,
    },
    'must turn to LAB'
  )
})
