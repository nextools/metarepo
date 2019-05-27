export const cost = (expectation: number) => (result: number): number =>
  Math.pow(result - expectation, 2)

export const costDerivative = (expectation: number) => (result: number): number =>
  2 * (result - expectation)

export const powerRuleDerivative = (exponent: number) => (value: number): number =>
  exponent * Math.pow(value, exponent - 1)

export const polynomial = (factors: number[]) => (x: number): number =>
  factors.reduce((total, factor, exponent) => total + factor * Math.pow(x, exponent), 0)

export const polynomialDerivative = (factors: number[]) => (value: number): number =>
  factors.reduce(
    (total, factor, exponent) => total + factor * powerRuleDerivative(exponent)(value),
    0
  )

