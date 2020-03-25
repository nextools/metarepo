import test from 'tape'
import luminanceRgb from '../src'

const setDecimalPointPrecision = (precision: number) => (value: number): number =>
  Math.round(value * (10 ** precision)) / (10 ** precision)

const roundTo10DecimalPoints = setDecimalPointPrecision(10)

test('luminance-rgb: white', (t) => {
  const luminance = luminanceRgb({
    red: 255,
    green: 255,
    blue: 255,
  })

  t.deepEquals(
    luminance,
    1,
    'must return the luminance'
  )

  t.end()
})

test('luminance-rgb: grey', (t) => {
  const luminance = luminanceRgb({
    red: 128,
    green: 128,
    blue: 128,
  })

  t.deepEquals(
    // rounding is necessary for platform inconsistencies
    // https://travis-ci.org/bubble-dev/_/jobs/542343083#L3182
    roundTo10DecimalPoints(luminance),
    0.2158605001,
    'must return the luminance'
  )

  t.end()
})

test('luminance-rgb: black', (t) => {
  const luminance = luminanceRgb({
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

test('luminance-rgb: red', (t) => {
  const luminance = luminanceRgb({
    red: 255,
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

test('luminance-rgb: green', (t) => {
  const luminance = luminanceRgb({
    red: 0,
    green: 255,
    blue: 0,
  })

  t.deepEquals(
    luminance,
    0.7152,
    'must return the luminance'
  )

  t.end()
})

test('luminance-rgb: blue', (t) => {
  const luminance = luminanceRgb({
    red: 0,
    green: 0,
    blue: 255,
  })

  t.deepEquals(
    luminance,
    0.0722,
    'must return the luminance'
  )

  t.end()
})

test('luminance-rgb: intermediate', (t) => {
  const luminance = luminanceRgb({
    red: 255,
    green: 65,
    blue: 30,
  })

  t.deepEquals(
    luminance,
    0.25134330968608337,
    'must return the luminance'
  )

  t.end()
})

test('luminance-rgb: dark color', (t) => {
  const luminance = luminanceRgb({
    red: 25,
    green: 2,
    blue: 1,
  })

  t.deepEquals(
    // rounding is necessary for platform inconsistencies
    // https://travis-ci.org/bubble-dev/_/jobs/542343083#L3201
    roundTo10DecimalPoints(luminance),
    0.0025228104,
    'must return the luminance'
  )

  t.end()
})
