# dupdep ![npm](https://flat.badgen.net/npm/v/dupdep)

Check for duplicated dependencies across packages in Yarn Workspaces.

## Install

```sh
$ yarn add dupdep
```

## Usage

```ts
type TDuplicatedDependencies = Map</* pkgName */string,
  Map</* depName */string, {
    range: string,
    dependents: Set<{
      pkgName: string,
      range: string
    }>
  }>
>

const getDuplicatedDependencies: () => Promise<TDuplicatedDependencies>
```

```ts
import { getDuplicatedDependencies } from 'dupdep'

const result = await getDuplicatedDependencies()

for (const [pkg, deps] of result) {
  console.error(pkg)

  for (const [dep, { range, dependents }] of deps) {
    console.error(`  ${dep} is ${range} but`)

    for (const dependent of dependents) {
      console.error(`    ${dependent.pkgName} has ${dependent.range}`)
    }
  }
}
// foo
//   dep1 is ^1.0.0 but
//     bar has ^2.0.0
//     baz has ^3.0.0
```
