export const polynomial = (factors: number[]) => (x: number): number =>
  factors.reduce((total, factor, exponent) => total + factor * Math.pow(x, exponent), 0)

export const polynomialDerivative = (factors: number[]) => (x: number): number =>
  factors.reduce((total, factor, exponent) => total + factor * exponent * Math.pow(x, exponent - 1), 0)
