import test from 'blue-tape'
import {
  cost,
  costDerivative,
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

