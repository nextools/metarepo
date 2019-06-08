import test from 'blue-tape'
import labToHcl from '../src'

test('labToHcl: white', async (t) => {
  const color = labToHcl({
    luminance: 100,
    a: 0,
    b: 0,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      chroma: 0,
      luminance: 100,
    },
    'must turn to HCL'
  )
})

test('labToHcl: gray', async (t) => {
  const color = labToHcl({
    luminance: 53.19277745493915,
    a: 0,
    b: 0,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      chroma: 0,
      luminance: 53.19277745493915,
    },
    'must turn to HCL'
  )
})

test('labToHcl: black', async (t) => {
  const color = labToHcl({
    luminance: 0,
    a: 0,
    b: 0,
  })

  await t.deepEquals(
    color,
    {
      hue: 0,
      chroma: 0,
      luminance: 0,
    },
    'must turn to HCL'
  )
})

test('labToHcl: red', async (t) => {
  const color = labToHcl({
    luminance: 54.29173376861782,
    a: 80.8124553179771,
    b: 69.88504032350531,
  })

  await t.deepEquals(
    color,
    {
      hue: 40.85261277607024,
      chroma: 106.83899941284552,
      luminance: 54.29173376861782,
    },
    'must turn to HCL'
  )
})

test('labToHcl: dark red', async (t) => {
  const color = labToHcl({
    luminance: 24.29173376861782,
    a: 80.8124553179771,
    b: 69.88504032350531,
  })

  await t.deepEquals(
    color,
    {
      hue: 40.85261277607024,
      chroma: 106.83899941284552,
      luminance: 24.29173376861782,
    },
    'must turn to HCL'
  )
})

test('labToHcl: green', async (t) => {
  const color = labToHcl({
    luminance: 87.81812823940444,
    a: -79.28728092989567,
    b: 80.99025618375525,
  })

  await t.deepEquals(
    color,
    {
      hue: 134.39124580493436,
      chroma: 113.33973051832488,
      luminance: 87.81812823940444,
    },
    'must turn to HCL'
  )
})

test('labToHcl: blue', async (t) => {
  const color = labToHcl({
    luminance: 29.567572863553245,
    a: 68.29865326565671,
    b: -112.02942991288025,
  })

  await t.deepEquals(
    color,
    {
      hue: 301.368540512089,
      chroma: 131.2070851917203,
      luminance: 29.567572863553245,
    },
    'must turn to HCL'
  )
})

test('labToHcl: purple', async (t) => {
  const color = labToHcl({
    luminance: 60.16969588191749,
    a: 93.55002493980824,
    b: -60.498555897447304,
  })

  await t.deepEquals(
    color,
    {
      hue: 327.1093569922719,
      chroma: 111.40773057519527,
      luminance: 60.16969588191749,
    },
    'must turn to HCL'
  )
})

test('labToHcl: some color', async (t) => {
  const color = labToHcl({
    luminance: 15.966897718378611,
    a: 13.086860007892998,
    b: 12.202929512042749,
  })

  await t.deepEquals(
    color,
    {
      hue: 42.99820879411349,
      chroma: 17.893501433259868,
      luminance: 15.966897718378611,
    },
    'must turn to HCL'
  )
})
