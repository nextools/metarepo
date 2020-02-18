export const setDate = (date: Date, day: number): Date => {
  const result = new Date(date)

  result.setDate(day)

  return result
}
