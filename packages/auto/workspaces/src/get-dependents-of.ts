import { TPackages } from '@auto/utils'
import { TCrossDependents, TDependent } from './types'

export const getDependentsOf = (crossDependents: TCrossDependents, packages: TPackages, name: string) =>
  (Reflect.get(crossDependents, name) || null) as TDependent[] | null
