import { getDepsToModify } from './get-deps-to-modify'
import { TOptions } from './types'

export const hasDepsToModify = async (options: TOptions): Promise<boolean> => {
  const {
    depsToAdd,
    depsToRemove,
    devDepsToAdd,
    peerDevDepsToAdd,
  } = await getDepsToModify(options)

  return depsToAdd.length !== 0 ||
    depsToRemove.length !== 0 ||
    devDepsToAdd.length !== 0 ||
    peerDevDepsToAdd.length !== 0
}
