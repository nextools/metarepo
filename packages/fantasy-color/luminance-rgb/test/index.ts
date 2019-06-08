import test from 'blue-tape'
import luminanceRgb from '../src'

const setDecimalPointPrecision = (precision: number) => (value: number): number =>
  Math.round(value * (10 ** precision)) / (10 ** precision)

const roundTo10DecimalPoints = setDecimalPointPrecision(10)

test('luminance-rgb: white', async (t) => {
  const luminance = luminanceRgb({
    red: 255,
    green: 255,
    blue: 255,
  })

  await t.deepEquals(
    luminance,
    1,
    'must return the luminance'
  )
})

test('luminance-rgb: grey', async (t) => {
  const luminance = luminanceRgb({
    red: 128,
    green: 128,
    blue: 128,
  })

  await t.deepEquals(
    // rounding is necessary for platform inconsistencies
    // https://travis-ci.org/bubble-dev/_/jobs/542343083#L3182
    roundTo10DecimalPoints(luminance),
    0.2158605001,
    'must return the luminance'
  )
})

test('luminance-rgb: black', async (t) => {
  const luminance = luminanceRgb({
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

test('luminance-rgb: red', async (t) => {
  const luminance = luminanceRgb({
    red: 255,
    green: 0,
    blue: 0,
  })

  await t.deepEquals(
    luminance,
    0.2126,
    'must return the luminance'
  )
})

test('luminance-rgb: green', async (t) => {
  const luminance = luminanceRgb({
    red: 0,
    green: 255,
    blue: 0,
  })

  await t.deepEquals(
    luminance,
    0.7152,
    'must return the luminance'
  )
})

test('luminance-rgb: blue', async (t) => {
  const luminance = luminanceRgb({
    red: 0,
    green: 0,
    blue: 255,
  })

  await t.deepEquals(
    luminance,
    0.0722,
    'must return the luminance'
  )
})

test('luminance-rgb: intermediate', async (t) => {
  const luminance = luminanceRgb({
    red: 255,
    green: 65,
    blue: 30,
  })

  await t.deepEquals(
    luminance,
    0.25134330968608337,
    'must return the luminance'
  )
})

test('luminance-rgb: dark color', async (t) => {
  const luminance = luminanceRgb({
    red: 25,
    green: 2,
    blue: 1,
  })

  await t.deepEquals(
    // rounding is necessary for platform inconsistencies
    // https://travis-ci.org/bubble-dev/_/jobs/542343083#L3201
    roundTo10DecimalPoints(luminance),
    0.0025228104,
    'must return the luminance'
  )
})
