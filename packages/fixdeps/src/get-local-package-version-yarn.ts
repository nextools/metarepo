import { spawnChildProcess } from 'spown'

export const getLocalPackageVersionYarn = async (packageName: string): Promise<string | null> => {
  const { stdout } = await spawnChildProcess(
    `yarn list --json --depth=0 ${packageName}`,
    { stderr: null }
  )

  const { data } = JSON.parse(stdout.trim())

  if (data.trees.length === 0) {
    return null
  }

  const name: string = data.trees[0].name
  const matches = name.match(/^.+@(.+)$/)

  return matches![1]
}

// {
//   "type": "tree",
//   "data": {
//     "type": "list",
//     "trees": [
//       {
//         "name": "execa@4.0.3",
//         "children": [],
//         "hint": null,
//         "color": null,
//         "depth": 0
//       }
//     ]
//   }
// }
