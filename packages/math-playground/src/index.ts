export const cost = (expectation: number) => (result: number): number =>
  Math.pow(result - expectation, 2)

export const costDerivative = (expectation: number) => (result: number): number =>
  2 * (result - expectation)

export const denormalizeLinear = (topValue: number) => (value: number): number =>
  topValue * value

export const denormalizeMatrix = (topValue: number) => (matrix: number[][]): number[][] =>
  matrix.map((row) => row.map(denormalizeLinear(topValue)))

export const descentStep = (learningSpeed: number) => (slope: number): number =>
  -slope * learningSpeed

export const normalizeLinear = (topValue: number) => (value: number): number =>
  value / topValue

export const normalizeMatrix = (topValue: number) => (matrix: number[][]): number[][] =>
  matrix.map((row) => row.map(normalizeLinear(topValue)))

export const powerRuleDerivative = (exponent: number) => (value: number): number =>
  exponent * Math.pow(value, exponent - 1)

export const polynomial = (factors: number[]) => (value: number): number =>
  factors.reduce((total, factor, exponent) => total + factor * Math.pow(value, exponent), 0)

export const polynomialDerivative = (factors: number[]) => (value: number): number =>
  factors.reduce(
    (total, factor, exponent) => total + factor * powerRuleDerivative(exponent)(value),
    0
  )

