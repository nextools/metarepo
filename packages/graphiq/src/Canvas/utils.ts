
import type { TPoint } from './types'

export const getPastMonthsDate = (monthsAgo: number): Date => {
  const date = new Date()

  date.setMonth(date.getMonth() - monthsAgo)

  return date
}

export const pointsToString = (points: readonly TPoint[]): string => {
  return points.length === 1
    ? `${points[0].x}, ${points[0].y} ${points[0].x}, ${points[0].y}`
    : points.map(({ x, y }) => `${x}, ${y}`).join(' ')
}
