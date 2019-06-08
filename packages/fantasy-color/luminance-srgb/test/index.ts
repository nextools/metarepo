import test from 'blue-tape'
import luminanceSrgb from '../src'

test('luminance-srgb: white', async (t) => {
  const luminance = luminanceSrgb({
    red: 1,
    green: 1,
    blue: 1,
  })

  await t.deepEquals(
    luminance,
    1,
    'must return the luminance'
  )
})

test('luminance-srgb: grey', async (t) => {
  const luminance = luminanceSrgb({
    red: 0.5,
    green: 0.5,
    blue: 0.5,
  })

  await t.deepEquals(
    luminance,
    0.5,
    'must return the luminance'
  )
})

test('luminance-srgb: black', async (t) => {
  const luminance = luminanceSrgb({
    red: 0,
    green: 0,
    blue: 0,
  })

  await t.deepEquals(
    luminance,
    0,
    'must return the luminance'
  )
})

test('luminance-srgb: red', async (t) => {
  const luminance = luminanceSrgb({
    red: 1,
    green: 0,
    blue: 0,
  })

  await t.deepEquals(
    luminance,
    0.2126,
    'must return the luminance'
  )
})

test('luminance-srgb: green', async (t) => {
  const luminance = luminanceSrgb({
    red: 0,
    green: 1,
    blue: 0,
  })

  await t.deepEquals(
    luminance,
    0.7152,
    'must return the luminance'
  )
})

test('luminance-srgb: blue', async (t) => {
  const luminance = luminanceSrgb({
    red: 0,
    green: 0,
    blue: 1,
  })

  await t.deepEquals(
    luminance,
    0.0722,
    'must return the luminance'
  )
})

test('luminance-srgb: intermediate', async (t) => {
  const luminance = luminanceSrgb({
    red: 1,
    green: 0.27,
    blue: 0.2,
  })

  await t.deepEquals(
    luminance,
    0.420144,
    'must return the luminance'
  )
})

test('luminance-srgb: dark color', async (t) => {
  const luminance = luminanceSrgb({
    red: 0.1,
    green: 0.02,
    blue: 0.01,
  })

  await t.deepEquals(
    luminance,
    0.036286,
    'must return the luminance'
  )
})
