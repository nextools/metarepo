const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0)

/**
 * Helper for sorting the result
 */
const relevance = (row: number[]) => {
  return sum(row) * 1000000
  + row.reduce((a, b) => Math.max(a, b), Number.MIN_VALUE) * 1000
  + row.reduce((prev, cur, idx, arr) => prev + 2 ** (arr.length - idx) * cur, 0)
}

/**
 * Criteria for sorting
 * @param a Fist element
 * @param b Second element
 */
const byRelevance = (a: number[], b: number[]) => relevance(b) - relevance(a)

const appendAnotherDimension = (totalDegree: number, oldSpacePoints: number[][]): number[][] => {
  // Append one more dimension replacing each point with (totalDegree+1) new dimensions points
  const newSpacePoints: number[][] = []
  let i = 0

  for (; i < oldSpacePoints.length; i++) {
    let value = 0

    // use all possible values to generate new points
    for (; value <= totalDegree; ++value) {
      newSpacePoints.push(oldSpacePoints[i].concat([value]))
    }
  }

  return newSpacePoints
}

const takeValidPoints = (dimensions: number, totalDegree: number): number[][] => {
  // Initialize the list of valid points to empty
  let points: number[][] = [[]]

  for (let dim = 1; dim <= dimensions; ++dim) {
    points = appendAnotherDimension(totalDegree, points)
  }

  return points.filter((point) => sum(point) <= totalDegree)
}

/**
 * Returns a matrix where each row is a exponents array for each term in the polynomial.
 * A 'exponents array' is a vector containing the powers at which the correspondent
 * independent variable must be raised
 *
 * @remarks
 *
 * This matrix is all you need in order to generate/calculate a Polynomial
 *
 * @param dimensions The number of dimensions the phase space A
 * @param degree Must be the max value the coordinates that the points of A can have
 * @returns The valid points in a `dimensions`-dimensional and `degree`ic phase space
 *
 */
export const makeExponentsArray = (dimensions: number, degree: number): number[][] => {
  // Add zero degree case
  if (degree === 0) {
    return [new Array(dimensions).fill(0)]
  }

  // Gathering the points whose sum of elements is less or equal to the given degree
  const stack = takeValidPoints(dimensions, degree)

  // On delivery be polite and give a neat, ordered list
  return stack.sort(byRelevance)
}

export default makeExponentsArray

