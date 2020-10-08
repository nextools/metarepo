import { Math } from 'globl'

export const getRandomInt = (min: number, max: number): number => {
  return min + Math.floor(Math.random() * (max - min))
}
