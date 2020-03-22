import test from 'tape'
import {
  cost,
  costDerivative,
  denormalizeLinear,
  denormalizeMatrix,
  descentStep,
  normalizeLinear,
  normalizeMatrix,
  polynomial,
  polynomialDerivative,
  powerRuleDerivative,
} from '../src'

test('math-playground:polynomial: constant', (t) => {
  t.deepEquals(
    polynomial([2])(5),
    2,
    'should be 2'
  )

  t.deepEquals(
    polynomial([2])(10),
    2,
    'should be 2'
  )

  t.end()
})

test('math-playground:polynomial: linear', (t) => {
  t.deepEquals(
    polynomial([1, 2])(5),
    11,
    'should be 11'
  )

  t.deepEquals(
    polynomial([-1, 2])(4),
    7,
    'should be 7'
  )

  t.end()
})

test('math-playground:polynomial: quadratic', (t) => {
  t.deepEquals(
    polynomial([1, 0, 2])(5),
    51,
    'should be 51'
  )

  t.deepEquals(
    polynomial([-1, 2, 3])(4),
    55,
    'should be 55'
  )

  t.end()
})

test('math-playground:polynomial: cubic', (t) => {
  t.deepEquals(
    polynomial([1, 0, 2, 1])(5),
    176,
    'should be 176'
  )

  t.deepEquals(
    polynomial([-1, 2, 3, 1.5])(4),
    151,
    'should be 151'
  )

  t.end()
})

test('math-playground:polynomialDerivative: constant', (t) => {
  t.deepEquals(
    polynomialDerivative([2])(5),
    0,
    'should be 0'
  )

  t.deepEquals(
    polynomialDerivative([2])(10),
    0,
    'should be 0'
  )

  t.end()
})

test('math-playground:polynomialDerivative: linear', (t) => {
  t.deepEquals(
    polynomialDerivative([1, 2])(5),
    2,
    'should be 2'
  )

  t.deepEquals(
    polynomialDerivative([-1, 4])(4),
    4,
    'should be 4'
  )

  t.end()
})

test('math-playground:polynomialDerivative: quadratic', (t) => {
  t.deepEquals(
    polynomialDerivative([1, 0, 2])(5),
    20,
    'should be 20'
  )

  t.deepEquals(
    polynomialDerivative([-1, 2, 3])(4),
    26,
    'should be 26'
  )

  t.end()
})

test('math-playground:polynomialDerivative: cubic', (t) => {
  t.deepEquals(
    polynomialDerivative([1, 0, 2, 1])(5),
    95,
    'should be 95'
  )

  t.deepEquals(
    polynomialDerivative([-1, 2, 3, 1.5])(4),
    98,
    'should be 98'
  )

  t.end()
})

test('math-playground:cost', (t) => {
  t.deepEquals(
    cost(1)(0.5),
    0.25,
    'should be 0.25'
  )

  t.deepEquals(
    cost(0.5)(0.25),
    0.0625,
    'should be 0.0625'
  )

  t.end()
})

test('math-playground:costDerivative', (t) => {
  t.deepEquals(
    costDerivative(1)(0.5),
    -1,
    'should be -1'
  )

  t.deepEquals(
    costDerivative(0.5)(0.25),
    -0.5,
    'should be -0.5'
  )

  t.end()
})

test('math-playground:powerRuleDerivative', (t) => {
  t.deepEquals(
    powerRuleDerivative(0)(5),
    0,
    'should be 0'
  )

  t.deepEquals(
    powerRuleDerivative(1)(3),
    1,
    'should be 1'
  )

  t.deepEquals(
    powerRuleDerivative(2)(3),
    6,
    'should be 6'
  )

  t.deepEquals(
    powerRuleDerivative(5)(3),
    405,
    'should be 405'
  )

  t.end()
})

test('math-playground:normalizeLinear', (t) => {
  t.deepEquals(
    normalizeLinear(100)(50),
    0.5,
    'should be 0.5'
  )

  t.deepEquals(
    normalizeLinear(30)(15),
    0.5,
    'should be 0.5'
  )

  t.end()
})

test('math-playground:denormalizeLinear', (t) => {
  t.deepEquals(
    denormalizeLinear(100)(0.75),
    75,
    'should be 75'
  )

  t.deepEquals(
    denormalizeLinear(30)(0.3),
    9,
    'should be 9'
  )

  t.end()
})

test('math-playground:descentStep', (t) => {
  t.deepEquals(
    descentStep(0.3)(40),
    -12,
    'should be -12'
  )

  t.deepEquals(
    descentStep(0.03)(0.3),
    -0.009,
    'should be -0.009'
  )

  t.end()
})

test('math-playground:normalizeMatrix', (t) => {
  t.deepEquals(
    normalizeMatrix(400)([[40, 80], [160, 200]]),
    [[0.1, 0.2], [0.4, 0.5]],
    'should be [[0.1, 0.2], [0.4, 0.5]]'
  )

  t.deepEquals(
    normalizeMatrix(150)([[15, 30], [90, 105]]),
    [[0.1, 0.2], [0.6, 0.7]],
    'should be [[0.1, 0.2], [0.6, 0.7]]'
  )

  t.end()
})

test('math-playground:denormalizeMatrix', (t) => {
  t.deepEquals(
    denormalizeMatrix(400)([[0.1, 0.2], [0.4, 0.5]]),
    [[40, 80], [160, 200]],
    'should be [[40, 80], [160, 200]]'
  )

  t.deepEquals(
    denormalizeMatrix(150)([[0.1, 0.2], [0.6, 0.7]]),
    [[15, 30], [90, 105]],
    'should be [[15, 30], [90, 105]]'
  )

  t.end()
})

