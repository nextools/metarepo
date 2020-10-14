import { pipe } from 'funcom'
import { combine } from './combine'
import { filter } from './filter'
import { fromInterval } from './from-interval'
import { fromIterable } from './from-iterable'
import { map } from './map'
import { merge } from './merge'
import { share } from './share'
import { skip } from './skip'

export const main = () => {
  const observable = pipe(
    map<number, string>((value) => `>${value}`),
    filter((value) => value !== '>5'),
    share,
    skip(2),
    skip(-2)
    // publish
  )(fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))

  observable(
    (value) => {
      console.log(value)
    },
    () => {
      console.log('DONE')
    },
    (err) => {
      console.error(err)
    }
  )

  observable(
    (value) => {
      console.log(value)
    },
    () => {
      console.log('DONE')
    },
    (err) => {
      console.error(err)
    }
  )

  const timer1Observable = map<number, string>((i) => `  ${i}`)(fromInterval(500))
  const timer2Observable = map<number, number>((i) => i)(fromInterval(1000))
  const timersObservable = combine([timer1Observable, timer2Observable, observable])

  timersObservable(console.log)
}
