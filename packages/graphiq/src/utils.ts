export const getPastMonthsDate = (monthsAgo: number): Date => {
  const date = new Date()

  date.setMonth(date.getMonth() - monthsAgo)

  return date
}
