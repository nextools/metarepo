import suite from '../test'
import { reporter } from './reporter'

export const main = async () => {
  const result = await suite(reporter)

  console.log('-----------------------------------------------------')
  console.log(result)
}
