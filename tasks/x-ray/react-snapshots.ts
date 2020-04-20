import { xRay } from '@x-ray/core'
import { reactSnapshots } from '@x-ray/plugin-react-snapshots'

export const main = async () => {
  const xRayReactSnapshots = xRay(reactSnapshots())

  await xRayReactSnapshots([
    require.resolve('./examples/button.tsx'),
    require.resolve('./examples/input.tsx'),
  ])
}
