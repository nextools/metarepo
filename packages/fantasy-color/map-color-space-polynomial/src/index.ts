import { makeExponentsArray } from './exponents'

export const nInputsPolynomial = (polynomialCoefficients: number[], termPowers: number[][], variables: number[], result = 0): number => {
  if (termPowers.length === 0) {
    return result
  }

  const [currentTermPowers, ...restOfTermPowers] = termPowers
  const [currentCoefficient, ...restOfPolynomialCoefficients] = polynomialCoefficients

  let i = 0
  let product = 1
  const length = variables.length

  for (; i < length; i++) {
    product *= variables[i] ** currentTermPowers[i]
  }

  return nInputsPolynomial(
    restOfPolynomialCoefficients,
    restOfTermPowers,
    variables,
    result + (product * currentCoefficient)
  )
}

export const mapColorSpace = (coefficientMatrix: number[][], degree: number) => {
  const termPowers = makeExponentsArray(3, degree)

  return (color: [number, number, number]): [number, number, number] => [
    nInputsPolynomial(coefficientMatrix[0], termPowers, color),
    nInputsPolynomial(coefficientMatrix[1], termPowers, color),
    nInputsPolynomial(coefficientMatrix[2], termPowers, color),
  ]
}
