import { addDays } from './add-days'
import { setDate } from './set-date'

const DAYS_IN_WEEK = 7

type TOptions = {
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6,
}

export const getCalendarMonth = (date: Date, options?: TOptions): Date[][] => {
  const { firstDayOfWeek } = {
    firstDayOfWeek: 1,
    ...options,
  }
  const firstDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const firstWeekdayOfMonth = firstDateOfMonth.getDay()
  const lastWeekdayOfMonth = lastDateOfMonth.getDay()
  const daysInMonth = lastDateOfMonth.getDate()
  const daysToPrepend = (firstWeekdayOfMonth - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK
  const daysToAppend = (DAYS_IN_WEEK - 1 - lastWeekdayOfMonth + firstDayOfWeek) % DAYS_IN_WEEK
  const month: Date[][] = []
  let week: Date[] = []

  for (let i = 1 - daysToPrepend; i <= daysInMonth + daysToAppend + 1; i++) {
    if (i <= 0) {
      week.push(
        addDays(firstDateOfMonth, i - 1)
      )
    } else if (i > daysInMonth) {
      week.push(
        addDays(lastDateOfMonth, i - daysInMonth)
      )
    } else {
      week.push(
        setDate(date, i)
      )
    }

    if (week.length === 7) {
      month.push(week)
      week = []
    }
  }

  return month
}
