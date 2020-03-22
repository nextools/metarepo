import test from 'tape'
import luminanceSrgb from '../src'

test('luminance-srgb: white', (t) => {
  const luminance = luminanceSrgb({
    red: 1,
    green: 1,
    blue: 1,
  })

  t.deepEquals(
    luminance,
    1,
    'must return the luminance'
  )

  t.end()
})

test('luminance-srgb: grey', (t) => {
  const luminance = luminanceSrgb({
    red: 0.5,
    green: 0.5,
    blue: 0.5,
  })

  t.deepEquals(
    luminance,
    0.5,
    'must return the luminance'
  )

  t.end()
})

test('luminance-srgb: black', (t) => {
  const luminance = luminanceSrgb({
    red: 0,
    green: 0,
    blue: 0,
  })

  t.deepEquals(
    luminance,
    0,
    'must return the luminance'
  )

  t.end()
})

test('luminance-srgb: red', (t) => {
  const luminance = luminanceSrgb({
    red: 1,
    green: 0,
    blue: 0,
  })

  t.deepEquals(
    luminance,
    0.2126,
    'must return the luminance'
  )

  t.end()
})

test('luminance-srgb: green', (t) => {
  const luminance = luminanceSrgb({
    red: 0,
    green: 1,
    blue: 0,
  })

  t.deepEquals(
    luminance,
    0.7152,
    'must return the luminance'
  )

  t.end()
})

test('luminance-srgb: blue', (t) => {
  const luminance = luminanceSrgb({
    red: 0,
    green: 0,
    blue: 1,
  })

  t.deepEquals(
    luminance,
    0.0722,
    'must return the luminance'
  )

  t.end()
})

test('luminance-srgb: intermediate', (t) => {
  const luminance = luminanceSrgb({
    red: 1,
    green: 0.27,
    blue: 0.2,
  })

  t.deepEquals(
    luminance,
    0.420144,
    'must return the luminance'
  )

  t.end()
})

test('luminance-srgb: dark color', (t) => {
  const luminance = luminanceSrgb({
    red: 0.1,
    green: 0.02,
    blue: 0.01,
  })

  t.deepEquals(
    luminance,
    0.036286,
    'must return the luminance'
  )

  t.end()
})
